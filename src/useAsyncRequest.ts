import React, { useCallback, useEffect, useReducer, useState } from 'react'
import type { CancelTokenSource } from 'axios'

export type RequestFunction = (...args: any[]) => Promise<any>
export type TransformFunction<TData> = (res: any) => TData

export type UseAsyncRequestOptions<Data, RequestFunction, Payload> = {
  defaultData?: Data
  requestFunction: RequestFunction
  payload?: Payload
  auto?: boolean
  transformFunction?: TransformFunction<Data>
  axiosCancelTokenSource?: CancelTokenSource
}

export type UseAsyncRequestData<Data> = {
  data: Data | null
  loading: boolean
  error: any
}

export interface UseAsyncRequestResults<Data, RequestFunction> extends UseAsyncRequestData<Data> {
  refetch: () => void
  request: () => Promise<Data | null>
  reset: () => void
}

export enum UseAsyncRequestActionType {
  FETCH = 'FETCH',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RESET = 'RESET'
}

export type UseAsyncRequestAction<TData> =
  | { type: UseAsyncRequestActionType.FETCH }
  | { type: UseAsyncRequestActionType.SUCCESS; data: TData | null }
  | { type: UseAsyncRequestActionType.ERROR; error: any }
  | { type: UseAsyncRequestActionType.RESET }

const defaultResult = {
  data: null,
  loading: false,
  error: null
}

const defaultTransformFunction = <TData>(res: any): TData => res?.data

export const useAsyncRequest = <TData, RequestFunc extends RequestFunction, Payload>(
  options: UseAsyncRequestOptions<TData, RequestFunc, Payload>
): UseAsyncRequestResults<TData, RequestFunc> => {
  const {
    defaultData = null,
    requestFunction,
    payload,
    auto = true,
    transformFunction,
    axiosCancelTokenSource
  } = options
  const [updateKey, setUpdateKey] = useState<number>(() => {
    return auto ? +new Date() : 0
  })
  const [result, dispatch] = useReducer(
    (
      result: UseAsyncRequestData<TData>,
      action: UseAsyncRequestAction<TData>
    ): UseAsyncRequestData<TData> => {
      switch (action.type) {
        case UseAsyncRequestActionType.FETCH:
          return { ...result, data: defaultData, loading: true, error: null }
        case UseAsyncRequestActionType.SUCCESS:
          return { ...result, data: action.data, loading: false, error: null }
        case UseAsyncRequestActionType.ERROR:
          return { ...result, data: defaultData, loading: false, error: action.error }
        case UseAsyncRequestActionType.RESET:
          return { ...result, data: defaultData, loading: false, error: null }
        default:
          return result
      }
    },
    Object.assign({}, defaultResult, { data: defaultData })
  )

  const requestFunctionCallback = useCallback<RequestFunction>(() => {
    return requestFunction({ ...payload, source: axiosCancelTokenSource })
  }, [JSON.stringify(payload), JSON.stringify(axiosCancelTokenSource), updateKey])

  const fetchDataCallback = useCallback<() => Promise<TData | null>>(async () => {
    if (updateKey === 0) {
      return null
    }

    dispatch({ type: UseAsyncRequestActionType.FETCH })
    try {
      const res = await requestFunctionCallback()

      if (res instanceof Error) {
        throw res
      }

      let data: TData | null = null

      if (transformFunction) {
        data = transformFunction(res)
      } else {
        data = defaultTransformFunction<TData>(res)
      }

      dispatch({ type: UseAsyncRequestActionType.SUCCESS, data })
      return data
    } catch (error) {
      dispatch({ type: UseAsyncRequestActionType.ERROR, error })
      return null
    }
  }, [requestFunctionCallback])

  useEffect(() => {
    fetchDataCallback()

    return () => {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel('[use-async-request] Cancel Request')
      }
    }
  }, [fetchDataCallback])

  const refetch = useCallback(() => {
    setUpdateKey(+new Date())
  }, [fetchDataCallback])

  const request = useCallback(() => {
    return fetchDataCallback()
  }, [fetchDataCallback])

  const reset = useCallback(() => {
    setUpdateKey(0)
    dispatch({ type: UseAsyncRequestActionType.RESET })
  }, [dispatch])

  return { ...result, refetch, request, reset }
}

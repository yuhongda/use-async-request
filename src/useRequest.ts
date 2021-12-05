import React, { useCallback, useEffect, useReducer, useState } from 'react'
import type { CancelTokenSource, Canceler } from 'axios'

export type RequestFunction = (...args: any[]) => Promise<any>
export type TransformFunction<TData> = (res: any) => TData

export type UseRequestOptions<Data, RequestFunction> = {
  defaultData: Data
  requestFunction: RequestFunction
  payload?: any
  auto?: boolean
  transformFunction?: TransformFunction<Data>
  axiosCancelTokenSource?: CancelTokenSource
}

export type UseRequestData<Data> = {
  data: Data | null
  loading: boolean
  error: any
}

export interface UseRequestResults<Data, RequestFunction> extends UseRequestData<Data> {
  refetch: () => void
  request: () => Promise<Data | null>
  reset: () => void
}

export enum UseRequestActionType {
  FETCH = 'FETCH',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RESET = 'RESET'
}

export type UseRequestAction<TData> =
  | { type: UseRequestActionType.FETCH }
  | { type: UseRequestActionType.SUCCESS; data: TData | null }
  | { type: UseRequestActionType.ERROR; error: any }
  | { type: UseRequestActionType.RESET }

const defaultResult = {
  data: null,
  loading: false,
  error: null
}

const defaultTransformFunction = <TData>(res: any): TData => res?.data

export const useRequest = <TData, RequestFunc extends RequestFunction>(
  options: UseRequestOptions<TData, RequestFunc>
): UseRequestResults<TData, RequestFunc> => {
  const {
    defaultData,
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
    (result: UseRequestData<TData>, action: UseRequestAction<TData>): UseRequestData<TData> => {
      switch (action.type) {
        case UseRequestActionType.FETCH:
          return { ...result, data: defaultData, loading: true, error: null }
        case UseRequestActionType.SUCCESS:
          return { ...result, data: action.data, loading: false, error: null }
        case UseRequestActionType.ERROR:
          return { ...result, data: defaultData, loading: false, error: action.error }
        case UseRequestActionType.RESET:
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

    dispatch({ type: UseRequestActionType.FETCH })
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

      dispatch({ type: UseRequestActionType.SUCCESS, data })
      return data
    } catch (error) {
      dispatch({ type: UseRequestActionType.ERROR, error })
      return null
    }
  }, [requestFunctionCallback])

  useEffect(() => {
    fetchDataCallback()

    return () => {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel('[use-request] Cancel Request')
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
    dispatch({ type: UseRequestActionType.RESET })
  }, [dispatch])

  return { ...result, refetch, request, reset }
}

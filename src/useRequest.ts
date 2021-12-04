import React, { useCallback, useEffect, useReducer } from 'react'
import type { CancelTokenSource } from 'axios'

export type RequestFunction = (...args: any[]) => Promise<any>
export type TransformFunction<TData> = (res: any) => TData

export type UseRequestOptions<Data, RequestFunction> = {
  defaultData: Data
  requestFunction: RequestFunction
  payload?: any
  transformFunction?: TransformFunction<Data>
  axiosCancelTokenSource?: CancelTokenSource
}

export type UseRequestResults<Data, RequestFunction> = {
  data: Data | null
  loading: boolean
  error: any
  refetch?: () => Promise<Data | null>
  reset?: () => void
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
  const { defaultData, requestFunction, payload, transformFunction, axiosCancelTokenSource } =
    options
  const [result, dispatch] = useReducer(
    (
      result: UseRequestResults<TData, RequestFunc>,
      action: UseRequestAction<TData>
    ): UseRequestResults<TData, RequestFunc> => {
      switch (action.type) {
        case UseRequestActionType.FETCH:
          return { ...result, loading: true, error: null }
        case UseRequestActionType.SUCCESS:
          return { ...result, data: action.data, loading: false, error: null }
        case UseRequestActionType.ERROR:
          return { ...result, loading: false, error: action.error }
        default:
          return result
      }
    },
    Object.assign({}, defaultResult, { data: defaultData })
  )

  const requestFunctionCallback = useCallback<RequestFunction>(() => {
    return requestFunction(payload)
  }, [payload])

  const fetchDataCallback = useCallback<() => Promise<TData | null>>(async () => {
    try {
      const res = await requestFunctionCallback()
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
    dispatch({ type: UseRequestActionType.FETCH })
    fetchDataCallback()

    return () => {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel('[use-request] Cancel Request')
      }
    }
  }, [fetchDataCallback])

  const refetch = useCallback(() => {
    return fetchDataCallback()
  }, [fetchDataCallback])

  const reset = useCallback(() => {
    dispatch({ type: UseRequestActionType.RESET })
  }, [dispatch])

  return { ...result, refetch, reset }
}

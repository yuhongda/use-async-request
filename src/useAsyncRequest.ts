import React, { useCallback, useEffect, useReducer, useState } from 'react'
import store from './store'

export type TransformFunction<TData> = (res: any) => TData

export type RequestFunction<TData> = {
  func: (...args: any[]) => Promise<any>
  payload?: any
  transform?: TransformFunction<TData>
}

export type UseAsyncRequestOptions<Data> = {
  defaultData?: (Data | null)[] | null
  requestFunctions: RequestFunction<Data>[]
  auto?: boolean
}

export type UseAsyncRequestData<Data> = {
  data: (Data | null)[] | null
  loading: boolean
  error: any
}

export interface UseAsyncRequestResults<Data> extends UseAsyncRequestData<Data> {
  refetch: () => void
  request: () => Promise<(Data | null)[] | null>
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
  | { type: UseAsyncRequestActionType.SUCCESS; data: TData[] | null }
  | { type: UseAsyncRequestActionType.ERROR; error: any }
  | { type: UseAsyncRequestActionType.RESET }

const defaultResult = {
  data: null,
  loading: false,
  error: null
}

const defaultTransformFunction = <TData>(res: any): TData => res?.data

export const useAsyncRequest = <TData>(
  options: UseAsyncRequestOptions<TData>
): UseAsyncRequestResults<TData> => {
  const { defaultData = null, requestFunctions, auto = true } = options

  if (!requestFunctions || !Array.isArray(requestFunctions) || requestFunctions.length == 0) {
    throw new Error('"requestFunctions" is required')
  }

  const abortController = new AbortController()
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

  const requestFunctionsCallback = useCallback(async () => {

    /**
     * Load data from localStorage
     */
    const now = +new Date()
    const key = JSON.stringify(
      requestFunctions.map((req) => {
        return { name: req.func.name, payload: req.payload }
      })
    )
    const data = store.get(key)
    if (data && data.expiration >= now) {
      return data.value
    }

    /**
     * Fetch data from API & save to localStorage
     */
    const results = []
    for (const request of requestFunctions) {
      const res = await request.func({ ...request.payload, controller: abortController })

      if (res instanceof Error) {
        throw res
      }

      let data: TData | null = null

      if (request.transform) {
        data = request.transform(res)
      } else {
        data = defaultTransformFunction<TData>(res)
      }

      results.push(data)
    }

    store.set(key, {
      value: results,
      expiration: now + 1000 * 60
    })

    return results
  }, [JSON.stringify(requestFunctions.map((req) => req.payload)), updateKey])

  const fetchDataCallback = useCallback<() => Promise<TData[] | null>>(async () => {
    if (updateKey === 0) {
      return null
    }

    dispatch({ type: UseAsyncRequestActionType.FETCH })
    try {
      const data = await requestFunctionsCallback()

      dispatch({ type: UseAsyncRequestActionType.SUCCESS, data })
      return data
    } catch (error) {
      dispatch({ type: UseAsyncRequestActionType.ERROR, error })
      return null
    }
  }, [requestFunctionsCallback])

  useEffect(() => {
    fetchDataCallback()

    return () => {
      if (abortController) {
        abortController.abort()
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

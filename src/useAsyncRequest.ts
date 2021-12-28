import React, { useCallback, useEffect, useReducer, useState, useRef } from 'react'
import store from './store'

export type TransformFunction<TData> = (res: any) => TData

export type RequestFunction<TData> = {
  func: (...args: any[]) => Promise<any>
  payload?: any
  transform?: TransformFunction<TData>
}

export type UseAsyncRequestOptions<Data> = {
  defaultData?: (Data | null)[] | null | undefined
  requestFunctions: RequestFunction<Data>[]
  auto?: boolean
  persistent?: boolean
  persistentKey?: string
  persistentExpiration?: number
}

export type UseAsyncRequestData<Data> = {
  data: (Data | null)[] | null | undefined
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
  const {
    defaultData,
    requestFunctions,
    auto = true,
    persistent = false,
    persistentKey,
    persistentExpiration = 1000 * 60
  } = options

  if (!requestFunctions || !Array.isArray(requestFunctions) || requestFunctions.length == 0) {
    throw new Error('"requestFunctions" is required')
  }

  const abortController = new AbortController()
  const [updateKey, setUpdateKey] = useState<number>(() => {
    return auto ? +new Date() : 0
  })
  const isRefetch = useRef(false)

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
      }
    },
    Object.assign({}, defaultResult, { data: defaultData })
  )

  const requestFunctionsCallback = useCallback(async () => {
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

    return results
  }, [JSON.stringify(requestFunctions.map((req) => req.payload)), updateKey])

  const fetchDataCallback = useCallback<(isRequestFunc?: boolean) => Promise<TData[] | null>>(
    async (isRequestFunc) => {
      if (updateKey === 0 && !isRequestFunc) {
        return null
      }

      dispatch({ type: UseAsyncRequestActionType.FETCH })
      try {
        let data = null
        const now = +new Date()
        /**
         * Load data from localStorage
         */
        if (persistent && persistentKey) {
          const key = `${persistentKey}-${JSON.stringify(
            requestFunctions.map((req) => {
              return { name: req.func.name, payload: req.payload }
            })
          )}`
          data = store.get(key)
          if (
            data &&
            data.expiration >= now &&
            data.value != null &&
            !isRequestFunc &&
            !isRefetch.current
          ) {
            data = data.value
          } else {
            /**
             * Fetch data from API & save to localStorage
             */
            data = await requestFunctionsCallback()
            store.set(key, {
              value: data,
              expiration: now + persistentExpiration
            })
          }
        } else {
          if (persistent && !persistentKey) {
            console.warn(
              '[use-async-request] "persistentKey" is required. Data will not be loaded from localStorage.'
            )
          }
          /**
           * Fetch data from API
           */
          data = await requestFunctionsCallback()
        }

        // reset refetch flag
        if (isRefetch.current) {
          isRefetch.current = false
        }

        dispatch({ type: UseAsyncRequestActionType.SUCCESS, data })
        return data
      } catch (error) {
        dispatch({ type: UseAsyncRequestActionType.ERROR, error })
        return null
      }
    },
    [requestFunctionsCallback]
  )

  useEffect(() => {
    fetchDataCallback()

    return () => {
      abortController.abort()
    }
  }, [fetchDataCallback])

  const refetch = useCallback(() => {
    isRefetch.current = true
    setUpdateKey(+new Date())
  }, [fetchDataCallback])

  const request = useCallback(() => {
    return fetchDataCallback(true)
  }, [fetchDataCallback])

  const reset = useCallback(() => {
    setUpdateKey(0)
    dispatch({ type: UseAsyncRequestActionType.RESET })
  }, [dispatch])

  return { ...result, refetch, request, reset }
}

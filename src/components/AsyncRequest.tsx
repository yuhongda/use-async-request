import React from 'react'
import type { ReactNode, ElementType } from 'react'
import type { RequestFunction } from '..'
import type { CancelTokenSource } from 'axios'
import { useAsyncRequest } from '..'

export interface AsyncRequestProps {
  defaultData?: any
  requestFunction: RequestFunction
  payload?: Parameters<RequestFunction>[0]
  axiosCancelTokenSource?: CancelTokenSource
  loading?: ReactNode
  success: ElementType
  error?: ElementType
  children?: ReactNode
}

export const AsyncRequest: React.FC<AsyncRequestProps> = ({
  defaultData = null,
  requestFunction,
  payload,
  axiosCancelTokenSource,
  loading: loadingElement = 'Loading...',
  success: SuccessComponent,
  error: ErrorComponent,
  children,
  ...rest
}) => {
  const { data, loading, error, refetch } = useAsyncRequest({
    defaultData,
    requestFunction: requestFunction,
    payload,
    axiosCancelTokenSource
  })

  return (
    <div {...rest}>
      {loading && loadingElement}
      {error && ((ErrorComponent && <ErrorComponent error={error} refetch={refetch} />) || 'error')}
      {data && <SuccessComponent data={data} />}
      {children}
    </div>
  )
}

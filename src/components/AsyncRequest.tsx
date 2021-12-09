import React from 'react'
import type { ReactNode } from 'react'
import type { RequestFunction } from '..'
import { useAsyncRequest } from '..'

export interface AsyncRequestProps<TData> {
  defaultData?: any
  requestFunctions: RequestFunction<TData>[]
  loading?: ReactNode
  success: React.FC<{ data: TData[]; refetch: () => void }>
  error?: React.FC<{ error: any; refetch: () => void }>
  children?: ReactNode
}

export const AsyncRequest: React.FC<AsyncRequestProps<any>> = ({
  defaultData = null,
  requestFunctions,
  loading: loadingElement = 'Loading...',
  success: SuccessComponent,
  error: ErrorComponent,
  children,
  ...rest
}) => {
  const { data, loading, error, refetch } = useAsyncRequest({
    defaultData,
    requestFunctions,
  })

  return (
    <div {...rest}>
      {loading && loadingElement}
      {error && ((ErrorComponent && <ErrorComponent error={error} refetch={refetch} />) || 'error')}
      {data && <SuccessComponent data={data} refetch={refetch} />}
      {children}
    </div>
  )
}

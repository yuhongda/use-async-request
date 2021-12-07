import React from 'react'
import type { ReactNode } from 'react'

export interface AsyncRequestProps {
  loading: ReactNode | string
  success: ReactNode | string
  error: ReactNode | string
  children: ReactNode
}

const AsyncRequest: React.FC<AsyncRequestProps> = () => {
  return <div>AsyncRequest</div>
}

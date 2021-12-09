import '@testing-library/jest-dom'
import { render, waitFor, screen, act } from '@testing-library/react'
import React from 'react'
import { AsyncRequest } from '../src/'

describe('<AsyncRequest /> testing', () => {
  it('AsyncRequest render correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))

    act(() => {
      render(
        <AsyncRequest
          requestFunctions={[
            {
              func: mockFetch,
              payload: { storyType: 'topstories' }
            }
          ]}
          success={({ data }: { data: string[] }) => <div>{data[0]}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(async () => {
      expect(screen.getByText('ok')).toBeInTheDocument()
    })
  })

  it('AsyncRequest render correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))

    act(() => {
      render(
        <AsyncRequest
          defaultData={'default'}
          requestFunctions={[
            {
              func: mockFetch,
              payload: { storyType: 'topstories' }
            }
          ]}
          success={({ data }: { data: string[] }) => <div>{data[0]}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(async () => {
      expect(screen.getByText('ok')).toBeInTheDocument()
    })
  })

  it('testing custom success', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))

    act(() => {
      render(
        <AsyncRequest
          requestFunctions={[
            {
              func: mockFetch,
              payload: { storyType: 'topstories' }
            }
          ]}
          success={({ data }: { data: string[] }) => <div>custom success: {data[0]}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(async () => {
      expect(screen.getByText('custom success: ok')).toBeInTheDocument()
    })
  })

  it('testing default error', async () => {
    const mockFetch = jest.fn(() => {
      return Promise.resolve(new Error('error'))
    })

    act(() => {
      render(
        <AsyncRequest
          requestFunctions={[
            {
              func: mockFetch,
              payload: { storyType: 'topstories' }
            }
          ]}
          success={({ data }: { data: string[] }) => <div>{data[0]}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(async () => {
      expect(screen.getByText('error')).toBeInTheDocument()
    })
  })

  it('testing custom error', async () => {
    const mockFetch = jest.fn(() => {
      return Promise.resolve(new Error('error'))
    })

    act(() => {
      render(
        <AsyncRequest
          requestFunctions={[
            {
              func: mockFetch,
              payload: { storyType: 'topstories' }
            }
          ]}
          success={({ data }: { data: string[] }) => <div>{data[0]}</div>}
          error={({ error }: { error: Error }) => <div>custom error: {error.message}</div>}
        />
      )
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(async () => {
      expect(screen.getByText('custom error: error')).toBeInTheDocument()
    })
  })
})

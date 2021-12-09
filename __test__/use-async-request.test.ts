import { renderHook, act } from '@testing-library/react-hooks'
import { useAsyncRequest } from '../src/'
import axios from 'axios'

describe('use-async-request() testing', () => {
  it('useAsyncRequest run correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<string>({
        defaultData: [''],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    await waitForNextUpdate()
    expect(result.current.data?.[0]).toBe('ok')
  })

  it('checking loading statement', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<string>({
        defaultData: [''],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toBe('')
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data?.[0]).toBe('ok')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing transformFunction', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        data: [
          { code: 1, name: 'a' },
          { code: 2, name: 'b' }
        ]
      })
    )
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<Record<string, any>[]>({
        defaultData: [[]],
        requestFunctions: [
          {
            func: mockFetch,
            payload: {},
            transform: (res: any) =>
              res.data?.map((item: any) => ({ value: item.code, label: item.name }))
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data?.[0]).toEqual([
      { value: 1, label: 'a' },
      { value: 2, label: 'b' }
    ])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing axiosCancelTokenSource', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        data: 'ok'
      })
    )
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<string>({
        defaultData: [''],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toEqual('')
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    act(() => result.current.reset())
    expect(result.current.data?.[0]).toEqual('')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing refetch', async () => {
    let count = 0
    const mockFetch = jest.fn(() => {
      count++
      return Promise.resolve({
        data: count
      })
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        defaultData: [0],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toEqual(0)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toBeCalledTimes(1)
    act(() => result.current.refetch())
    await waitForNextUpdate()
    expect(mockFetch).toBeCalledTimes(2)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    act(() => result.current.refetch())
    await waitForNextUpdate()
    expect(mockFetch).toBeCalledTimes(3)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing request', async () => {
    let count = 0
    const mockFetch = jest.fn(() => {
      count++
      return Promise.resolve({
        data: count
      })
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        defaultData: [0],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toEqual(0)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toBeCalledTimes(1)
    await act(async () => {
      const res = await result.current.request()
      expect(res?.[0]).toEqual(2)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      act(() => result.current.refetch())
    })
  })

  it('testing auto', async () => {
    let count = 0
    const mockFetch = jest.fn(() => {
      count++
      return Promise.resolve({
        data: count
      })
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        defaultData: [0],
        requestFunctions: [
          {
            func: mockFetch
          }
        ],
        auto: false
      })
    )

    expect(result.current.data?.[0]).toEqual(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toBeCalledTimes(0)
    act(() => result.current.refetch())
    expect(result.current.loading).toBe(true)
    await waitForNextUpdate()
    expect(mockFetch).toBeCalledTimes(1)
    expect(result.current.data?.[0]).toEqual(1)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing error', async () => {
    const mockFetch = jest.fn(() => {
      return Promise.resolve(new Error('error'))
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        defaultData: [0],
        requestFunctions: [
          {
            func: mockFetch
          }
        ]
      })
    )

    expect(result.current.data?.[0]).toEqual(0)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data?.[0]).toEqual(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toEqual(new Error('error'))
  })

  it('testing error: requestFunctions null', async () => {
    try {
      const { result, waitForNextUpdate } = renderHook(() =>
        useAsyncRequest({
          defaultData: [0],
          requestFunctions: null
        })
      )

      expect(result.current.data?.[0]).toEqual(0)
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe(null)
      await waitForNextUpdate()
    } catch (e) {
      expect(e).toEqual(new Error('"requestFunctions" is required'))
    }
  })
})

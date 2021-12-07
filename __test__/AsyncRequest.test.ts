import { renderHook, act } from '@testing-library/react-hooks'
import { useAsyncRequest } from '../src/'
import axios from 'axios'

describe('normal', () => {
  it('useAsyncRequest run correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<string, typeof mockFetch, {}>({
        defaultData: '',
        requestFunction: mockFetch,
        payload: {}
      })
    )

    await waitForNextUpdate()
    expect(result.current.data).toBe('ok')
  })

  it('checking loading statement', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest<string, typeof mockFetch, {}>({
        defaultData: '',
        requestFunction: mockFetch,
        payload: {}
      })
    )

    expect(result.current.data).toBe('')
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data).toBe('ok')
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
      useAsyncRequest<Record<string, any>[], typeof mockFetch, {}>({
        defaultData: [],
        requestFunction: mockFetch,
        transformFunction: (res: any) =>
          res.data?.map((item: any) => ({ value: item.code, label: item.name })),
        payload: {}
      })
    )

    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data).toEqual([
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
      useAsyncRequest<string, typeof mockFetch, {}>({
        defaultData: '',
        requestFunction: mockFetch,
        payload: {},
        axiosCancelTokenSource: axios.CancelToken.source()
      })
    )

    expect(result.current.data).toEqual('')
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    act(() => result.current.reset())
    expect(result.current.data).toEqual('')
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
        defaultData: 0,
        requestFunction: mockFetch,
        payload: {},
        axiosCancelTokenSource: axios.CancelToken.source()
      })
    )

    expect(result.current.data).toEqual(0)
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
        defaultData: 0,
        requestFunction: mockFetch,
        payload: {},
        axiosCancelTokenSource: axios.CancelToken.source()
      })
    )

    expect(result.current.data).toEqual(0)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toBeCalledTimes(1)
    await act(async () => {
      const res = await result.current.request()
      expect(res).toEqual(2)
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
        defaultData: 0,
        requestFunction: mockFetch,
        payload: {},
        auto: false,
        axiosCancelTokenSource: axios.CancelToken.source()
      })
    )

    expect(result.current.data).toEqual(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(mockFetch).toBeCalledTimes(0)
    act(() => result.current.refetch())
    expect(result.current.loading).toBe(true)
    await waitForNextUpdate()
    expect(mockFetch).toBeCalledTimes(1)
    expect(result.current.data).toEqual(1)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('testing error', async () => {
    const mockFetch = jest.fn(() => {
      return Promise.resolve(new Error('error'))
    })
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        defaultData: 0,
        requestFunction: mockFetch,
        payload: {},
        axiosCancelTokenSource: axios.CancelToken.source()
      })
    )

    expect(result.current.data).toEqual(0)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    await waitForNextUpdate()
    expect(result.current.data).toEqual(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toEqual(new Error('error'))
  })

})

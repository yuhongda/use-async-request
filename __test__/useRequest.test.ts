import { renderHook, act } from '@testing-library/react-hooks'
import { useRequest } from '../src/useRequest'

describe('normal', () => {
  it('useRequest run correctly', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'ok' }))
    const { result, waitForNextUpdate } = renderHook(() =>
      useRequest<string, typeof mockFetch>({
        defaultData: '',
        requestFunction: mockFetch,
        payload: {}
      })
    )

    await waitForNextUpdate()
    expect(result.current.data).toBe('ok')
  })
})

import { renderHook, act } from '@testing-library/react-hooks'
import store from '../src/store'

beforeEach(() => {
  store.clear()
})

describe('testing store', () => {
  it('store works correctly', async () => {
    store.set('test', { value: 'ok' })
    const data = store.get('test')
    expect(data?.value).toBe('ok')
    store.remove('test')
    const data2 = store.get('test')
    expect(data2).toBe(null)
  })

  it('testing fallback to use memory store: setItem', async () => {
    jest.spyOn(console, 'warn').mockImplementation()
    const setItem = Storage.prototype.setItem
    Storage.prototype.setItem = () => {
      throw new Error()
    }

    store.set('test', { value: 'ok' })
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to set value to localStorage, use memory instead')
    )
    const data = store.get('test')
    expect(data?.value).toBe('ok')
    Storage.prototype.setItem = setItem
  })

  it('testing fallback to use memory store: getItem', async () => {
    const spy = jest.spyOn(console, 'warn')
    const getItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new Error()
    }

    const data = store.get('test')
    expect(data?.value).toBe(undefined)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to get value from localStorage')
    )

    Storage.prototype.getItem = getItem
  })

  it('testing fallback to use memory store: removeItem', async () => {
    const spy = jest.spyOn(console, 'warn')
    const removeItem = Storage.prototype.removeItem
    Storage.prototype.removeItem = () => {
      throw new Error()
    }

    store.remove('test')
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to remove value from localStorage, use memory instead'),
    )

    Storage.prototype.removeItem = removeItem
  })

  it('testing fallback to use memory store: clear', async () => {
    const spy = jest.spyOn(console, 'warn')
    const clear = Storage.prototype.clear
    Storage.prototype.clear = () => {
      throw new Error()
    }

    store.clear()
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to clear value from localStorage, use memory instead'),
    )

    Storage.prototype.clear = clear
  })
})

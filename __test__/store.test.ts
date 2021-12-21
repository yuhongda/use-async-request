import { renderHook, act } from '@testing-library/react-hooks'
import store from '../src/store'

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
      expect.stringContaining('Failed to set value to localStorage, use memory instead'),
    )
    const data = store.get('test')
    expect(data?.value).toBe('ok')
    Storage.prototype.setItem = setItem
  })

  it('testing fallback to use memory store: getItem', async () => {
    const setItem = Storage.prototype.setItem
    const getItem = Storage.prototype.getItem
    Storage.prototype.setItem = () => {
      throw new Error()
    }
    Storage.prototype.getItem = () => {
      throw new Error()
    }

    store.set('test', { value: 'ok' })
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()
    const data = store.get('test')
    expect(data?.value).toBe('ok')
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to get value from localStorage'),
    )
    
    Storage.prototype.setItem = setItem
    Storage.prototype.getItem = getItem
  })

  // it('testing fallback to use memory store: removeItem', async () => {
  //   jest.spyOn(console, 'warn').mockImplementation()
  //   const removeItem = Storage.prototype.removeItem
  //   Storage.prototype.removeItem = () => {
  //     throw new Error()
  //   }

  //   store.set('test', { value: 'ok' })
  //   const data = store.get('test')
  //   expect(data?.value).toBe('ok')
  //   store.remove('test')
  //   const data2 = store.get('test')
  //   expect(data2).toBe(null)
  //   expect(console.warn).toHaveBeenCalledWith(
  //     expect.stringContaining('Failed to remove value from localStorage, use memory instead'),
  //   )
    
  //   Storage.prototype.removeItem = removeItem
  // })
})

const store: Record<string, unknown> = {}

const get = (key: string) => {
  if (store[key]) return store[key]

  try {
    const value = localStorage.getItem(key)

    if (value !== undefined && value !== null) {
      return JSON.parse(value)
    } else {
      return null
    }
  } catch (error) {
    throw new Error(`Failed to get value from localStorage`)
  }
}

const set = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    store[key] = null
  } catch (error) {
    store[key] = value
    throw new Error(`Failed to set value to localStorage`)
  }
}

const remove = (key: string) => {
  try {
    localStorage.removeItem(key)
    store[key] = null
  } catch (error) {
    store[key] = null
    throw new Error(`Failed to remove value from localStorage`)
  }
}

export default {
  get,
  set,
  remove
}

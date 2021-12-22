let store: Record<string, unknown> = {}

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
    console.warn(`Failed to get value from localStorage`)
  }
}

const set = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    store[key] = null
  } catch (error) {
    store[key] = value
    console.warn(`Failed to set value to localStorage, use memory instead`)
  }
}

const remove = (key: string) => {
  try {
    localStorage.removeItem(key)
    store[key] = null
  } catch (error) {
    store[key] = null
    console.warn(`Failed to remove value from localStorage, use memory instead`)
  }
}

const clear = () => {
  try {
    localStorage.clear()
    store = {}
  } catch (error) {
    store = {}
    console.warn(`Failed to clear value from localStorage, use memory instead`)
  }
}

export default {
  get,
  set,
  remove,
  clear
}

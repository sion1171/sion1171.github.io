// localStorage can throw (private mode, blocked site data) — treat failures as "no value"
export function getStored(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function setStored(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

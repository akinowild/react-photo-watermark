const STORAGE_KEY = 'react-photo-watermark-controls'

export function loadControls(defaultControls) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultControls
    const parsed = JSON.parse(raw)
    return { ...defaultControls, ...parsed }
  } catch {
    return defaultControls
  }
}

export function saveControls(controls) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(controls))
}

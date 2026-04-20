const STORAGE_KEY = 'photo-watermark-controls-v1'

export function loadControls(defaultControls) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return defaultControls
        const parsed = JSON.parse(raw)
        return { ...defaultControls, ...parsed }
    } catch {
        return defaultControls
    }
}

export function saveControls(controls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controls))
}

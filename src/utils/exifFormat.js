export function formatExposureTime(value) {
  if (!value) return '--'
  if (typeof value === 'number') {
    if (value >= 1) return `${value}s`
    return `1/${Math.round(1 / value)}`
  }
  if (typeof value === 'string') {
    if (value.includes('/')) return value
    const num = Number(value)
    if (!Number.isNaN(num)) return formatExposureTime(num)
  }
  if (value.numerator && value.denominator) {
    return value.denominator === 1
        ? `${value.numerator}s`
        : `${value.numerator}/${value.denominator}`
  }
  return String(value)
}

export function formatFNumber(value) {
  if (!value) return '--'
  if (typeof value === 'number') {
    return `f/${value.toFixed(1).replace('.0', '')}`
  }
  if (value.numerator && value.denominator) {
    return `f/${(value.numerator / value.denominator).toFixed(1).replace('.0', '')}`
  }
  return `f/${String(value).replace(/^f\/?/i, '')}`
}

export function formatFocal(value) {
  if (!value) return '--'
  if (typeof value === 'number') return `${Math.round(value)}mm`
  if (value.numerator && value.denominator) {
    return `${Math.round(value.numerator / value.denominator)}mm`
  }
  return String(value).replace(/\.0mm$/, 'mm')
}

export function formatDate(value, style) {
  if (!value) return '--'

  let date = null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    date = value
  } else if (typeof value === 'string') {
    const trimmed = value.trim()

    const exifMatch = trimmed.match(
        /^(\d{4})[:\-](\d{2})[:\-](\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/
    )

    if (exifMatch) {
      const [, y, m, d, hh = '00', mm = '00', ss = '00'] = exifMatch
      const dateSep = style === 'dash' ? '-' : style === 'slash' ? '/' : '.'
      return `${y}${dateSep}${m}${dateSep}${d} ${hh}:${mm}:${ss}`
    }

    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed
    } else {
      return trimmed
    }
  } else {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed
    } else {
      return String(value)
    }
  }

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  const dateSep = style === 'dash' ? '-' : style === 'slash' ? '/' : '.'

  return `${y}${dateSep}${m}${dateSep}${d} ${hh}:${mm}:${ss}`
}

export function getExifValue(exifData, name, fallbackNames = []) {
  const keys = [name, ...fallbackNames]
  for (const key of keys) {
    if (
        exifData[key] !== undefined &&
        exifData[key] !== null &&
        exifData[key] !== ''
    ) {
      return exifData[key]
    }
  }
  return null
}

export function buildDisplayInfo(exifData, controls) {
  return {
    aperture: formatFNumber(getExifValue(exifData, 'FNumber', ['ApertureValue'])),
    shutter: formatExposureTime(getExifValue(exifData, 'ExposureTime')),
    iso: getExifValue(exifData, 'ISO', ['ISOSpeedRatings', 'PhotographicSensitivity', 'iso']) || '--',
    focal: formatFocal(getExifValue(exifData, 'FocalLength')),
    date: formatDate(
        getExifValue(exifData, 'DateTimeOriginal', ['DateTime']),
        controls.dateFormat
    ),
    model: getExifValue(exifData, 'Model') || '--',
    lens: getExifValue(exifData, 'LensModel') || getExifValue(exifData, 'LensInfo') || '--',
    copyright: controls.copyrightText.trim() || '© yourname'
  }
}

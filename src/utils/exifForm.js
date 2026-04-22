import {
  formatExposureTime,
  formatFNumber,
  formatFocal,
  formatDate,
  getExifValue
} from './exifFormat'

export function buildExifForm(exifData, controls) {
  return {
    aperture: {
      label: '光圈',
      value: formatFNumber(
        getExifValue(exifData, 'FNumber', ['fNumber', 'ApertureValue', 'apertureValue'])
      ),
      visible: true
    },
    shutter: {
      label: '快门',
      value: formatExposureTime(
        getExifValue(exifData, 'ExposureTime', ['exposureTime'])
      ),
      visible: true
    },
    iso: {
      label: 'ISO',
      value: String(
        getExifValue(exifData, 'ISO', ['ISOSpeedRatings', 'PhotographicSensitivity', 'iso']) ?? '--'
      ),
      visible: true
    },
    focal: {
      label: '焦距',
      value: formatFocal(
        getExifValue(exifData, 'FocalLength', ['focalLength'])
      ),
      visible: true
    },
    date: {
      label: '日期',
      value: formatDate(
        getExifValue(exifData, 'DateTimeOriginal', ['dateTimeOriginal', 'DateTime', 'CreateDate', 'createDate']),
        controls.dateFormat
      ),
      visible: true
    },
    model: {
      label: '机身',
      value: String(getExifValue(exifData, 'Model', ['model']) ?? '--'),
      visible: true
    },
    lens: {
      label: '镜头',
      value: String(getExifValue(exifData, 'LensModel', ['lensModel', 'LensInfo', 'lens']) ?? '--'),
      visible: true
    },
    copyright: {
      label: '版权',
      value: controls.copyrightText?.trim() || '© yourname',
      visible: true
    }
  }
}

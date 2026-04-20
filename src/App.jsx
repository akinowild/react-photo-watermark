import React, { useMemo, useRef, useState } from 'react'
import * as exifr from 'exifr'
import ControlPanel from './components/ControlPanel'
import PreviewCanvas from './components/PreviewCanvas'
import Dropzone from './components/Dropzone'
import { defaultControls, emptyExif } from './utils/defaults'
import { loadControls, saveControls } from './utils/storage'

export default function App() {
  const initialControlsRef = useRef(loadControls(defaultControls))
  const [controls, setControls] = useState(initialControlsRef.current)
  const [image, setImage] = useState(null)
  const [exifData, setExifData] = useState(emptyExif)
  const [statusText, setStatusText] = useState('尚未加载图片。')

  const summary = useMemo(() => {
    return image ? `已加载图片。${statusText}` : statusText
  }, [image, statusText])

  const updateControl = (key, value) => {
    setControls((prev) => ({ ...prev, [key]: value }))
  }

  const loadImageFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      const img = new Image()
      img.onload = async () => {
        setImage(img)
        try {
          const tags = (await exifr.parse(file, {
            tiff: true,
            exif: true,
            gps: false,
            xmp: false,
            icc: false,
            iptc: false,
            jfif: false,
            ihdr: false
          })) || {}

          setExifData(tags)
          setStatusText('EXIF 已成功读取，可继续调节参数并导出。')

          if (controls.copyrightText === defaultControls.copyrightText) {
            const author = tags.artist || tags.copyright || ''
            if (author) {
              setControls((prev) => ({
                ...prev,
                copyrightText: String(author).startsWith('©')
                    ? String(author)
                    : `© ${author}`
              }))
            }
          }
        } catch (error) {
          console.error('EXIF 读取失败:', error)
          setExifData(emptyExif)
          setStatusText('图片已加载，但 EXIF 读取失败，可能是图片已被平台压缩或不包含完整元数据。')
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const onFileChange = (e) => loadImageFile(e.target.files?.[0])

  const onDownload = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas || !image) {
      window.alert('请先导入一张照片')
      return
    }

    canvas.toBlob((blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'watermarked-photo.png'
      a.click()
      URL.revokeObjectURL(a.href)
    }, 'image/png', 1)
  }

  const onReset = () => {
    setControls(defaultControls)
    setStatusText(image ? '参数已重置。' : '尚未加载图片。')
  }

  const onSavePreset = () => {
    saveControls(controls)
    setStatusText(
        image
            ? '当前参数已保存到本地，刷新页面后会自动恢复。'
            : '默认参数已保存到本地，刷新页面后会自动恢复。'
    )
  }

  return (
      <div className="app-shell">
        <ControlPanel
            controls={controls}
            onChange={updateControl}
            onReset={onReset}
            onDownload={onDownload}
            onFileChange={onFileChange}
            onSavePreset={onSavePreset}
        />

        <main className="workspace">
          <Dropzone onFileDrop={loadImageFile} />
          <PreviewCanvas image={image} exifData={exifData} controls={controls} />
          <div className="hint note">
            工具功能逐步完善和更新迭代中，如使用发现问题或者有其它更好的需求，请联系作者harrycraft，作者周末才回复。
          </div>
        </main>
      </div>
  )
}

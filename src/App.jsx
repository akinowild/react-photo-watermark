import React, { useMemo, useRef, useState } from 'react'
import * as exifr from 'exifr'
import ControlPanel from './components/ControlPanel'
import PreviewCanvas from './components/PreviewCanvas'
import Dropzone from './components/Dropzone'
import { defaultControls, emptyExif } from './utils/defaults'
import { loadControls, saveControls } from './utils/storage'
import { buildExifForm } from './utils/exifForm'

export default function App() {
  const initialControlsRef = useRef(loadControls(defaultControls))
  const [controls, setControls] = useState(initialControlsRef.current)
  const [image, setImage] = useState(null)
  const [exifData, setExifData] = useState(emptyExif)
  const [exifForm, setExifForm] = useState(buildExifForm(emptyExif, initialControlsRef.current))
  const [statusText, setStatusText] = useState('尚未加载图片。')

  const summary = useMemo(() => {
    return image ? `已加载图片。${statusText}` : statusText
  }, [image, statusText])

  const updateControl = (key, value) => {
    setControls((prev) => {
      const next = { ...prev, [key]: value }

      if (key === 'copyrightText' || key === 'dateFormat') {
        setExifForm((prevForm) => {
          const rebuilt = buildExifForm(exifData, next)
          return {
            ...prevForm,
            date: {
              ...prevForm.date,
              value: rebuilt.date.value
            },
            copyright: {
              ...prevForm.copyright,
              value: next.copyrightText?.trim() || '© yourname'
            }
          }
        })
      }

      return next
    })
  }

  const updateExifField = (key, patch) => {
    setExifForm((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch
      }
    }))
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

          const nextControls = { ...controls }

          if (controls.copyrightText === defaultControls.copyrightText) {
            const author = tags.artist || tags.copyright || tags.Artist || tags.Copyright || ''
            if (author) {
              nextControls.copyrightText = String(author).startsWith('©')
                ? String(author)
                : `© ${author}`

              setControls((prev) => ({
                ...prev,
                copyrightText: nextControls.copyrightText
              }))
            }
          }

          setExifForm(buildExifForm(tags, nextControls))
          setStatusText('EXIF 已成功读取，可继续修改 EXIF 表单内容并控制显示字段。')
        } catch (error) {
          console.error('EXIF 读取失败:', error)
          setExifData(emptyExif)
          setExifForm(buildExifForm(emptyExif, controls))
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
    setExifForm(buildExifForm(exifData, defaultControls))
    setStatusText(image ? '参数已重置。' : '尚未加载图片。')
  }

  const onSavePreset = () => {
    saveControls(controls)
    setStatusText(image ? '当前参数已保存到本地，刷新页面后会自动恢复。' : '默认参数已保存到本地，刷新页面后会自动恢复。')
  }

  return (
    <div className="app-shell">
      <ControlPanel
        controls={controls}
        exifForm={exifForm}
        onChange={updateControl}
        onExifFieldChange={updateExifField}
        onReset={onReset}
        onDownload={onDownload}
        onFileChange={onFileChange}
        onSavePreset={onSavePreset}
      />

      <main className="workspace">
        <Dropzone onFileDrop={loadImageFile} />
        <PreviewCanvas
          image={image}
          exifData={exifData}
          exifForm={exifForm}
          controls={controls}
        />
        <div className="hint note">
          {summary} 工具功能逐步完善和更新迭代中，如使用发现问题或者有其它更好的需求，请联系作者@harrycraft，作者周末才回复。
        </div>
      </main>

    </div>
  )
}

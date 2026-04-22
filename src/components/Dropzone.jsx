import React, { useState } from 'react'

export default function Dropzone({ onFileDrop }) {
  const [active, setActive] = useState(false)

  const onDragOver = (e) => {
    e.preventDefault()
    setActive(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setActive(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileDrop(file)
  }

  return (
    <div
      className={`dropzone ${active ? 'active' : ''}`}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div>
        <strong>拖拽图片到这里，或使用左侧文件选择</strong>
        <div className="hint" style={{ marginTop: 12 }}>
          推荐上传原始 JPG，便于读取 EXIF 并填充可编辑表单。
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useRef } from 'react'
import { renderCanvas } from '../utils/canvasRenderer'

export default function PreviewCanvas({ image, exifData, exifForm, controls }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    renderCanvas(canvasRef.current, image, exifData, exifForm, controls)
  }, [image, exifData, exifForm, controls])

  return (
    <div className="preview-shell">
      <canvas ref={canvasRef} />
    </div>
  )
}

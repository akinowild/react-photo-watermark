function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

export function drawIcon(ctx, type, x, y, size, color) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1.5, size * 0.055)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.translate(x, y)

  const s = size

  switch (type) {
    case 'aperture': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.38, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2)
      ctx.stroke()

      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 / 6) * i - Math.PI / 6
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * s * 0.14, Math.sin(a) * s * 0.14)
        ctx.lineTo(
          Math.cos(a + 0.35) * s * 0.34,
          Math.sin(a + 0.35) * s * 0.34
        )
        ctx.stroke()
      }
      break
    }

    case 'shutter': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, -s * 0.45)
      ctx.lineTo(0, -s * 0.32)
      ctx.moveTo(-s * 0.16, -s * 0.48)
      ctx.lineTo(s * 0.16, -s * 0.48)
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -s * 0.16)
      ctx.moveTo(0, 0)
      ctx.lineTo(s * 0.12, 0)
      ctx.stroke()
      break
    }

    case 'iso': {
      drawRoundedRect(ctx, -s * 0.26, -s * 0.32, s * 0.38, s * 0.64, s * 0.08)
      ctx.stroke()
      drawRoundedRect(ctx, s * 0.02, -s * 0.18, s * 0.24, s * 0.36, s * 0.06)
      ctx.stroke()
      break
    }

    case 'focal': {
      ctx.beginPath()
      ctx.moveTo(-s * 0.38, s * 0.06)
      ctx.lineTo(s * 0.12, -s * 0.28)
      ctx.lineTo(s * 0.12, s * 0.28)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-s * 0.18, s * 0.02)
      ctx.lineTo(s * 0.28, -s * 0.18)
      ctx.moveTo(-s * 0.1, s * 0.08)
      ctx.lineTo(s * 0.26, 0)
      ctx.moveTo(-s * 0.02, s * 0.14)
      ctx.lineTo(s * 0.2, s * 0.12)
      ctx.stroke()
      break
    }

    case 'date': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -s * 0.14)
      ctx.moveTo(0, 0)
      ctx.lineTo(s * 0.12, s * 0.08)
      ctx.stroke()
      break
    }

    case 'camera': {
      drawRoundedRect(ctx, -s * 0.34, -s * 0.18, s * 0.68, s * 0.38, s * 0.08)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-s * 0.18, -s * 0.18)
      ctx.lineTo(-s * 0.1, -s * 0.3)
      ctx.lineTo(s * 0.04, -s * 0.3)
      ctx.stroke()
      break
    }

    case 'lens': {
      drawRoundedRect(ctx, -s * 0.26, -s * 0.22, s * 0.52, s * 0.44, s * 0.08)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-s * 0.2, -s * 0.3)
      ctx.lineTo(s * 0.2, -s * 0.3)
      ctx.moveTo(-s * 0.18, s * 0.3)
      ctx.lineTo(s * 0.18, s * 0.3)
      ctx.stroke()
      break
    }

    case 'copyright': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2)
      ctx.stroke()

      ctx.font = `${s * 0.5}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = color
      ctx.fillText('C', 0, s * 0.02)
      break
    }
  }

  ctx.restore()
}

export function renderCanvas(canvas, image, exifData, exifForm, controls) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const outputWidth = controls.outputWidth || 1600

  if (!image) {
    canvas.width = outputWidth
    canvas.height = Math.round(outputWidth * 0.58)

    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    g.addColorStop(0, '#171b21')
    g.addColorStop(1, '#24384d')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(255,255,255,0.76)'
    ctx.font = '600 40px Inter, sans-serif'
    ctx.fillText('等待导入图片', 80, 120)

    ctx.font = '300 24px Inter, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillText('上传照片后会在这里实时预览', 80, 165)
    return
  }

  const sourceW = image.naturalWidth || image.width
  const sourceH = image.naturalHeight || image.height
  const scale = outputWidth / sourceW
  const outputHeight = Math.round(sourceH * scale)

  canvas.width = outputWidth
  canvas.height = outputHeight
  ctx.clearRect(0, 0, outputWidth, outputHeight)

  ctx.drawImage(image, 0, 0, outputWidth, outputHeight)

  if (controls.blur > 0) {
    ctx.save()
    ctx.filter = `blur(${controls.blur}px)`
    ctx.globalAlpha = 0.95
    ctx.drawImage(image, 0, 0, outputWidth, outputHeight)
    ctx.restore()
  }

  ctx.save()
  ctx.fillStyle = `rgba(14, 22, 30, ${controls.overlay})`
  ctx.fillRect(0, 0, outputWidth, outputHeight)
  ctx.restore()

  const barWidth = outputWidth * (controls.barWidth / 100)

  if (barWidth > 0) {
    const grad = ctx.createLinearGradient(0, 0, barWidth, 0)
    const s = hexToRgb(controls.gradStart)
    const e = hexToRgb(controls.gradEnd)

    grad.addColorStop(
      0,
      `rgba(${s.r}, ${s.g}, ${s.b}, ${controls.gradStartAlpha ?? 0.68})`
    )
    grad.addColorStop(
      0.55,
      `rgba(${e.r}, ${e.g}, ${e.b}, ${controls.gradEndAlpha ?? 0.22})`
    )
    grad.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, barWidth, outputHeight)
  }

  const left = controls.leftPadding ?? 56
  const top = controls.topPadding ?? 86
  const rightPadding = 56

  const iconOffsetX = 18
  const textOffsetX = 58
  const dividerWidth = 1.25
  const textNudgeY = 2
  const dividerGapFactor = 3.7
  const bottomStartFactor = 0.75

  const iconX = left + iconOffsetX
  const textX = left + textOffsetX

  const topIconSize = Math.max(18, controls.primaryFontSize * 1.15)
  const bottomIconSize = Math.max(16, controls.secondaryFontSize * 1.15)

  const mainGap = controls.primaryFontSize * controls.lineHeight
  const secondGap = controls.secondaryFontSize * controls.lineHeight
  const lineY = top + mainGap * dividerGapFactor

  const textColor = `rgba(255,255,255,${controls.textOpacity})`
  const thinColor = `rgba(255,255,255,${controls.textOpacity * 0.72})`

  const topRows = [
    ['aperture', exifForm?.aperture?.value, exifForm?.aperture?.visible],
    ['shutter', exifForm?.shutter?.value, exifForm?.shutter?.visible],
    ['iso', exifForm?.iso?.value ? `ISO ${exifForm.iso.value}` : '--', exifForm?.iso?.visible],
    ['focal', exifForm?.focal?.value, exifForm?.focal?.visible]
  ].filter(([, value, visible]) => visible !== false && value && value !== '--')

  const bottomRows = [
    ['date', exifForm?.date?.value, exifForm?.date?.visible],
    ['camera', exifForm?.model?.value, exifForm?.model?.visible],
    ['lens', exifForm?.lens?.value, exifForm?.lens?.visible],
    ['copyright', exifForm?.copyright?.value, exifForm?.copyright?.visible]
  ].filter(([, value, visible]) => visible !== false && value && value !== '--')

  ctx.fillStyle = textColor
  ctx.textBaseline = 'middle'
  ctx.font = `300 ${controls.primaryFontSize}px Inter, sans-serif`

  topRows.forEach((row, i) => {
    const [icon, text] = row
    const y = top + i * mainGap
    drawIcon(ctx, icon, iconX, y, topIconSize, textColor)
    ctx.fillText(text, textX, y + textNudgeY)
  })

  if (topRows.length > 0 || bottomRows.length > 0) {
    ctx.save()
    ctx.strokeStyle = thinColor
    ctx.lineWidth = dividerWidth
    ctx.beginPath()
    ctx.moveTo(left, lineY)
    ctx.lineTo(outputWidth - rightPadding, lineY)
    ctx.stroke()
    ctx.restore()
  }

  ctx.font = `300 ${controls.secondaryFontSize}px Inter, sans-serif`

  bottomRows.forEach((row, i) => {
    const [icon, text] = row
    const y = lineY + secondGap * (i + bottomStartFactor)
    drawIcon(ctx, icon, iconX, y, bottomIconSize, textColor)
    ctx.fillText(text, textX, y + textNudgeY)
  })
}

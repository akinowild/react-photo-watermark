import React from 'react'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Slider,
  Switch,
  Text,
  TextField
} from '@radix-ui/themes'

function RangeField({ label, value, min, max, step, onChange, suffix = '' }) {
  const numericValue = typeof value === 'number' ? value : Number(value)

  return (
    <Box>
      <Flex justify="between" align="center" mb="2">
        <Text size="2">{label}</Text>
        <Text size="2" color="gray">
          {typeof value === 'number' ? `${value}${suffix}` : value}
        </Text>
      </Flex>
      <Slider
        value={[numericValue]}
        min={Number(min)}
        max={Number(max)}
        step={Number(step)}
        onValueChange={(vals) => onChange({ target: { value: vals[0] } })}
      />
    </Box>
  )
}

function TextFieldRow({ label, value, onChange, placeholder }) {
  return (
    <Box>
      <Text as="label" size="2" mb="1" style={{ display: 'block' }}>
        {label}
      </Text>
      <TextField.Root
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Box>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <Box>
      <Text as="label" size="2" mb="1" style={{ display: 'block' }}>
        {label}
      </Text>
      <input
        type="color"
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          height: 40,
          border: '1px solid var(--gray-6)',
          borderRadius: 10,
          background: 'transparent'
        }}
      />
    </Box>
  )
}

function ExifFieldEditor({ fieldKey, field, onChange }) {
  return (
    <Card size="1">
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text weight="medium">{field.label}</Text>
          <Flex align="center" gap="2">
            <Text size="2" color="gray">显示</Text>
            <Switch
              checked={field.visible}
              onCheckedChange={(checked) => onChange(fieldKey, { visible: checked })}
            />
          </Flex>
        </Flex>

        <TextField.Root
          value={field.value}
          onChange={(e) => onChange(fieldKey, { value: e.target.value })}
          placeholder={`请输入${field.label}`}
        />
      </Flex>
    </Card>
  )
}

export default function ControlPanel({
  controls,
  exifForm,
  onChange,
  onExifFieldChange,
  onReset,
  onDownload,
  onFileChange,
  onSavePreset
}) {
  return (
    <aside className="panel">
      <Flex direction="column" gap="4">
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="3">导入</Heading>
            <input type="file" accept="image/*" onChange={onFileChange} />
          </Flex>
        </Card>
        <Grid columns="2" gap="4">
        <Card>
          <Flex direction="column" gap="4">
            <RangeField
              label="背景模糊"
              value={controls.blur}
              min="0"
              max="40"
              step="1"
              suffix=" px"
              onChange={(e) => onChange('blur', Number(e.target.value))}
            />
            <RangeField
              label="蒙版透明度"
              value={controls.overlay.toFixed(2)}
              min="0"
              max="0.85"
              step="0.01"
              onChange={(e) => onChange('overlay', Number(e.target.value))}
            />
            <RangeField
              label="信息栏宽度"
              value={controls.barWidth}
              min="0"
              max="200"
              step="1"
              suffix=" %"
              onChange={(e) => onChange('barWidth', Number(e.target.value))}
            />

            <RangeField
              label="文字透明度"
              value={controls.textOpacity.toFixed(2)}
              min="0.3"
              max="1"
              step="0.01"
              onChange={(e) => onChange('textOpacity', Number(e.target.value))}
            />

            <Grid columns="2" gap="3">
              <ColorField
                label="渐变起始色"
                value={controls.gradStart}
                onChange={(e) => onChange('gradStart', e.target.value)}
              />
              <ColorField
                label="渐变结束色"
                value={controls.gradEnd}
                onChange={(e) => onChange('gradEnd', e.target.value)}
              />
            </Grid>

            <RangeField
              label="起始色透明度"
              value={controls.gradStartAlpha.toFixed(2)}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => onChange('gradStartAlpha', Number(e.target.value))}
            />

            <RangeField
              label="结束色透明度"
              value={controls.gradEndAlpha.toFixed(2)}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => onChange('gradEndAlpha', Number(e.target.value))}
            />

            <RangeField
              label="左边距"
              value={controls.leftPadding}
              min="0"
              max="240"
              step="1"
              suffix=" px"
              onChange={(e) => onChange('leftPadding', Number(e.target.value))}
            />

            <RangeField
              label="顶边距"
              value={controls.topPadding}
              min="0"
              max="240"
              step="1"
              suffix=" px"
              onChange={(e) => onChange('topPadding', Number(e.target.value))}
            />

            {/*<RangeField*/}
            {/*  label="输出宽度"*/}
            {/*  value={controls.outputWidth}*/}
            {/*  min="800"*/}
            {/*  max="3200"*/}
            {/*  step="100"*/}
            {/*  suffix=" px"*/}
            {/*  onChange={(e) => onChange('outputWidth', Number(e.target.value))}*/}
            {/*/>*/}


            <select
                value={controls.fontFamily}
                onChange={(e) => onChange('fontFamily', e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 10,
                  padding: '0 12px',
                  border: '1px solid var(--gray-6)',
                  background: 'var(--color-panel-solid)',
                  color: 'inherit'
                }}
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="system-ui, sans-serif">System UI</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'PingFang SC', 'Microsoft YaHei', sans-serif">苹方 / 微软雅黑</option>
              <option value="'Helvetica Neue', Arial, sans-serif">Helvetica Neue</option>
              <option value="Georgia, serif">Georgia</option>
            </select>

          <RangeField
              label="字体大小"
              value={controls.fontSize}
              min="40"
              max="100"
              step="1"
              suffix=" px"
              onChange={(e) => onChange('fontSize', Number(e.target.value))}
          />

          <RangeField
              label="字体粗细"
              value={controls.fontWeight}
              min="100"
              max="900"
              step="100"
              onChange={(e) => onChange('fontWeight', Number(e.target.value))}
          />

          <RangeField
              label="文字行间距"
              value={controls.lineHeight.toFixed(2)}
              min="0.9"
              max="2.2"
              step="0.01"
              onChange={(e) => onChange('lineHeight', Number(e.target.value))}
          />




            <TextFieldRow
              label="版权署名"
              value={controls.copyrightText}
              onChange={(e) => onChange('copyrightText', e.target.value)}
              placeholder="例如 © harrycraft"
            />

            <Box>
              <Text as="label" size="2" mb="1" style={{ display: 'block' }}>
                日期格式
              </Text>
              <select
                value={controls.dateFormat}
                onChange={(e) => onChange('dateFormat', e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 10,
                  padding: '0 12px',
                  border: '1px solid var(--gray-6)',
                  background: 'var(--color-panel-solid)',
                  color: 'inherit'
                }}
              >
                <option value="dot">2026.04.05 16:36:13</option>
                <option value="dash">2026-04-05 16:36:13</option>
                <option value="slash">2026/04/05 16:36:13</option>
              </select>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="4">
            <Heading size="3">EXIF 字段编辑</Heading>

            <Flex direction="column" gap="3">
              {Object.entries(exifForm || {}).map(([key, field]) => (
                <ExifFieldEditor
                  key={key}
                  fieldKey={key}
                  field={field}
                  onChange={onExifFieldChange}
                />
              ))}
            </Flex>
          </Flex>
        </Card>
        </Grid>

        <Flex gap="3" wrap="wrap">
          <Button size="3" onClick={onDownload}>下载图片</Button>
          <Button size="3" variant="soft" onClick={onSavePreset}>保存到本地</Button>
          <Button size="3" variant="outline" onClick={onReset}>重置参数</Button>
        </Flex>
      </Flex>
    </aside>
  )
}

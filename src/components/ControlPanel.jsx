import React from 'react'

function RangeField({ label, value, min, max, step, onChange, suffix = '', id }) {
    return (
        <div className="field">
            <label htmlFor={id} className="field-label">
                <span>{label}</span>
                <output>{typeof value === 'number' ? `${value}${suffix}` : value}</output>
            </label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

function TextField({ label, value, onChange, id, placeholder }) {
    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default function ControlPanel({
                                         controls,
                                         onChange,
                                         onReset,
                                         onDownload,
                                         onFileChange,
                                         onSavePreset
                                     }) {
    return (
        <aside className="panel">
            <h1>HYPhotos EXIF 水印工具</h1>
            <div className="group">
                <div className="field">
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </div>
            </div>

            <div className="group">
                <RangeField
                    id="blur"
                    label="背景模糊"
                    value={controls.blur}
                    min="0"
                    max="40"
                    step="1"
                    suffix=" px"
                    onChange={(e) => onChange('blur', Number(e.target.value))}
                />
                <RangeField
                    id="overlay"
                    label="蒙版透明度"
                    value={controls.overlay.toFixed(2)}
                    min="0"
                    max="0.85"
                    step="0.01"
                    onChange={(e) => onChange('overlay', Number(e.target.value))}
                />
                <RangeField
                    id="vignette"
                    label="暗角强度"
                    value={controls.vignette.toFixed(2)}
                    min="0"
                    max="0.6"
                    step="0.01"
                    onChange={(e) => onChange('vignette', Number(e.target.value))}
                />
            </div>

            <div className="group">
                <RangeField
                    id="barWidth"
                    label="信息栏宽度"
                    value={controls.barWidth}
                    min="0"
                    max="200"
                    step="1"
                    suffix=" %"
                    onChange={(e) => onChange('barWidth', Number(e.target.value))}
                />
                <RangeField
                    id="textOpacity"
                    label="文字透明度"
                    value={controls.textOpacity.toFixed(2)}
                    min="0.3"
                    max="1"
                    step="0.01"
                    onChange={(e) => onChange('textOpacity', Number(e.target.value))}
                />
                <RangeField
                    id="leftPadding"
                    label="左边距"
                    value={controls.leftPadding}
                    min="0"
                    max="200"
                    step="1"
                    suffix=" px"
                    onChange={(e) => onChange('leftPadding', Number(e.target.value))}
                />

                <RangeField
                    id="topPadding"
                    label="顶边距"
                    value={controls.topPadding}
                    min="0"
                    max="200"
                    step="1"
                    suffix=" px"
                    onChange={(e) => onChange('topPadding', Number(e.target.value))}
                />
                <div className="field grid-2">
                    <div>
                        <label htmlFor="gradStart">渐变起始色</label>
                        <input
                            id="gradStart"
                            type="color"
                            value={controls.gradStart}
                            onChange={(e) => onChange('gradStart', e.target.value)}
                        />
                        <RangeField
                            id="gradStartAlpha"
                            label="起始色透明度"
                            value={controls.gradStartAlpha.toFixed(2)}
                            min="0"
                            max="1"
                            step="0.01"
                            onChange={(e) => onChange('gradStartAlpha', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label htmlFor="gradEnd">渐变结束色</label>
                        <input
                            id="gradEnd"
                            type="color"
                            value={controls.gradEnd}
                            onChange={(e) => onChange('gradEnd', e.target.value)}
                        />
                        <RangeField
                            id="gradEndAlpha"
                            label="结束色透明度"
                            value={controls.gradEndAlpha.toFixed(2)}
                            min="0"
                            max="1"
                            step="0.01"
                            onChange={(e) => onChange('gradEndAlpha', Number(e.target.value))}
                        />
                    </div>
                </div>



            </div>

            <div className="group">

                <RangeField
                    id="primaryFontSize"
                    label="上半区字体大小"
                    value={controls.primaryFontSize}
                    min="50"
                    max="150"
                    step="1"
                    suffix=" px"
                    onChange={(e) => onChange('primaryFontSize', Number(e.target.value))}
                />
                <RangeField
                    id="secondaryFontSize"
                    label="下半区字体大小"
                    value={controls.secondaryFontSize}
                    min="50"
                    max="150"
                    step="1"
                    suffix=" px"
                    onChange={(e) => onChange('secondaryFontSize', Number(e.target.value))}
                />
                <RangeField
                    id="lineHeight"
                    label="文字行间距"
                    value={controls.lineHeight.toFixed(2)}
                    min="1"
                    max="3"
                    step="0.01"
                    onChange={(e) => onChange('lineHeight', Number(e.target.value))}
                />
            </div>

            <div className="group">
                <TextField
                    id="copyrightText"
                    label="版权署名"
                    value={controls.copyrightText}
                    onChange={(e) => onChange('copyrightText', e.target.value)}
                    placeholder="例如 © harrycraft"
                />
                <div className="field">
                    <label htmlFor="dateFormat">日期格式</label>
                    <select
                        id="dateFormat"
                        value={controls.dateFormat}
                        onChange={(e) => onChange('dateFormat', e.target.value)}
                    >
                        <option value="dot">2026.04.05</option>
                        <option value="dash">2026-04-05</option>
                        <option value="slash">2026/04/05</option>
                    </select>
                </div>
            </div>

            <div className="actions actions-3">
                <button className="primary" onClick={onDownload}>下载</button>
                <button className="secondary" onClick={onSavePreset}>保存参数</button>
                <button className="secondary" onClick={onReset}>重置参数</button>
            </div>
        </aside>
    )
}

# React 照片 EXIF 水印工具

一个适合继续开发的 React + Vite 组件化工程，支持：

- 上传照片并读取 EXIF
- 左侧单边信息栏水印
- 整图模糊
- 整体蒙版透明度
- 左侧渐变遮罩
- 自定义版权文字
- 字体大小调节
- 文字行间距调节
- 导出 PNG 图片

## 启动方式

```bash
npm install
npm run dev
```

## 打包构建

```bash
npm run build
```

## 工程结构

```text
src/
  components/
    ControlPanel.jsx
    Dropzone.jsx
    PreviewCanvas.jsx
  utils/
    canvasRenderer.js
    defaults.js
    exifFormat.js
  App.jsx
  main.jsx
  styles.css
```

## 说明

- `ControlPanel.jsx`：控制面板，后续可继续拆成更多小组件。
- `PreviewCanvas.jsx`：画布预览组件。
- `Dropzone.jsx`：拖拽上传区域。
- `canvasRenderer.js`：核心绘图逻辑，后续适合抽成模板系统。
- `exifFormat.js`：EXIF 字段格式化工具。

## 后续建议

你可以继续增加：

- 字体家族切换
- 多模板布局
- 底部横条模式
- 可拖拽文字位置
- 批量导出
- 主题色预设
- 本地缓存模板配置

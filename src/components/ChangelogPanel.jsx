import React from 'react'
import { Box, Flex, Heading, Separator, Text } from '@radix-ui/themes'

const changelogData = [
    {
        version: '1.2',
        date: '2026-04-24',
        items: [
            '新增 EXIF 自动填充表单功能。',
            '新增 EXIF 字段可编辑能力。',
            '新增每个 EXIF 字段单独显示开关。',
            '新增统一字体大小、字体粗细和字体选择设置。',
            '统一上下区域图标尺寸规则，并让图标大小与文字大小联动。',
            '优化图标描边粗细与内部留白比例。',
            '修复字段隐藏后仍可能残留占位的问题。'
        ]
    },
    {
        version: '1.1',
        date: '2026-04-22',
        items: [
            '新增背景模糊、蒙版透明度、信息栏宽度、文字透明度等设置。',
            '新增渐变起始色、结束色及透明度控制。',
            '新增左边距、顶边距和输出宽度设置。',
            '新增参数本地保存能力。',
            '控制面板切换为 @radix-ui/themes 风格。',
            '移除暗角效果。',
            '优化固定输出宽度下的排版稳定性。'
        ]
    },
    {
        version: '1.0',
        date: '2026-04-19',
        items: [
            '完成纯前端图片水印工具首个可用版本。',
            '支持本地上传图片并实时预览。',
            '支持读取 EXIF 信息并格式化展示。',
            '支持 Canvas 渲染背景模糊、蒙版和左侧参数栏。',
            '支持导出 PNG 图片。',
            '支持拖拽上传与文件选择上传。'
        ]
    }
]

export default function ChangelogPanel() {
    return (
        <Flex direction="column" gap="5">
            {changelogData.map((section, index) => (
                <Box key={section.version}>
                    <Flex align="end" justify="between" mb="3" wrap="wrap" gap="2">
                        <Heading size="4">{section.version}</Heading>
                        <Text size="2" color="gray" className="changelog-date">
                            {section.date}
                        </Text>
                    </Flex>

                    <Flex direction="column" gap="2">
                        {section.items.map((item, itemIndex) => (
                            <Text key={`${section.version}-${itemIndex}`} size="2" className="changelog-item">
                                {item}
                            </Text>
                        ))}
                    </Flex>

                    {index !== changelogData.length - 1 && <Separator size="4" mt="4" />}
                </Box>
            ))}
        </Flex>
    )
}

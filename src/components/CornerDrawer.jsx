import React, { useEffect } from 'react'
import { Flex, Heading, IconButton, Text } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'

export default function CornerDrawer({ open, onOpenChange, children }) {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onOpenChange(false)
            }
        }

        if (open) {
            window.addEventListener('keydown', onKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [open, onOpenChange])

    return (
        <>
            <div
                className={`corner-drawer-overlay ${open ? 'is-open' : ''}`}
                onClick={() => onOpenChange(false)}
                aria-hidden={!open}
            />

            <aside
                className={`corner-drawer-content ${open ? 'is-open' : ''}`}
                aria-hidden={!open}
                aria-label="更新日志"
            >
                <Flex align="center" justify="between" mb="4">
                    <div>
                        <Heading size="5">更新日志</Heading>

                    </div>

                    <IconButton
                        variant="ghost"
                        radius="full"
                        aria-label="关闭侧边面板"
                        onClick={() => onOpenChange(false)}
                    >
                        <Cross2Icon width="18" height="18" />
                    </IconButton>
                </Flex>

                <div className="corner-drawer-scroll">
                    {children}
                </div>
            </aside>
        </>
    )
}

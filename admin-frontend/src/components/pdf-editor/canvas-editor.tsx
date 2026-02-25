"use client"

import { useCallback, useRef, useState } from "react"
import type { CanvasElement } from "../../lib/pdf-editor-types"

interface CanvasEditorProps {
    elements: CanvasElement[]
    selectedElement: string | null
    onSelectElement: (id: string | null) => void
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
    readOnly?: boolean
}

export function CanvasEditor({
    elements,
    selectedElement,
    onSelectElement,
    onUpdateElement,
    readOnly = false,
}: CanvasEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [resizing, setResizing] = useState<string | null>(null)
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 })

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, elementId: string) => {
            if (readOnly) return
            e.stopPropagation()
            onSelectElement(elementId)

            const el = elements.find((el) => el.id === elementId)
            if (!el || !canvasRef.current) return

            const rect = canvasRef.current.getBoundingClientRect()
            setDragOffset({
                x: e.clientX - rect.left - el.x,
                y: e.clientY - rect.top - el.y,
            })
            setDragging(elementId)
        },
        [elements, onSelectElement, readOnly]
    )

    const handleResizeStart = useCallback(
        (e: React.MouseEvent, elementId: string) => {
            if (readOnly) return
            e.stopPropagation()
            e.preventDefault()
            const el = elements.find((el) => el.id === elementId)
            if (!el) return
            setResizing(elementId)
            setResizeStart({ x: e.clientX, y: e.clientY, w: el.width, h: el.height })
        },
        [elements, readOnly]
    )

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (readOnly) return

            if (dragging && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect()
                const x = Math.max(0, Math.min(600 - (elements.find(el => el.id === dragging)?.width || 0),
                    Math.round(e.clientX - rect.left - dragOffset.x)))
                const y = Math.max(0, Math.min(842 - (elements.find(el => el.id === dragging)?.height || 0),
                    Math.round(e.clientY - rect.top - dragOffset.y)))
                onUpdateElement(dragging, { x, y })
            }

            if (resizing) {
                const dx = e.clientX - resizeStart.x
                const dy = e.clientY - resizeStart.y
                const newWidth = Math.max(20, Math.round(resizeStart.w + dx))
                const newHeight = Math.max(10, Math.round(resizeStart.h + dy))
                onUpdateElement(resizing, { width: newWidth, height: newHeight })
            }
        },
        [dragging, resizing, dragOffset, resizeStart, onUpdateElement, readOnly, elements]
    )

    const handleMouseUp = useCallback(() => {
        setDragging(null)
        setResizing(null)
    }, [])

    const handleCanvasClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === canvasRef.current) {
                onSelectElement(null)
            }
        },
        [onSelectElement]
    )

    const renderElement = (el: CanvasElement) => {
        const isSelected = selectedElement === el.id
        const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            opacity: el.opacity ?? 1,
            cursor: readOnly ? "default" : "move",
        }

        const selectionRing = isSelected && !readOnly
            ? "ring-2 ring-[#3B82F6] ring-offset-1 ring-offset-transparent"
            : ""

        switch (el.type) {
            case "text":
                return (
                    <div
                        key={el.id}
                        className={`select-none ${selectionRing}`}
                        style={{
                            ...baseStyle,
                            color: el.color,
                            fontSize: el.fontSize || 14,
                            fontWeight: el.fontWeight || "normal",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                    >
                        {el.content}
                        {isSelected && !readOnly && (
                            <div
                                className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-[#3B82F6]"
                                onMouseDown={(e) => handleResizeStart(e, el.id)}
                            />
                        )}
                    </div>
                )

            case "rectangle":
                return (
                    <div
                        key={el.id}
                        className={`${selectionRing}`}
                        style={{
                            ...baseStyle,
                            backgroundColor: el.color === "transparent" ? "transparent" : el.color,
                            border: el.borderColor
                                ? `${el.borderWidth || 1}px solid ${el.borderColor}`
                                : undefined,
                            borderRadius: 2,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                    >
                        {isSelected && !readOnly && (
                            <div
                                className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-[#3B82F6]"
                                onMouseDown={(e) => handleResizeStart(e, el.id)}
                            />
                        )}
                    </div>
                )

            case "circle":
                return (
                    <div
                        key={el.id}
                        className={`rounded-full ${selectionRing}`}
                        style={{
                            ...baseStyle,
                            backgroundColor: el.color,
                            border: el.borderColor
                                ? `${el.borderWidth || 1}px solid ${el.borderColor}`
                                : undefined,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                    >
                        {isSelected && !readOnly && (
                            <div
                                className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-[#3B82F6]"
                                onMouseDown={(e) => handleResizeStart(e, el.id)}
                            />
                        )}
                    </div>
                )

            case "line":
                return (
                    <div
                        key={el.id}
                        className={`${selectionRing}`}
                        style={{
                            ...baseStyle,
                            backgroundColor: el.color,
                            height: el.height || 2,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                    >
                        {isSelected && !readOnly && (
                            <div
                                className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-se-resize rounded-sm bg-[#3B82F6]"
                                onMouseDown={(e) => handleResizeStart(e, el.id)}
                            />
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/50 p-6">
            <div
                ref={canvasRef}
                className="relative bg-white shadow-xl"
                style={{
                    width: 600,
                    height: 842,
                    minWidth: 600,
                    minHeight: 842,
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleCanvasClick}
            >
                {elements.map(renderElement)}

                {elements.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="mb-3 opacity-40"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <p className="text-sm">Arrastra elementos aquí para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    )
}
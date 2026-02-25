"use client"

import { useCallback, useState } from "react"
import type { CanvasElement } from "../../lib/pdf-editor-types"
import { ELEMENT_COLORS } from "../../lib/pdf-editor-types"
import { CanvasEditor } from "./canvas-editor"
import { ElementToolbar } from "./element-toolbar"
import { toast } from "sonner"

let elementCounter = 0

function createNewElement(type: CanvasElement["type"], color: string): CanvasElement {
    elementCounter++
    const id = `new-el-${elementCounter}`

    const base = {
        id,
        color,
        opacity: 1,
    }

    switch (type) {
        case "text":
            return {
                ...base,
                type: "text",
                x: 50 + Math.random() * 100,
                y: 50 + Math.random() * 200,
                width: 200,
                height: 24,
                content: "Nuevo texto",
                fontSize: 16,
                fontWeight: "normal",
            }
        case "rectangle":
            return {
                ...base,
                type: "rectangle",
                x: 60 + Math.random() * 100,
                y: 60 + Math.random() * 200,
                width: 180,
                height: 100,
            }
        case "circle":
            return {
                ...base,
                type: "circle",
                x: 80 + Math.random() * 100,
                y: 80 + Math.random() * 200,
                width: 100,
                height: 100,
            }
        case "line":
            return {
                ...base,
                type: "line",
                x: 40 + Math.random() * 100,
                y: 100 + Math.random() * 200,
                width: 250,
                height: 2,
            }
        default:
            return {
                ...base,
                type: "rectangle",
                x: 100,
                y: 100,
                width: 100,
                height: 100,
            }
    }
}

export function CreateTab() {
    const [elements, setElements] = useState<CanvasElement[]>([])
    const [selectedElement, setSelectedElement] = useState<string | null>(null)
    const [activeColor, setActiveColor] = useState(ELEMENT_COLORS[0])

    const handleAddElement = useCallback(
        (type: CanvasElement["type"]) => {
            const newEl = createNewElement(type, activeColor)
            setElements((prev) => [...prev, newEl])
            setSelectedElement(newEl.id)
        },
        [activeColor]
    )

    const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        )
    }, [])

    const handleDeleteElement = useCallback(
        (id: string) => {
            setElements((prev) => prev.filter((el) => el.id !== id))
            if (selectedElement === id) setSelectedElement(null)
        },
        [selectedElement]
    )

    const handleSave = useCallback(() => {
        // Aquí irá la llamada al backend
        console.log("Template a guardar:", {
            name: "Mi Template",
            templateJson: {
                objects: elements
            }
        })

        toast.success("Template guardada exitosamente", {
            description: `${elements.length} elementos guardados`,
        })
    }, [elements])

    return (
        <div className="flex h-full">
            <CanvasEditor
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onUpdateElement={handleUpdateElement}
            />
            <ElementToolbar
                elements={elements}
                selectedElement={selectedElement}
                onAddElement={handleAddElement}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onSelectElement={setSelectedElement}
                onSave={handleSave}
                activeColor={activeColor}
                onColorChange={setActiveColor}
            />
        </div>
    )
}
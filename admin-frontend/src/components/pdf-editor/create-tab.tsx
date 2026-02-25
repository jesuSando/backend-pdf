// src/components/pdf-editor/create-tab.tsx (versión actualizada)
"use client"

import { useCallback, useState } from "react"
import type { CanvasElement } from "../../lib/pdf-editor-types"
import { ELEMENT_COLORS } from "../../lib/pdf-editor-types"
import { CanvasEditor } from "./canvas-editor"
import { ElementToolbar } from "./element-toolbar"
import { templateService } from "../../services/template.service"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

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
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
    const [templateName, setTemplateName] = useState("")
    const [isSaving, setIsSaving] = useState(false)

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

    const handleSave = useCallback(async () => {
        if (!templateName.trim()) {
            toast.error("Error", {
                description: "El nombre del template es requerido",
            })
            return
        }

        setIsSaving(true)
        try {
            await templateService.create({
                name: templateName,
                templateJson: {
                    objects: elements
                }
            })

            toast.success("Template guardada exitosamente", {
                description: `${elements.length} elementos guardados`,
            })

            // Limpiar después de guardar
            setElements([])
            setSelectedElement(null)
            setTemplateName("")
            setIsSaveDialogOpen(false)
        } catch (error) {
            toast.error("Error al guardar", {
                description: error instanceof Error ? error.message : "Error desconocido",
            })
        } finally {
            setIsSaving(false)
        }
    }, [templateName, elements])

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
                onSave={() => setIsSaveDialogOpen(true)}
                activeColor={activeColor}
                onColorChange={setActiveColor}
            />

            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent className="bg-card border-border sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Guardar Template</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-muted-foreground">
                                Nombre del Template
                            </Label>
                            <Input
                                id="name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Ej: Factura Comercial"
                                className="bg-secondary border-border text-foreground"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsSaveDialogOpen(false)}
                            className="border-border text-foreground"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !templateName.trim()}
                            className="bg-primary text-primary-foreground"
                        >
                            {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
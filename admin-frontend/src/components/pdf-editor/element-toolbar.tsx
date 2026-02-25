"use client"

import { useState } from "react"
import { ELEMENT_COLORS, type CanvasElement } from "../../lib/pdf-editor-types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ScrollArea } from "../../components/ui/scroll-area"
import {
    Type,
    Square,
    Circle,
    Minus,
    Save,
    Trash2,
    Layers,
    ChevronDown,
    ChevronRight,
} from "lucide-react"

interface ElementToolbarProps {
    elements: CanvasElement[]
    selectedElement: string | null
    onAddElement: (type: CanvasElement["type"]) => void
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void
    onDeleteElement: (id: string) => void
    onSelectElement: (id: string | null) => void
    onSave: () => void
    activeColor: string
    onColorChange: (color: string) => void
}

const TOOL_ITEMS: { type: CanvasElement["type"]; icon: React.ElementType; label: string }[] = [
    { type: "text", icon: Type, label: "Texto" },
    { type: "rectangle", icon: Square, label: "Rectángulo" },
    { type: "circle", icon: Circle, label: "Círculo" },
    { type: "line", icon: Minus, label: "Línea" },
]

export function ElementToolbar({
    elements,
    selectedElement,
    onAddElement,
    onUpdateElement,
    onDeleteElement,
    onSelectElement,
    onSave,
    activeColor,
    onColorChange,
}: ElementToolbarProps) {
    const [layersOpen, setLayersOpen] = useState(true)
    const selected = elements.find((el) => el.id === selectedElement)

    return (
        <div className="flex h-full w-72 flex-col border-l border-border bg-card">
            {/* Tools Section */}
            <div className="border-b border-border p-4">
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Herramientas
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {TOOL_ITEMS.map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            onClick={() => onAddElement(type)}
                            className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-secondary"
                            title={label}
                        >
                            <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                            <span className="text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Palette */}
            <div className="border-b border-border p-4">
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Color Activo
                </h3>
                <div className="flex flex-wrap gap-2">
                    {ELEMENT_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorChange(color)}
                            className="h-7 w-7 rounded-md border-2 transition-transform hover:scale-110"
                            style={{
                                backgroundColor: color,
                                borderColor: activeColor === color ? "#3B82F6" : "transparent",
                                boxShadow: activeColor === color ? "0 0 0 1px #3B82F6" : "none",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Selected Element Properties */}
            {selected && (
                <div className="border-b border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Propiedades
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => onDeleteElement(selected.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {selected.type === "text" && (
                            <div>
                                <Label className="text-xs text-muted-foreground">Contenido</Label>
                                <Input
                                    value={selected.content || ""}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { content: e.target.value })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-muted-foreground">X</Label>
                                <Input
                                    type="number"
                                    value={selected.x}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { x: Number(e.target.value) })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Y</Label>
                                <Input
                                    type="number"
                                    value={selected.y}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { y: Number(e.target.value) })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-muted-foreground">Ancho</Label>
                                <Input
                                    type="number"
                                    value={selected.width}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { width: Number(e.target.value) })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Alto</Label>
                                <Input
                                    type="number"
                                    value={selected.height}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { height: Number(e.target.value) })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                        </div>

                        {selected.type === "text" && (
                            <div>
                                <Label className="text-xs text-muted-foreground">Tamaño de Fuente</Label>
                                <Input
                                    type="number"
                                    value={selected.fontSize || 14}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { fontSize: Number(e.target.value) })
                                    }
                                    className="mt-1 h-8 border-border bg-secondary text-xs text-secondary-foreground"
                                />
                            </div>
                        )}

                        <div>
                            <Label className="text-xs text-muted-foreground">Color</Label>
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className="h-8 w-8 rounded-md border border-border"
                                    style={{ backgroundColor: selected.color }}
                                />
                                <Input
                                    value={selected.color}
                                    onChange={(e) =>
                                        onUpdateElement(selected.id, { color: e.target.value })
                                    }
                                    className="h-8 flex-1 border-border bg-secondary font-mono text-xs text-secondary-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Layers Panel */}
            <div className="flex-1 overflow-hidden">
                <button
                    onClick={() => setLayersOpen(!layersOpen)}
                    className="flex w-full items-center gap-2 border-b border-border p-4 text-left"
                >
                    {layersOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Capas ({elements.length})
                    </span>
                </button>
                {layersOpen && (
                    <ScrollArea className="h-[calc(100%-48px)]">
                        <div className="p-2">
                            {elements.length === 0 && (
                                <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                                    Sin elementos aún
                                </p>
                            )}
                            {[...elements].reverse().map((el) => (
                                <button
                                    key={el.id}
                                    onClick={() => onSelectElement(el.id)}
                                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${selectedElement === el.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                >
                                    <div
                                        className="h-3 w-3 rounded-sm"
                                        style={{ backgroundColor: el.color === "transparent" ? "#9CA3AF" : el.color }}
                                    />
                                    <span className="truncate text-xs">
                                        {el.type === "text"
                                            ? el.content?.slice(0, 25) || "Texto"
                                            : el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Save Button */}
            <div className="border-t border-border p-4">
                <Button
                    onClick={onSave}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Save className="h-4 w-4" />
                    Guardar Template
                </Button>
            </div>
        </div>
    )
}
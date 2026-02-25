"use client"

import { useState } from "react"
import type { PdfTemplate } from "../../lib/pdf-editor-types"
import { CanvasEditor } from "./canvas-editor"
import { pdfService } from "../../services/pdf.service"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TemplatePreviewProps {
    template: PdfTemplate
    onBack: () => void
}

export function TemplatePreview({ template, onBack }: TemplatePreviewProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGeneratePDF = async () => {
        setIsGenerating(true)
        try {
            // Datos de ejemplo - esto debería venir de un formulario
            const sampleData = {
                nombre: "Juan Pérez",
                fecha: new Date().toLocaleDateString(),
                total: 595000,
                // Agrega más campos según tu template
            }

            await pdfService.generateAndDownload({
                templateName: template.name,
                data: sampleData,
            })

            toast.success("PDF generado exitosamente")
        } catch (error) {
            toast.error("Error al generar PDF", {
                description: error instanceof Error ? error.message : "Error desconocido",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a la lista
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">{template.name}</h2>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {template.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(template.createdAt).toLocaleDateString("es-CL")}
                        </span>
                    </div>
                    <Badge
                        variant={template.status === "published" ? "default" : "secondary"}
                        className={
                            template.status === "published"
                                ? "bg-success/15 text-success border-success/20"
                                : "bg-secondary text-secondary-foreground"
                        }
                    >
                        {template.status === "published" ? "Publicada" : "Borrador"}
                    </Badge>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-border text-foreground"
                        onClick={handleGeneratePDF}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <Download className="h-3.5 w-3.5" />
                                Exportar PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Canvas Preview */}
            <div className="flex-1 overflow-hidden">
                <CanvasEditor
                    elements={template.elements}
                    selectedElement={null}
                    onSelectElement={() => { }}
                    onUpdateElement={() => { }}
                    readOnly
                />
            </div>
        </div>
    )
}
"use client"

import { useState, useEffect } from "react"
import type { PdfTemplate } from "../../lib/pdf-editor-types"
import { TemplatePreview } from "./template-preview"
import { templateService, mapAPIToTemplate } from "../../services/template.service"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Eye, Search, FileText, MoreHorizontal, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ListTab() {
    const [previewTemplate, setPreviewTemplate] = useState<PdfTemplate | null>(null)
    const [search, setSearch] = useState("")
    const [templates, setTemplates] = useState<PdfTemplate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTemplates()
    }, [])

    const loadTemplates = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const apiTemplates = await templateService.getAll()
            const mappedTemplates = apiTemplates.map(mapAPIToTemplate)
            setTemplates(mappedTemplates)
        } catch (error) {
            console.error("Error loading templates:", error)
            setError("Error al cargar los templates")
            toast.error("Error", {
                description: "No se pudieron cargar los templates",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filtered = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.author.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        // TODO: Implementar cuando el backend tenga endpoint DELETE
        toast.info("Función no implementada", {
            description: "El backend no tiene endpoint de eliminación aún",
        })
    }

    const handleDuplicate = async (template: PdfTemplate) => {
        // TODO: Implementar duplicado
        toast.info("Función no implementada", {
            description: "Próximamente disponible",
        })
    }

    if (previewTemplate) {
        return (
            <TemplatePreview
                template={previewTemplate}
                onBack={() => setPreviewTemplate(null)}
            />
        )
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Templates Guardadas</h2>
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? "Cargando..." : `${templates.length} templates en total`}
                    </p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 border-border bg-secondary pl-9 text-sm text-secondary-foreground placeholder:text-muted-foreground"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-6 py-4">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Cargando templates...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-destructive">{error}</p>
                            <Button onClick={loadTemplates} variant="outline">
                                Reintentar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Template
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Autor
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Página
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Estado
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Creada
                                    </TableHead>
                                    <TableHead className="w-24 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            No se encontraron templates
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filtered.map((template) => (
                                    <TableRow
                                        key={template.id}
                                        className="cursor-pointer border-border transition-colors hover:bg-secondary/50"
                                        onClick={() => setPreviewTemplate(template)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {template.name}
                                                    </p>
                                                    <p className="max-w-xs truncate text-xs text-muted-foreground">
                                                        {template.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {template.author}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-border text-xs font-mono text-muted-foreground"
                                            >
                                                {template.pageSize}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(template.createdAt).toLocaleDateString("es-CL", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => setPreviewTemplate(template)}
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border">
                                                        <DropdownMenuItem
                                                            className="text-sm"
                                                            onClick={() => setPreviewTemplate(template)}
                                                        >
                                                            <Eye className="mr-2 h-3.5 w-3.5" />
                                                            Ver detalles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-sm"
                                                            onClick={() => handleDuplicate(template)}
                                                        >
                                                            <FileText className="mr-2 h-3.5 w-3.5" />
                                                            Duplicar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-sm text-destructive"
                                                            onClick={() => handleDelete(template.id)}
                                                        >
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}
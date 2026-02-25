// src/lib/pdf-editor-types.ts
export interface CanvasElement {
    id: string
    type: "text" | "rectangle" | "circle" | "line" | "image"
    x: number
    y: number
    width: number
    height: number
    content?: string
    color: string
    fontSize?: number
    fontWeight?: "normal" | "bold"
    borderColor?: string
    borderWidth?: number
    rotation?: number
    opacity?: number
}

export interface PdfTemplate {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
    pageSize: "A4" | "Letter" | "Legal"
    elements: CanvasElement[]
    status: "draft" | "published"
    author: string
}

export const ELEMENT_COLORS = [
    "#3B82F6", // blue
    "#EF4444", // red
    "#10B981", // green
    "#F59E0B", // amber
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#F97316", // orange
    "#1F2937", // dark gray
    "#FFFFFF", // white
]

export const MOCK_TEMPLATES: PdfTemplate[] = [
    {
        id: "tpl-001",
        name: "Factura Comercial",
        description: "Template para facturas comerciales con logo, tabla de items y totales",
        createdAt: "2025-12-10T14:30:00Z",
        updatedAt: "2026-01-15T09:20:00Z",
        pageSize: "A4",
        status: "published",
        author: "Carlos M.",
        elements: [
            { id: "el-1", type: "rectangle", x: 40, y: 30, width: 520, height: 80, color: "#3B82F6", opacity: 1 },
            { id: "el-2", type: "text", x: 60, y: 55, width: 200, height: 30, content: "FACTURA", color: "#FFFFFF", fontSize: 28, fontWeight: "bold" },
            { id: "el-3", type: "text", x: 60, y: 140, width: 200, height: 20, content: "Cliente: Empresa ABC S.A.", color: "#1F2937", fontSize: 14 },
            { id: "el-4", type: "text", x: 60, y: 165, width: 200, height: 20, content: "RUT: 76.123.456-7", color: "#1F2937", fontSize: 12 },
            { id: "el-5", type: "text", x: 400, y: 140, width: 160, height: 20, content: "N° 001234", color: "#3B82F6", fontSize: 16, fontWeight: "bold" },
            { id: "el-6", type: "rectangle", x: 40, y: 200, width: 520, height: 35, color: "#EFF6FF" },
            { id: "el-7", type: "text", x: 50, y: 210, width: 100, height: 16, content: "Descripción", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-8", type: "text", x: 300, y: 210, width: 60, height: 16, content: "Cant.", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-9", type: "text", x: 400, y: 210, width: 80, height: 16, content: "Precio", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-10", type: "text", x: 490, y: 210, width: 60, height: 16, content: "Total", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-11", type: "line", x: 40, y: 235, width: 520, height: 2, color: "#CBD5E1" },
            { id: "el-12", type: "text", x: 50, y: 250, width: 200, height: 16, content: "Servicio de consultoría", color: "#374151", fontSize: 11 },
            { id: "el-13", type: "text", x: 310, y: 250, width: 40, height: 16, content: "10", color: "#374151", fontSize: 11 },
            { id: "el-14", type: "text", x: 400, y: 250, width: 80, height: 16, content: "$50.000", color: "#374151", fontSize: 11 },
            { id: "el-15", type: "text", x: 490, y: 250, width: 60, height: 16, content: "$500.000", color: "#374151", fontSize: 11 },
            { id: "el-16", type: "rectangle", x: 350, y: 400, width: 210, height: 40, color: "#3B82F6" },
            { id: "el-17", type: "text", x: 370, y: 412, width: 180, height: 20, content: "TOTAL: $595.000", color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
        ],
    },
    {
        id: "tpl-002",
        name: "Reporte Mensual",
        description: "Template para reportes mensuales con gráficos y tablas de rendimiento",
        createdAt: "2025-11-05T10:00:00Z",
        updatedAt: "2026-02-01T16:45:00Z",
        pageSize: "A4",
        status: "published",
        author: "María L.",
        elements: [
            { id: "el-1", type: "rectangle", x: 0, y: 0, width: 600, height: 100, color: "#1F2937" },
            { id: "el-2", type: "text", x: 40, y: 35, width: 300, height: 35, content: "REPORTE MENSUAL", color: "#FFFFFF", fontSize: 26, fontWeight: "bold" },
            { id: "el-3", type: "text", x: 40, y: 65, width: 200, height: 18, content: "Enero 2026", color: "#9CA3AF", fontSize: 14 },
            { id: "el-4", type: "rectangle", x: 40, y: 130, width: 150, height: 80, color: "#EFF6FF", borderColor: "#3B82F6", borderWidth: 2 },
            { id: "el-5", type: "text", x: 55, y: 145, width: 120, height: 14, content: "Ventas", color: "#6B7280", fontSize: 11 },
            { id: "el-6", type: "text", x: 55, y: 170, width: 120, height: 24, content: "$12.5M", color: "#3B82F6", fontSize: 22, fontWeight: "bold" },
            { id: "el-7", type: "rectangle", x: 220, y: 130, width: 150, height: 80, color: "#F0FDF4", borderColor: "#10B981", borderWidth: 2 },
            { id: "el-8", type: "text", x: 235, y: 145, width: 120, height: 14, content: "Crecimiento", color: "#6B7280", fontSize: 11 },
            { id: "el-9", type: "text", x: 235, y: 170, width: 120, height: 24, content: "+23%", color: "#10B981", fontSize: 22, fontWeight: "bold" },
            { id: "el-10", type: "rectangle", x: 400, y: 130, width: 150, height: 80, color: "#FFF7ED", borderColor: "#F59E0B", borderWidth: 2 },
            { id: "el-11", type: "text", x: 415, y: 145, width: 120, height: 14, content: "Clientes", color: "#6B7280", fontSize: 11 },
            { id: "el-12", type: "text", x: 415, y: 170, width: 120, height: 24, content: "1,234", color: "#F59E0B", fontSize: 22, fontWeight: "bold" },
            { id: "el-13", type: "circle", x: 80, y: 350, width: 120, height: 120, color: "#3B82F6", opacity: 0.3 },
            { id: "el-14", type: "circle", x: 140, y: 350, width: 120, height: 120, color: "#10B981", opacity: 0.3 },
        ],
    },
    {
        id: "tpl-003",
        name: "Certificado de Curso",
        description: "Certificado con borde decorativo y campos dinámicos para nombre y curso",
        createdAt: "2026-01-20T08:15:00Z",
        updatedAt: "2026-02-10T11:30:00Z",
        pageSize: "Letter",
        status: "draft",
        author: "Ana R.",
        elements: [
            { id: "el-1", type: "rectangle", x: 20, y: 20, width: 560, height: 760, color: "transparent", borderColor: "#F59E0B", borderWidth: 3 },
            { id: "el-2", type: "rectangle", x: 30, y: 30, width: 540, height: 740, color: "transparent", borderColor: "#F59E0B", borderWidth: 1 },
            { id: "el-3", type: "text", x: 150, y: 100, width: 300, height: 40, content: "CERTIFICADO", color: "#F59E0B", fontSize: 36, fontWeight: "bold" },
            { id: "el-4", type: "text", x: 180, y: 145, width: 240, height: 20, content: "DE FINALIZACIÓN", color: "#6B7280", fontSize: 16 },
            { id: "el-5", type: "line", x: 150, y: 180, width: 300, height: 2, color: "#F59E0B" },
            { id: "el-6", type: "text", x: 170, y: 220, width: 260, height: 18, content: "Se certifica que", color: "#374151", fontSize: 14 },
            { id: "el-7", type: "text", x: 120, y: 260, width: 360, height: 35, content: "Juan Pérez García", color: "#1F2937", fontSize: 28, fontWeight: "bold" },
            { id: "el-8", type: "line", x: 120, y: 300, width: 360, height: 1, color: "#D1D5DB" },
            { id: "el-9", type: "text", x: 130, y: 330, width: 340, height: 18, content: "ha completado satisfactoriamente el curso", color: "#374151", fontSize: 14 },
            { id: "el-10", type: "text", x: 140, y: 370, width: 320, height: 28, content: "Desarrollo Web Avanzado", color: "#3B82F6", fontSize: 22, fontWeight: "bold" },
            { id: "el-11", type: "circle", x: 250, y: 500, width: 100, height: 100, color: "#F59E0B", opacity: 0.15 },
        ],
    },
    {
        id: "tpl-004",
        name: "Orden de Compra",
        description: "Formulario de orden de compra con campos para proveedor y listado de productos",
        createdAt: "2026-02-01T13:00:00Z",
        updatedAt: "2026-02-14T10:00:00Z",
        pageSize: "A4",
        status: "published",
        author: "Pedro S.",
        elements: [
            { id: "el-1", type: "rectangle", x: 40, y: 30, width: 520, height: 60, color: "#10B981" },
            { id: "el-2", type: "text", x: 60, y: 50, width: 250, height: 28, content: "ORDEN DE COMPRA", color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
            { id: "el-3", type: "text", x: 420, y: 50, width: 120, height: 20, content: "OC-2026-0089", color: "#FFFFFF", fontSize: 14 },
            { id: "el-4", type: "rectangle", x: 40, y: 110, width: 250, height: 100, color: "#F0FDF4", borderColor: "#10B981", borderWidth: 1 },
            { id: "el-5", type: "text", x: 55, y: 125, width: 100, height: 14, content: "Proveedor:", color: "#6B7280", fontSize: 11, fontWeight: "bold" },
            { id: "el-6", type: "text", x: 55, y: 145, width: 220, height: 16, content: "Distribuidora Nacional SpA", color: "#1F2937", fontSize: 13 },
            { id: "el-7", type: "text", x: 55, y: 170, width: 220, height: 14, content: "contacto@distnacional.cl", color: "#3B82F6", fontSize: 11 },
            { id: "el-8", type: "rectangle", x: 310, y: 110, width: 250, height: 100, color: "#F0FDF4", borderColor: "#10B981", borderWidth: 1 },
            { id: "el-9", type: "text", x: 325, y: 125, width: 100, height: 14, content: "Fecha:", color: "#6B7280", fontSize: 11, fontWeight: "bold" },
            { id: "el-10", type: "text", x: 325, y: 145, width: 220, height: 16, content: "14 de Febrero, 2026", color: "#1F2937", fontSize: 13 },
        ],
    },
    {
        id: "tpl-005",
        name: "Contrato de Servicios",
        description: "Template legal para contratos de prestación de servicios profesionales",
        createdAt: "2025-10-15T09:00:00Z",
        updatedAt: "2026-01-28T14:20:00Z",
        pageSize: "Legal",
        status: "draft",
        author: "Laura V.",
        elements: [
            { id: "el-1", type: "text", x: 150, y: 40, width: 300, height: 30, content: "CONTRATO DE SERVICIOS", color: "#1F2937", fontSize: 22, fontWeight: "bold" },
            { id: "el-2", type: "line", x: 40, y: 80, width: 520, height: 2, color: "#1F2937" },
            { id: "el-3", type: "text", x: 40, y: 110, width: 520, height: 18, content: "En Santiago, a 15 de Octubre de 2025, entre las partes:", color: "#374151", fontSize: 12 },
            { id: "el-4", type: "rectangle", x: 40, y: 150, width: 520, height: 80, color: "#F9FAFB", borderColor: "#D1D5DB", borderWidth: 1 },
            { id: "el-5", type: "text", x: 55, y: 170, width: 490, height: 16, content: "PARTE A: Empresa Tecnológica SpA, RUT 76.987.654-3", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-6", type: "text", x: 55, y: 195, width: 490, height: 16, content: "PARTE B: Consultor Independiente, RUT 12.345.678-9", color: "#1F2937", fontSize: 12, fontWeight: "bold" },
            { id: "el-7", type: "text", x: 40, y: 260, width: 520, height: 16, content: "CLÁUSULA PRIMERA: Objeto del Contrato", color: "#1F2937", fontSize: 13, fontWeight: "bold" },
            { id: "el-8", type: "text", x: 40, y: 285, width: 520, height: 50, content: "El presente contrato tiene por objeto establecer los términos y condiciones bajo los cuales se prestarán los servicios profesionales descritos en el Anexo A.", color: "#374151", fontSize: 11 },
        ],
    },
]
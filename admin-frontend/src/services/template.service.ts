import { apiClient } from '../lib/api-config'
import type { CanvasElement, PdfTemplate } from '../lib/pdf-editor-types'

export interface TemplateFromAPI {
    id: number
    name: string
    template_json: {
        objects: CanvasElement[]
    }
    created_at: string
}

export interface CreateTemplateDTO {
    name: string
    templateJson: {
        objects: CanvasElement[]
    }
}

export const templateService = {
    getAll: async (): Promise<TemplateFromAPI[]> => {
        const response = await apiClient.get('/templates')
        return response.templates
    },

    create: async (data: CreateTemplateDTO): Promise<TemplateFromAPI> => {
        const response = await apiClient.post('/templates', data)
        return response.template
    },

    getByName: async (name: string): Promise<TemplateFromAPI> => {
        const templates = await templateService.getAll()
        const template = templates.find(t => t.name === name)
        if (!template) {
            throw new Error(`Template ${name} not found`)
        }
        return template
    },
}

// Helper para convertir del formato API al formato de la UI
export function mapAPIToTemplate(apiTemplate: TemplateFromAPI): PdfTemplate {
    return {
        id: apiTemplate.id.toString(),
        name: apiTemplate.name,
        description: `Template creado el ${new Date(apiTemplate.created_at).toLocaleDateString()}`,
        createdAt: apiTemplate.created_at,
        updatedAt: apiTemplate.created_at,
        pageSize: "A4", // Por ahora fijo, podrías agregarlo al template_json después
        elements: apiTemplate.template_json.objects || [],
        status: "published", // Por ahora fijo
        author: "Admin", // Podrías obtenerlo del token después
    }
}
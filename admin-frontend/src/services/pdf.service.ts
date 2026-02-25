import { apiClient, API_BASE_URL } from '../lib/api-config'

export interface GeneratePDFDTO {
    templateName: string
    data: Record<string, any>
}

export const pdfService = {
    // Generar PDF y descargarlo
    generateAndDownload: async ({ templateName, data }: GeneratePDFDTO) => {
        try {
            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Nota: El endpoint /generate no requiere token según tu código
                },
                body: JSON.stringify({ templateName, data }),
            })

            if (!response.ok) {
                throw new Error(`Error generating PDF: ${response.statusText}`)
            }

            // Obtener el blob del PDF
            const blob = await response.blob()

            // Crear URL para descarga
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${templateName}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            return true
        } catch (error) {
            console.error('Error generating PDF:', error)
            throw error
        }
    },

    // Generar PDF y obtener URL para previsualización
    generateAndGetUrl: async ({ templateName, data }: GeneratePDFDTO): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ templateName, data }),
        })

        if (!response.ok) {
            throw new Error(`Error generating PDF: ${response.statusText}`)
        }

        const blob = await response.blob()
        return window.URL.createObjectURL(blob)
    },
}
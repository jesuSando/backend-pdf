const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const Handlebars = require("handlebars");

const generatePdfFromTemplate = async (templateJson, data) => {
    try {
        const pdfDoc = await PDFDocument.create();

        const page = pdfDoc.addPage([595, 842]);

        for (const obj of templateJson.objects) {
            if (obj.type === "text") {
                const font = await pdfDoc.embedFont(
                    StandardFonts[obj.font] || StandardFonts.Helvetica
                );

                const content = Handlebars.compile(obj.content)(data);

                const color = obj.color.startsWith("#") ? hexToRgb(obj.color) : rgb(0, 0, 0);

                page.drawText(content, {
                    x: obj.x,
                    y: obj.y,
                    size: obj.fontSize || 12,
                    font,
                    color,
                });
            }

            // TODO: agregar más tipos como imagen, rectángulo, línea si se necesita
        }

        // 4️⃣ Guardar PDF y retornar buffer
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    } catch (error) {
        throw new Error("Error generating PDF from template: " + error.message);
    }
};

// Helper para convertir HEX a rgb()
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return rgb(r, g, b);
}

module.exports = { generatePdfFromTemplate };

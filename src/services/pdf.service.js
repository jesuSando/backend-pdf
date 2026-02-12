const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const Handlebars = require("handlebars");

const generatePdf = async (htmlTemplate, data) => {
    try {
        // 1️⃣ Compilar HTML con Handlebars
        const compiledHtml = Handlebars.compile(htmlTemplate)(data);

        // 2️⃣ Crear documento PDF
        const pdfDoc = await PDFDocument.create();

        // 3️⃣ Agregar página
        const page = pdfDoc.addPage();

        // Configurar tamaño de página (A4 por defecto)
        const { width, height } = page.getSize();

        // 4️⃣ Fuente
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;

        // 5️⃣ Dibujar texto (HTML simple como texto plano)
        page.drawText(compiledHtml, {
            x: 50,
            y: height - 50,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: width - 100,
            lineHeight: 14,
        });

        // 6️⃣ Retornar buffer
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    } catch (error) {
        throw new Error("Error generating PDF: " + error.message);
    }
};

module.exports = {
    generatePdf,
};

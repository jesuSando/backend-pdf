const templateService = require("../services/template.service");
const { generatePdfFromTemplate } = require("../services/pdf.service");

const generatePdfController = async (req, res, next) => {
    try {
        const { templateName, data } = req.body;

        if (!templateName || !data) {
            return res.status(400).json({ message: "templateName and data are required" });
        }

        const template = await templateService.getTemplateByName(templateName);

        if (!template) {
            return res.status(404).json({ message: `Template '${templateName}' not found` });
        }

        const pdfBuffer = await generatePdfFromTemplate(template.template_json, data);

        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${templateName}.pdf`,
            "Content-Length": pdfBuffer.length,
        });

        res.end(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

module.exports = { generatePdfController };

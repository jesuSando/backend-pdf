const templateService = require("../services/template.service");

const createTemplate = async (req, res, next) => {
    try {
        const { name, html } = req.body;

        if (!name || !html) {
            return res.status(400).json({
                message: "Name and html are required",
            });
        }

        const template = await templateService.createTemplate(name, html);

        res.status(201).json({
            message: "Template created successfully",
            template,
        });
    } catch (error) {
        next(error);
    }
};

const getTemplates = async (req, res, next) => {
    try {
        const templates = await templateService.getAllTemplates();

        res.status(200).json({
            templates,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTemplate,
    getTemplates,
};

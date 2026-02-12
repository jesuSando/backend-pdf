const templateService = require("../services/template.service");

const createTemplate = async (req, res, next) => {
    try {
        const { name, templateJson } = req.body;

        if (!name || !templateJson) {
            return res.status(400).json({ message: "name and templateJson are required" });
        }

        const template = await templateService.createTemplate(name, templateJson);

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

const { db } = require("../db/database");


const createTemplate = (name, templateJson) => {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO templates (name, template_json)
      VALUES (?, ?)
    `;

        db.run(query, [name, JSON.stringify(templateJson)], function (err) {
            if (err) return reject(err);
            resolve({
                id: this.lastID,
                name,
                templateJson,
            });
        });
    });
};

const getTemplateByName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM templates WHERE name = ?`;

        db.get(query, [name], (err, row) => {
            if (err) return reject(err);
            if (row) row.template_json = JSON.parse(row.template_json); // parsear JSON antes de retornar
            resolve(row);
        });
    });
};

const getAllTemplates = () => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT id, name, created_at FROM templates
      ORDER BY created_at DESC
    `;
        db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    createTemplate,
    getTemplateByName,
    getAllTemplates,
};

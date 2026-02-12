const { db } = require("../db/database");

const createTemplate = (name, html) => {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO templates (name, html)
      VALUES (?, ?)
    `;

        db.run(query, [name, html], function (err) {
            if (err) {
                return reject(err);
            }

            resolve({
                id: this.lastID,
                name,
                html,
            });
        });
    });
};

const getTemplateByName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT * FROM templates WHERE name = ?
    `;

        db.get(query, [name], (err, row) => {
            if (err) {
                return reject(err);
            }

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
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
};

module.exports = {
    createTemplate,
    getTemplateByName,
    getAllTemplates,
};

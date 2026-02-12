const express = require("express");
const router = express.Router();

const templateController = require("../controllers/template.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// router.use(authMiddleware);


router.post("/", templateController.createTemplate);

router.get("/", templateController.getTemplates);

module.exports = router;

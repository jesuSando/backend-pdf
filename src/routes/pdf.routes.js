const express = require("express");
const router = express.Router();

const pdfController = require("../controllers/pdf.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// router.use(authMiddleware);

router.post("/", pdfController.generatePdfController);

module.exports = router;

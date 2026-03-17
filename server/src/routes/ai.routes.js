const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const { askAI } = require("../controllers/ai.controller");

router.post("/ask", verifyToken, askAI);

module.exports = router;
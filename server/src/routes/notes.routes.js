const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controllers/notes.controller");


router.post("/", verifyToken, createNote);

router.get("/", verifyToken, getNotes);

router.get("/:id", verifyToken, getNoteById);

router.put("/:id", verifyToken, updateNote);

router.delete("/:id", verifyToken, deleteNote);


module.exports = router;
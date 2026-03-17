const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");
const aiRoutes = require("./routes/ai.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("ThinkFlow API Running 🚀");
});

module.exports = app;
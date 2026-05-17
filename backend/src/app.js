import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://note-app-epifi.netlify.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Smart Notes API Running"
  });
});

app.use("/", authRoutes);
app.use("/notes", noteRoutes);

export default app;
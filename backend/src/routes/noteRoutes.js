import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {

  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,

  getSharedUsers,
  updatePermission,
  removeSharedUser,

  getNoteHistory,
  restoreVersion

} from "../controllers/noteController.js";

const router = express.Router();

router.use(authMiddleware);

// =========================
// MAIN
// =========================

router.get("/", getAllNotes);

router.get("/search", searchNotes);

// =========================
// SHARING
// =========================

router.get(
  "/:id/shares",
  getSharedUsers
);

router.put(
  "/:id/shares/:shareId",
  updatePermission
);

router.delete(
  "/:id/shares/:shareId",
  removeSharedUser
);

// =========================
// HISTORY
// =========================

router.get(
  "/:id/history",
  getNoteHistory
);

router.post(
  "/:id/restore/:versionId",
  restoreVersion
);

// =========================
// SINGLE NOTE
// IMPORTANT: KEEP BELOW
// =========================

router.get("/:id", getSingleNote);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

router.post("/:id/share", shareNote);

export default router;
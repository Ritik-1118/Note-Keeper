import express from "express";
import * as NotesController from "../controllers/notes";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/:userId",requiresAuth, NotesController.getNotes);
router.get("/noteById/:id", NotesController.getNoteById);
router.get("/searchByTitle", NotesController.searchByTitle);

router.post("/:userId", NotesController.createNote);
router.put("/:userId/:noteId", NotesController.updateNote);
router.delete("/:userId/:noteId", NotesController.deleteNote);
router.put("/addLabelInNote", NotesController.addLabelInNote); 

router.get("/getAllNotesByLabel/:userId",NotesController.getAllNotesByLabel)

router.patch("/createLabel",NotesController.createLabel);
router.post("/createNoteInLabel",NotesController.createNoteInLabel);
router.get("/getNotesByLabel",NotesController.getNotesByLabel);


export default router;
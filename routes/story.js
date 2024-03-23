import express from "express";
import { createStory, deleteStory, getAllStory } from "../controllers/story.js";

const router = express.Router();

router.post("/", createStory);

router.get("/", getAllStory);

router.delete("/:storyId", deleteStory);

export default router;

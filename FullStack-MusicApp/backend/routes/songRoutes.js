const express = require("express");
const songController = require("../controllers/songController");

const router = express.Router();

// GET all songs
router.get("/", songController.getAllSongs);

// GET song by ID
router.get("/:id", songController.getSongById);

// CREATE a new song
router.post("/", songController.createSong);

// UPDATE a song
router.put("/:id", songController.updateSong);

// DELETE a song
router.delete("/:id", songController.deleteSong);

module.exports = router; 
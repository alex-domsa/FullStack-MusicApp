const express = require("express");
const artistController = require("../controllers/artistController");

const router = express.Router();

// GET all artists
router.get("/", artistController.getAllArtists);

// GET artist by ID
router.get("/:id", artistController.getArtistById);

// CREATE a new artist
router.post("/", artistController.createArtist);

// UPDATE an artist
router.put("/:id", artistController.updateArtist);

// DELETE an artist
router.delete("/:id", artistController.deleteArtist);

module.exports = router; 
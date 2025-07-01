const express = require("express");
const albumController = require("../controllers/albumController");

const router = express.Router();

// GET all albums
router.get("/", albumController.getAllAlbums);

// GET album by ID
router.get("/:id", albumController.getAlbumById);

// CREATE a new album
router.post("/", albumController.createAlbum);

// UPDATE an album
router.put("/:id", albumController.updateAlbum);

// DELETE an album
router.delete("/:id", albumController.deleteAlbum);

module.exports = router; 
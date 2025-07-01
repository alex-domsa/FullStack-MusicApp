// Artist Controller - CRUD Operations

// Get all artists
exports.getAllArtists = (req, res) => {
  const { query } = req.query;
  let sqlQuery = "SELECT * FROM artists";
  
  if (query) {
    sqlQuery += ` WHERE name LIKE '%${query}%' OR genre LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching artists: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get artist by ID
exports.getArtistById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM artists WHERE id = ?";
  
  connection.query(query, [id], (err, artistResults) => {
    if (err) {
      console.error("Error fetching artist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (artistResults.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    const artist = artistResults[0];
    
    // Get albums for this artist
    const albumsQuery = "SELECT * FROM albums WHERE artist_id = ?";
    connection.query(albumsQuery, [id], (err, albumsResults) => {
      if (err) {
        console.error("Error fetching artist albums: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      // Get songs for this artist
      const songsQuery = "SELECT * FROM songs WHERE artist_id = ?";
      connection.query(songsQuery, [id], (err, songsResults) => {
        if (err) {
          console.error("Error fetching artist songs: ", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        // Add albums and songs to artist object
        artist.albums = albumsResults;
        artist.songs = songsResults;
        
        res.status(200).json(artist);
      });
    });
  });
};

// Create a new artist
exports.createArtist = (req, res) => {
  const { name, monthly_listeners, genre } = req.body;
  
  if (!name || !monthly_listeners || !genre) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "INSERT INTO artists (name, monthly_listeners, genre) VALUES (?, ?, ?)";
  
  connection.query(query, [name, monthly_listeners, genre], (err, results) => {
    if (err) {
      console.error("Error creating artist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      name,
      monthly_listeners,
      genre
    });
  });
};

// Update an artist
exports.updateArtist = (req, res) => {
  const { id } = req.params;
  const { name, monthly_listeners, genre } = req.body;
  
  if (!name && !monthly_listeners && !genre) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE artists SET ";
  const queryParams = [];
  
  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  
  if (monthly_listeners) {
    query += "monthly_listeners = ?, ";
    queryParams.push(monthly_listeners);
  }
  
  if (genre) {
    query += "genre = ?, ";
    queryParams.push(genre);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating artist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete an artist
exports.deleteArtist = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM artists WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting artist: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    res.status(200).json({ message: "Artist deleted successfully" });
  });
}; 
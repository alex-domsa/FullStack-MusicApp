// Song Controller - CRUD Operations

// Get all songs
exports.getAllSongs = (req, res) => {
  const { query } = req.query;
  let sqlQuery = `
    SELECT songs.*, artists.name as artist_name, albums.name as album_name
    FROM songs
    LEFT JOIN artists ON songs.artist_id = artists.id
    LEFT JOIN albums ON songs.album_id = albums.id
  `;
  
  if (query) {
    sqlQuery += ` WHERE songs.name LIKE '%${query}%' OR artists.name LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching songs: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get song by ID
exports.getSongById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT songs.*, artists.name as artist_name, albums.name as album_name
    FROM songs
    LEFT JOIN artists ON songs.artist_id = artists.id
    LEFT JOIN albums ON songs.album_id = albums.id
    WHERE songs.id = ?
  `;
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching song: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }
    
    res.status(200).json(results[0]);
  });
};

// Create a new song
exports.createSong = (req, res) => {
  const { name, artist_id, album_id, release_year } = req.body;
  
  if (!name || !release_year || !artist_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "INSERT INTO songs (name, artist_id, album_id, release_year) VALUES (?, ?, ?, ?)";
  
  connection.query(query, [name, artist_id, album_id, release_year], (err, results) => {
    if (err) {
      console.error("Error creating song: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      name,
      artist_id,
      album_id,
      release_year
    });
  });
};

// Update a song
exports.updateSong = (req, res) => {
  const { id } = req.params;
  const { name, artist_id, album_id, release_year } = req.body;
  
  if (!name && !artist_id && !album_id && !release_year) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE songs SET ";
  const queryParams = [];
  
  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  
  if (artist_id) {
    query += "artist_id = ?, ";
    queryParams.push(artist_id);
  }
  
  if (album_id) {
    query += "album_id = ?, ";
    queryParams.push(album_id);
  }
  
  if (release_year) {
    query += "release_year = ?, ";
    queryParams.push(release_year);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating song: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Song not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete a song
exports.deleteSong = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM songs WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting song: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Song not found" });
    }
    
    res.status(200).json({ message: "Song deleted successfully" });
  });
}; 
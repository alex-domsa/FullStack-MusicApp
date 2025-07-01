// Album Controller - CRUD Operations

// Get all albums
exports.getAllAlbums = (req, res) => {
  const { query } = req.query;
  let sqlQuery = `
    SELECT albums.*, artists.name as artist_name
    FROM albums
    LEFT JOIN artists ON albums.artist_id = artists.id
  `;
  
  if (query) {
    sqlQuery += ` WHERE albums.name LIKE '%${query}%' OR artists.name LIKE '%${query}%'`;
  }
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error fetching albums: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get album by ID
exports.getAlbumById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT albums.*, artists.name as artist_name
    FROM albums
    LEFT JOIN artists ON albums.artist_id = artists.id
    WHERE albums.id = ?
  `;
  
  connection.query(query, [id], (err, albumResult) => {
    if (err) {
      console.error("Error fetching album: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (albumResult.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    
    // Get songs for this album
    const songsQuery = "SELECT * FROM songs WHERE album_id = ?";
    connection.query(songsQuery, [id], (err, songsResults) => {
      if (err) {
        console.error("Error fetching album songs: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      const album = albumResult[0];
      album.songs = songsResults;
      
      res.status(200).json(album);
    });
  });
};

// Create a new album
exports.createAlbum = (req, res) => {
  const { name, artist_id, release_year, listens } = req.body;
  
  if (!name || !artist_id || !release_year) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  const query = "INSERT INTO albums (name, artist_id, release_year, listens) VALUES (?, ?, ?, ?)";
  
  connection.query(query, [name, artist_id, release_year, listens || 0], (err, results) => {
    if (err) {
      console.error("Error creating album: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ 
      id: results.insertId,
      name,
      artist_id,
      release_year,
      listens: listens || 0
    });
  });
};

// Update an album
exports.updateAlbum = (req, res) => {
  const { id } = req.params;
  const { name, artist_id, release_year, listens } = req.body;
  
  if (!name && !artist_id && !release_year && listens === undefined) {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  let query = "UPDATE albums SET ";
  const queryParams = [];
  
  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  
  if (artist_id) {
    query += "artist_id = ?, ";
    queryParams.push(artist_id);
  }
  
  if (release_year) {
    query += "release_year = ?, ";
    queryParams.push(release_year);
  }
  
  if (listens !== undefined) {
    query += "listens = ?, ";
    queryParams.push(listens);
  }
  
  // Remove trailing comma and space
  query = query.slice(0, -2);
  
  query += " WHERE id = ?";
  queryParams.push(id);
  
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error updating album: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    
    res.status(200).json({ 
      id,
      ...req.body
    });
  });
};

// Delete an album
exports.deleteAlbum = (req, res) => {
  const { id } = req.params;
  
  const query = "DELETE FROM albums WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting album: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    
    res.status(200).json({ message: "Album deleted successfully" });
  });
}; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function SongPage() {
  // State for song data
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    release_year: '',
    artist_id: '',
    album_id: ''
  });
  const [selectedSong, setSelectedSong] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch songs, artists, and albums on component mount
  useEffect(() => {
    fetchSongs();
    fetchArtists();
    fetchAlbums();
  }, []);

  // Fetch all songs from the API
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/songs`);
      setSongs(response.data);
      setResponseMessage('Songs loaded successfully');
    } catch (error) {
      console.error('Error fetching songs:', error);
      setResponseMessage('Error loading songs');
    }
  };

  // Fetch all artists for dropdown
  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${API_URL}/artists`);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  // Fetch all albums for dropdown
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/albums`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create a new song
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/songs`, formData);
      setSongs([...songs, response.data]);
      setFormData({ name: '', release_year: '', artist_id: '', album_id: '' });
      setResponseMessage('Song created successfully');
      fetchSongs(); // Refresh to get updated data with joins
    } catch (error) {
      console.error('Error creating song:', error);
      setResponseMessage('Error creating song');
    }
  };

  // Select a song for editing
  const handleSelect = (song) => {
    setSelectedSong(song);
    setFormData({
      name: song.name,
      release_year: song.release_year,
      artist_id: song.artist_id,
      album_id: song.album_id || ''
    });
  };

  // Update an existing song
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSong) return;

    try {
      const response = await axios.put(`${API_URL}/songs/${selectedSong.id}`, formData);
      setSongs(songs.map(song => 
        song.id === selectedSong.id ? { ...song, ...response.data } : song
      ));
      setFormData({ name: '', release_year: '', artist_id: '', album_id: '' });
      setSelectedSong(null);
      setResponseMessage('Song updated successfully');
      fetchSongs(); // Refresh to get updated data with joins
    } catch (error) {
      console.error('Error updating song:', error);
      setResponseMessage('Error updating song');
    }
  };

  // Delete a song
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/songs/${id}`);
      setSongs(songs.filter(song => song.id !== id));
      if (selectedSong && selectedSong.id === id) {
        setSelectedSong(null);
        setFormData({ name: '', release_year: '', artist_id: '', album_id: '' });
      }
      setResponseMessage('Song deleted successfully');
    } catch (error) {
      console.error('Error deleting song:', error);
      setResponseMessage('Error deleting song');
    }
  };

  // Clear the form
  const handleClear = () => {
    setFormData({ name: '', release_year: '', artist_id: '', album_id: '' });
    setSelectedSong(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Songs</h2>
      
      {/* Song Form */}
      <div className="form-section">
        <h3>{selectedSong ? 'Edit Song' : 'Add New Song'}</h3>
        <form onSubmit={selectedSong ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="name">Song Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="release_year">Release Year:</label>
            <input
              type="number"
              id="release_year"
              name="release_year"
              value={formData.release_year}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="artist_id">Artist:</label>
            <select
              id="artist_id"
              name="artist_id"
              value={formData.artist_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an artist</option>
              {artists.map(artist => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="album_id">Album (Optional):</label>
            <select
              id="album_id"
              name="album_id"
              value={formData.album_id}
              onChange={handleInputChange}
            >
              <option value="">None</option>
              {albums.map(album => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedSong ? 'Update Song' : 'Add Song'}
            </button>
            <button type="button" onClick={handleClear}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
      
      {/* Response Message */}
      {responseMessage && (
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      )}
      
      {/* Song Table */}
      <div className="table-section">
        <h3>Song List</h3>
        {songs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Release Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id}>
                  <td>{song.id}</td>
                  <td>{song.name}</td>
                  <td>{song.artist_name}</td>
                  <td>{song.album_name || 'None'}</td>
                  <td>{song.release_year}</td>
                  <td>
                    <button onClick={() => handleSelect(song)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDelete(song.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No songs found. Add a song to get started.</p>
        )}
      </div>
    </div>
  );
}

export default SongPage; 
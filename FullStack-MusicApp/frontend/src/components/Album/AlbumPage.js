import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function AlbumPage() {
  // State for album data
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    artist_id: '',
    release_year: '',
    listens: '0'
  });
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch albums and artists on component mount
  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  // Fetch all albums from the API
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/albums`);
      setAlbums(response.data);
      setResponseMessage('Albums loaded successfully');
    } catch (error) {
      console.error('Error fetching albums:', error);
      setResponseMessage('Error loading albums');
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Create a new album
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/albums`, formData);
      setAlbums([...albums, response.data]);
      setFormData({ name: '', artist_id: '', release_year: '', listens: '0' });
      setResponseMessage('Album created successfully');
      fetchAlbums(); // Refresh to get updated data with joins
    } catch (error) {
      console.error('Error creating album:', error);
      setResponseMessage('Error creating album');
    }
  };

  // Select an album for editing
  const handleSelect = (album) => {
    setSelectedAlbum(album);
    setFormData({
      name: album.name,
      artist_id: album.artist_id,
      release_year: album.release_year,
      listens: album.listens
    });
  };

  // Update an existing album
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAlbum) return;

    try {
      const response = await axios.put(`${API_URL}/albums/${selectedAlbum.id}`, formData);
      setAlbums(albums.map(album => 
        album.id === selectedAlbum.id ? { ...album, ...response.data } : album
      ));
      setFormData({ name: '', artist_id: '', release_year: '', listens: '0' });
      setSelectedAlbum(null);
      setResponseMessage('Album updated successfully');
      fetchAlbums(); // Refresh to get updated data with joins
    } catch (error) {
      console.error('Error updating album:', error);
      setResponseMessage('Error updating album');
    }
  };

  // Delete an album
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/albums/${id}`);
      setAlbums(albums.filter(album => album.id !== id));
      if (selectedAlbum && selectedAlbum.id === id) {
        setSelectedAlbum(null);
        setFormData({ name: '', artist_id: '', release_year: '', listens: '0' });
      }
      setResponseMessage('Album deleted successfully');
    } catch (error) {
      console.error('Error deleting album:', error);
      setResponseMessage('Error deleting album');
    }
  };

  // Clear the form
  const handleClear = () => {
    setFormData({ name: '', artist_id: '', release_year: '', listens: '0' });
    setSelectedAlbum(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Albums</h2>
      
      {/* Album Form */}
      <div className="form-section">
        <h3>{selectedAlbum ? 'Edit Album' : 'Add New Album'}</h3>
        <form onSubmit={selectedAlbum ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="name">Album Name:</label>
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
            <label htmlFor="listens">Listens:</label>
            <input
              type="number"
              id="listens"
              name="listens"
              value={formData.listens}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedAlbum ? 'Update Album' : 'Add Album'}
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
      
      {/* Album Table */}
      <div className="table-section">
        <h3>Album List</h3>
        {albums.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Artist</th>
                <th>Release Year</th>
                <th>Listens</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map(album => (
                <tr key={album.id}>
                  <td>{album.id}</td>
                  <td>{album.name}</td>
                  <td>{album.artist_name}</td>
                  <td>{album.release_year}</td>
                  <td>{album.listens}</td>
                  <td>
                    <button onClick={() => handleSelect(album)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDelete(album.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No albums found. Add an album to get started.</p>
        )}
      </div>
    </div>
  );
}

export default AlbumPage; 
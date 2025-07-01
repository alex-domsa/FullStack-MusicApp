import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function ArtistPage() {
  // State for artist data
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    monthly_listeners: '',
    genre: ''
  });
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch artists on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  // Fetch all artists from the API
  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${API_URL}/artists`);
      setArtists(response.data);
      setResponseMessage('Artists loaded successfully');
    } catch (error) {
      console.error('Error fetching artists:', error);
      setResponseMessage('Error loading artists');
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

  // Create a new artist
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/artists`, formData);
      setArtists([...artists, response.data]);
      setFormData({ name: '', monthly_listeners: '', genre: '' });
      setResponseMessage('Artist created successfully');
    } catch (error) {
      console.error('Error creating artist:', error);
      setResponseMessage('Error creating artist');
    }
  };

  // Select an artist for editing
  const handleSelect = (artist) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name,
      monthly_listeners: artist.monthly_listeners,
      genre: artist.genre
    });
  };

  // Update an existing artist
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedArtist) return;

    try {
      const response = await axios.put(`${API_URL}/artists/${selectedArtist.id}`, formData);
      setArtists(artists.map(artist => 
        artist.id === selectedArtist.id ? { ...artist, ...response.data } : artist
      ));
      setFormData({ name: '', monthly_listeners: '', genre: '' });
      setSelectedArtist(null);
      setResponseMessage('Artist updated successfully');
    } catch (error) {
      console.error('Error updating artist:', error);
      setResponseMessage('Error updating artist');
    }
  };

  // Delete an artist
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/artists/${id}`);
      setArtists(artists.filter(artist => artist.id !== id));
      if (selectedArtist && selectedArtist.id === id) {
        setSelectedArtist(null);
        setFormData({ name: '', monthly_listeners: '', genre: '' });
      }
      setResponseMessage('Artist deleted successfully');
    } catch (error) {
      console.error('Error deleting artist:', error);
      setResponseMessage('Error deleting artist');
    }
  };

  // Clear the form
  const handleClear = () => {
    setFormData({ name: '', monthly_listeners: '', genre: '' });
    setSelectedArtist(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Artists</h2>
      
      {/* Artist Form */}
      <div className="form-section">
        <h3>{selectedArtist ? 'Edit Artist' : 'Add New Artist'}</h3>
        <form onSubmit={selectedArtist ? handleUpdate : handleCreate}>
          <div className="form-group">
            <label htmlFor="name">Artist Name:</label>
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
            <label htmlFor="monthly_listeners">Monthly Listeners:</label>
            <input
              type="number"
              id="monthly_listeners"
              name="monthly_listeners"
              value={formData.monthly_listeners}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit">
              {selectedArtist ? 'Update Artist' : 'Add Artist'}
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
      
      {/* Artist Table */}
      <div className="table-section">
        <h3>Artist List</h3>
        {artists.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Monthly Listeners</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(artist => (
                <tr key={artist.id}>
                  <td>{artist.id}</td>
                  <td>{artist.name}</td>
                  <td>{artist.monthly_listeners}</td>
                  <td>{artist.genre}</td>
                  <td>
                    <button onClick={() => handleSelect(artist)}>Edit</button>
                    <button 
                      className="delete" 
                      onClick={() => handleDelete(artist.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No artists found. Add an artist to get started.</p>
        )}
      </div>
    </div>
  );
}

export default ArtistPage; 
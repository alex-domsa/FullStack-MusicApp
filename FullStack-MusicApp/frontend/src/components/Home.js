import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('artists');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchMessage('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchMessage('');
    setSearchResults([]);

    try {
      let endpoint = `${API_URL}/${searchCategory}?query=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(endpoint);
      
      const results = response.data;

      setSearchResults(results);
      
      if (results.length === 0) {
        setSearchMessage(`No ${searchCategory} found matching "${searchTerm}"`);
      } else {
        setSearchMessage(`Found ${results.length} ${searchCategory} matching "${searchTerm}"`);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchMessage('Error searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return null;
    }

    return (
      <div className="search-results">
        <h3>Search Results</h3>
        <table className="data-table">
          <thead>
            <tr>
              {searchCategory === 'artists' && (
                <>
                  <th>Name</th>
                  <th>Genre</th>
                  <th>Monthly Listeners</th>
                </>
              )}
              {searchCategory === 'songs' && (
                <>
                  <th>Name</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Release Year</th>
                </>
              )}
              {searchCategory === 'albums' && (
                <>
                  <th>Name</th>
                  <th>Artist</th>
                  <th>Release Year</th>
                  <th>Listens</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {searchResults.map((item) => (
              <tr key={item.id}>
                {searchCategory === 'artists' && (
                  <>
                    <td>{item.name}</td>
                    <td>{item.genre}</td>
                    <td>{item.monthly_listeners}</td>
                  </>
                )}
                {searchCategory === 'songs' && (
                  <>
                    <td>{item.name}</td>
                    <td>{item.artist_name}</td>
                    <td>{item.album_name || 'None'}</td>
                    <td>{item.release_year}</td>
                  </>
                )}
                {searchCategory === 'albums' && (
                  <>
                    <td>{item.name}</td>
                    <td>{item.artist_name}</td>
                    <td>{item.release_year}</td>
                    <td>{item.listens}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Welcome to Music App</h2>
      
      {/* Search Section */}
      <div className="search-section">
        <h3>Search Music Database</h3>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-controls">
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-category"
            >
              <option value="artists">Artists</option>
              <option value="songs">Songs</option>
              <option value="albums">Albums</option>
            </select>
            
            <input
              type="text"
              placeholder={`Search ${searchCategory}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {searchMessage && (
          <div className="search-message">
            {searchMessage}
          </div>
        )}
        
        {renderSearchResults()}
      </div>
      
      <div className="home-sections">
        <div className="home-section">
          <h3>Artists</h3>
          <p>View, add, edit, and delete music artists. You can manage artist information like name, monthly listeners, and genre.</p>
          <Link to="/artists">
            <button>Go to Artists</button>
          </Link>
        </div>
        
        <div className="home-section">
          <h3>Songs</h3>
          <p>Manage your song library. Add new songs, update existing ones, or remove songs you no longer want.</p>
          <Link to="/songs">
            <button>Go to Songs</button>
          </Link>
        </div>
        
        <div className="home-section">
          <h3>Albums</h3>
          <p>Organize your music into albums. Create new albums, update album details, or delete albums from your collection.</p>
          <Link to="/albums">
            <button>Go to Albums</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 
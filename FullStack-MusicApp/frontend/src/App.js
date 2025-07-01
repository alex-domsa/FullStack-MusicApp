import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import ArtistPage from './components/Artist/ArtistPage';
import SongPage from './components/Song/SongPage';
import AlbumPage from './components/Album/AlbumPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Alex's Music App</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/artists">Artists</Link></li>
              <li><Link to="/songs">Songs</Link></li>
              <li><Link to="/albums">Albums</Link></li>
            </ul>
          </nav>
        </header>
        
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<ArtistPage />} />
            <Route path="/songs" element={<SongPage />} />
            <Route path="/albums" element={<AlbumPage />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>Alex's S230 Music Application Assignment</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

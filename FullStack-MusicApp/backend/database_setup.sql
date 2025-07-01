-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;

-- Create artists table
CREATE TABLE artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  monthly_listeners INT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create albums table
CREATE TABLE albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  release_year INT NOT NULL,
  listens INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Create songs table
CREATE TABLE songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  album_id INT,
  release_year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
);

-- Insert sample data for artists
INSERT INTO artists (name, monthly_listeners, genre) VALUES
('Taylor Swift', 85000000, 'Pop'),
('Drake', 65000000, 'Hip Hop'),
('The Weeknd', 75000000, 'R&B'),
('Ed Sheeran', 78000000, 'Pop');

-- Insert sample data for albums
INSERT INTO albums (name, artist_id, release_year, listens) VALUES
('Midnights', 1, 2022, 1500000),
('Certified Lover Boy', 2, 2021, 1200000),
('After Hours', 3, 2020, 1300000),
('Divide', 4, 2017, 2000000);

-- Insert sample data for songs
INSERT INTO songs (name, artist_id, album_id, release_year) VALUES
('Anti-Hero', 1, 1, 2022),
('Lavender Haze', 1, 1, 2022),
('Way 2 Sexy', 2, 2, 2021),
('Knife Talk', 2, 2, 2021),
('Blinding Lights', 3, 3, 2020),
('Save Your Tears', 3, 3, 2020),
('Shape of You', 4, 4, 2017),
('Castle on the Hill', 4, 4, 2017); 
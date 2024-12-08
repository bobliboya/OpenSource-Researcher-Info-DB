import React, { useState } from "react";
import "./Music.css";

const Music = () => {
  const [title, setTitle] = useState('');
  const [musicId, setMusicId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  

  const handleSearch = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setError('');
    setDeleteMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/music?title=${encodeURIComponent(title)}`);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }
      const data = await response.json();
      if (data.file_url) {
        setAudioUrl(`http://localhost:5000${data.file_url}`);
      } else {
        setError("No audio file found.");
      }
    } catch (err) {
      console.error("Error fetching audio file:", err);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!musicId.trim()) {
      setError("Please enter a MusicId");
      return;
    }

    setError('');
    setSearchResults([]);
    try {
      const response = await fetch(`http://localhost:5000/api/music/delete?musicId=${encodeURIComponent(musicId)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "An error occurred");
        return;
      }
      setDeleteMessage(data.message);
    } catch (err) {
      console.error("Error deleting music data:", err);
      setError("Failed to delete data. Please try again.");
    }
  };

  return (
    <div className="music">
      <h2>This will be our music page</h2>
      <p>Use the search bar to look up genres or delete a music file by its ID.</p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {audioUrl && (
        <div className="audio-player">
          <h3>Now Playing:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Delete Bar */}
      <div className="delete-bar">
        <input
          type="text"
          value={musicId}
          onChange={(e) => setMusicId(e.target.value)}
          placeholder="Enter MusicId to delete"
          className="delete-input"
        />
        <button onClick={handleDelete} className="delete-button">Delete</button>
      </div>

      {/* Error Messages */}
      {error && <p className="error-message">{error}</p>}
      {deleteMessage && <p className="success-message">{deleteMessage}</p>}

      {/* Search Results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index} className="search-result-item">
              Genre: {result.genre}
            </div>
          ))
        ) : (
          !error && !deleteMessage && <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Music;

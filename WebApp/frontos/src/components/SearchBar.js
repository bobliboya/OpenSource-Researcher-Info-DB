import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (query.trim() === "") {
      setError("Search term cannot be empty.");
      return;
    }

    setError(""); // Clear any previous error

    // Make backend call or trigger parent function
    if (onSearch) {
      onSearch(query); // Pass the query to parent component
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search for a title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SearchBar;

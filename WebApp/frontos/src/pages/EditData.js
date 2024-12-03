import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import EditBox from "../components/EditBox";


const EditData = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    console.log("Going to backend to search for:", query);

    // Fetch from backend
    fetch(`http://127.0.0.1:5000/api/GetWorkInfo?title=${encodeURIComponent(query)}`)
    .then((response) => {
        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Results from backend:", data);
        setResults([data]); // Update state with the array
      })
      .catch((error) => {
        console.error("Error while searching:", error);
        // setResults([]); // Clear results on error
      });
  };



  // Should save to backend
  const handleSave = (updatedData) => {
    console.log("Updated Data:", updatedData);
    // Perform your save logic here, e.g., send to the backend
  };

  return (
    <div>
      <h3 style={{padding: "20px"}}>
        Search for a work by title <br /> to edit any field
      </h3>
        <SearchBar onSearch={handleSearch} />

      <div style={{ margin: "20px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {results.length > 0 ? (
          results.map((item) => (
              <EditBox data={results[0]} onSave={handleSave} />
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#999" }}>nothing</p>
        )}
      </div>
    </div>
  );
};

export default EditData;

import React from "react";
import SearchBar from "../components/SearchBar";

const EditData = () => {
  console.log("here\n\n\n");
  const handleSearch = (query) => {
    console.log("Going to backend to search for:", query);
    // Call on backend to load in cards 
  };

  return (
    <div>
      <h3 style={{margin: "100px", padding: "20px"}}>
        Search for a work by title <br /> to edit any field
        <SearchBar onSearch={handleSearch} />
      </h3>
    </div>
  );
};

export default EditData;

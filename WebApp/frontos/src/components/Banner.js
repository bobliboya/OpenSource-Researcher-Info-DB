import React from "react";
import { Link } from "react-router-dom"; // For navigation
import "./Banner.css";

const Banner = () => {
  return (
    <header className="banner">
      <div className="banner-left">
        <h1 className="banner-title">Open Source</h1>
      </div>
      <div className="banner-right">
        <Link to="/" className="banner-button">Home</Link>
        <Link to="/board" className="banner-button">Board</Link>
        <Link to="/about" className="banner-button">About</Link>
        <Link to="/music" className="banner-button">Music</Link>
        <Link to="/edit-data" className="banner-button">Edit Data</Link>
        <Link to="/statistics" className="banner-button">Statistics</Link>
      </div>
    </header>
  );
};

export default Banner;

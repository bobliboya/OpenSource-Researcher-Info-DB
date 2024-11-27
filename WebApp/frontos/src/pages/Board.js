// import React from "react";
// import "./Board.css";
// import GetAllAuthors from "../components/GetAllAuthors";
// const Board = () => {
//     return (
//       <div className="board">
//         <h2>This will be our board page</h2>
//         <p>
//           While we work on this, have a look at our read functionality for the authors we have info on.
//           <GetAllAuthors />
//         </p>
//       </div>
//     );
//   };

// export default Board;

// src/pages/Board.js

import React from "react";
import "./Board.css"; // Ensure the path is correct based on your project structure
// Uncomment the following line if you want to include the GetAllAuthors component
// import GetAllAuthors from "../components/GetAllAuthors";

const Board = () => {
    return (
        <div className="board-page">
            {/* Navbar */}
            <div className="navbar">
                <h1>Navbar</h1>
            </div>

            {/* Main Content */}
            <div className="board-content">
                {/* Create Board Section */}
                <div className="create-board">
                    <h2>Create New Board</h2>
                    <input
                        type="text"
                        placeholder="Insert board name here"
                        className="board-input"
                    />
                    <button className="create-button">Create</button>
                </div>

                {/* Insert Options Section */}
                <div className="insert-options">
                    <button className="option-button">Insert universities here</button>
                    <button className="option-button">Insert topics here</button>
                    <button className="option-button">Insert people here</button>
                </div>
            </div>

            {/* Optional: Include GetAllAuthors Component */}
            {/* 
            <div className="authors-section">
                <h2>Authors</h2>
                <GetAllAuthors />
            </div>
            */}
        </div>
    );
};

export default Board;

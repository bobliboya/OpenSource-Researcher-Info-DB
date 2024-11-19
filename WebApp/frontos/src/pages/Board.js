import React from "react";
import "./Board.css";
import GetAllAuthors from "../components/GetAllAuthors";
const Board = () => {
    return (
      <div className="board">
        <h2>This will be our board page</h2>
        <p>
          While we work on this, have a look at our read functionality for the authors we have info on.
          <GetAllAuthors />
        </p>
      </div>
    );
  };

export default Board;

// src/pages/Board.js

import React, { useState } from "react";
import "./Board.css";
import axios from "axios"; // Import axios for HTTP requests
import graph_holder from "./img/graph_holder.png"

function processInput(inputString) {
    // Split the input by semicolons
    let elements = inputString.split(";");

    // Trim leading and trailing whitespace and newlines from each element
    elements = elements.map(element => element.trim());

    // Return the processed array
    return elements;
}

const Board = () => {
    // State variables for board creation and inputs
    const [universityInput, setUniversityInput] = useState(""); // For searching universities
    const [topicInput, setTopicInput] = useState("");
    const [peopleInput, setPeopleInput] = useState("");

    // State variables for fetched data
    const [universities, setUniversities] = useState([]);
    const [topics, setTopics] = useState([]);
    const [people, setPeople] = useState([]);

    // State variables for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Handler for fetching universities
    const handleFetchUniversities = async () => {
        if (!universityInput.trim()) {
            setError("Please enter a university name.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                `/api/universities?name=${encodeURIComponent(universityInput)}`
            );
            setUniversities(response.data); // Adjust based on your backend response structure
        } catch (err) {
            console.error(err);
            setError("Failed to fetch universities.");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTopics = async () => {
        setMessage("This is a message for handleFetchTopics!");
        let parsed = processInput(topicInput);
        console.log(parsed);
        return;
    };

    const handleFetchPeople = async () => {
        setMessage("This is a message for handleFetchPeople!");
        return;
    };

    return (
        <div className="board-page">
            {/* Main Content */}
            <div className="board-content">

                <div className="board-area">
                    <img src={graph_holder} width="80%" ></img>
                    
                </div>
                {/* Insert Options Section */}
                <div className="insert-options">
                    <h2>Add Content</h2>
                    {/* Universities */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert universities here"
                            className="option-input"
                            value={universityInput} // Use distinct state for university input
                            onChange={(e) => setUniversityInput(e.target.value)}
                        />
                        <button onClick={handleFetchUniversities}>
                            Insert Universities
                        </button>
                        {/* Display Universities */}
                        {universities.length > 0 && (
                            <ul className="results-list">
                                {universities.map((uni) => (
                                    <li key={uni.id}>{uni.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Topics */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert topics here"
                            className="option-input"
                            value={topicInput} // Use distinct state for university input
                            onChange={(e) => setTopicInput(e.target.value)}
                        />
                        <button onClick={handleFetchTopics}>Insert Topics</button>
                    </div>

                    {/* People */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert people here"
                            className="option-input"
                            value={peopleInput} // Use distinct state for university input
                            onChange={(e) => setPeopleInput(e.target.value)}
                        />
                        <button onClick={handleFetchPeople}>Insert People</button>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && <div className="loading">Loading...</div>}

            {/* Error Message */}
            {error && <div className="error">{error}</div>}

            {/* Regular Message */}
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default Board;


// // src/pages/Board.js

// import React, { useState } from "react";
// import "./Board.css";
// import axios from "axios"; // Import axios for HTTP requests

// const Board = () => {
//     // State variables for board creation and inputs
//     const [boardName, setBoardName] = useState(""); // For creating new board
//     const [universityInput, setUniversityInput] = useState(""); // For searching universities
//     const [topicInput, setTopicInput] = useState("");
//     const [peopleInput, setPeopleInput] = useState("");

//     // State variables for fetched data
//     const [universities, setUniversities] = useState([]);
//     const [topics, setTopics] = useState([]);
//     const [people, setPeople] = useState([]);

//     // State variables for loading and error handling
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Handler for fetching universities
//     const handleFetchUniversities = async () => {
//         if (!universityInput.trim()) {
//             setError("Please enter a university name.");
//             return;
//         }

//         setLoading(true);
//         setError("");
//         try {
//             const response = await axios.get(
//                 `/api/universities?name=${encodeURIComponent(universityInput)}`
//             );
//             setUniversities(response.data); // Adjust based on your backend response structure
//         } catch (err) {
//             console.error(err);
//             setError("Failed to fetch universities.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="board-page">
//             {/* Main Content */}
//             <div className="board-content">
//                 {/* Create Board Section */}
//                 <div className="create-board">
//                     <h2>Create New Board</h2>
//                     <input
//                         type="text"
//                         placeholder="Insert board name here"
//                         className="board-input"
//                         value={boardName} // Use distinct state for board name
//                         onChange={(e) => setBoardName(e.target.value)}
//                     />
//                     <button className="create-button">Create</button>
//                 </div>

//                 {/* Insert Options Section */}
//                 <div className="insert-options">
//                     {/* Universities */}
//                     <div className="insert-option">
                        
//                         <input
//                             type="text"
//                             placeholder="Search Universities"
//                             className="option-input"
//                             value={universityInput} // Use distinct state for university input
//                             onChange={(e) => setUniversityInput(e.target.value)}
//                         />
//                         <button className="option-button" onClick={handleFetchUniversities}>
//                             Insert Universities
//                         </button>
//                         {/* Display Universities */}
//                         {universities.length > 0 && (
//                             <ul className="results-list">
//                                 {universities.map((uni) => (
//                                     <li key={uni.id}>{uni.name}</li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>

//                     {/* Topics */}
//                     <div className="insert-option">
//                         <input
//                             type="text"
//                             placeholder="Search Topics"
//                             className="option-input"
//                             value={topicInput}
//                             onChange={(e) => setTopicInput(e.target.value)}
//                         />
//                         <button className="option-button">Insert Topics</button>
//                     </div>

//                     {/* People */}
//                     <div className="insert-option">
//                         <input
//                             type="text"
//                             placeholder="Search People"
//                             className="option-input"
//                             value={peopleInput}
//                             onChange={(e) => setPeopleInput(e.target.value)}
//                         />
//                         <button className="option-button">Insert People</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Loading Indicator */}
//             {loading && <div className="loading">Loading...</div>}

//             {/* Error Message */}
//             {error && <div className="error">{error}</div>}
//         </div>
//     );
// };

// export default Board;


// src/pages/Board.js

import React, { useState } from "react";
import "./Board.css";
import axios from "axios"; // Import axios for HTTP requests


const Board = () => {
    // State variables for board creation and inputs
    const [boardName, setBoardName] = useState(""); // For creating new board
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

    return (
        <div className="board-page">
            {/* Main Content */}
            <div className="board-content">
                {/* Create Board Section */}
                <div className="create-board">
                    <h2>Create New Board</h2>
                    <input
                        type="text"
                        placeholder="Insert board name here"
                        className="board-input"
                        value={boardName} // Use distinct state for board name
                        onChange={(e) => setBoardName(e.target.value)}
                    />
                    <button className="create-button">Create</button>
                </div>

                {/* Insert Options Section */}
                <div className="insert-options">
                    {/* Universities */}
                    <div className="insert-option">
                        
                        <input
                            type="text"
                            placeholder="Search Universities"
                            className="option-input"
                            value={universityInput} // Use distinct state for university input
                            onChange={(e) => setUniversityInput(e.target.value)}
                        />
                        <button className="option-button" onClick={handleFetchUniversities}>
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
                        <input
                            type="text"
                            placeholder="Search Topics"
                            className="option-input"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                        />
                        <button className="option-button">Insert Topics</button>
                    </div>

                    {/* People */}
                    <div className="insert-option">
                        <input
                            type="text"
                            placeholder="Search People"
                            className="option-input"
                            value={peopleInput}
                            onChange={(e) => setPeopleInput(e.target.value)}
                        />
                        <button className="option-button" onClick={handleInsertPeople}>
                            Insert People
                        </button>
                    </div>

                </div>
            </div>

            {/* Loading Indicator */}
            {loading && <div className="loading">Loading...</div>}

            {/* Error Message */}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

const handleInsertPeople = async () => {
    if (!peopleInput.trim()) {
        setError("Please enter a person's name.");
        return;
    }

    setLoading(true);
    setError("");

    try {
        // Replace the URL with your backend endpoint
        const response = await axios.get(
            `http://localhost:5000/api/people?name=${encodeURIComponent(peopleInput)}`
        );

        // Log the response (optional)
        console.log("Response from backend:", response.data);
    } catch (err) {
        console.error(err);
        setError("Failed to fetch people.");
    } finally {
        setLoading(false);
    }
};


export default Board;

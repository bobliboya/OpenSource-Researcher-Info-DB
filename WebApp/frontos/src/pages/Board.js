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


import React, { useState } from "react";
import "./Board.css"; // Include a CSS file for styling

const UniversityForm = () => {
    const [universityInput, setUniversityInput] = useState("");
    const [universityInfo, setUniversityInfo] = useState(null);

    const handleFetchUniversities = () => {
        if (!universityInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("University Input:", universityInput); 

        fetch("http://127.0.0.1:5000/api/insertUniversity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ university: universityInput }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to insert: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("University successfully inserted:", data);
                setUniversityInfo(data); // Display the university information
                setUniversityInput(""); // Clear the input field
            })
            .catch((error) => {
                console.error("Error inserting university:", error);
            });
    };

    return (
        <div className="container">
            <div className="info-board">
                {universityInfo ? (
                    <div>
                        <h3>University Info</h3>
                        <p><strong>Name:</strong> {universityInfo.name}</p>
                        <p><strong>Location:</strong> {universityInfo.location}</p>
                        <p><strong>Details:</strong> {universityInfo.details}</p>
                    </div>
                ) : (
                    <p>No university information to display</p>
                )}
            </div>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Universities"
                    className="option-input"
                    value={universityInput}
                    onChange={(e) => setUniversityInput(e.target.value)}
                />
                <button className="option-button" onClick={handleFetchUniversities}>
                    Insert University
                </button>
            </div>
        </div>
    );
};

export default UniversityForm;


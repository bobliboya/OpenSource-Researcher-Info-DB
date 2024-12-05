import React, { useState } from "react";
import "./Board.css"; // Include a CSS file for styling
import axios from "axios"; // Import axios for HTTP requests
import graph_holder from "./img/graph_holder.png"

function processInput(inputString) {
    let elements = inputString.split(";");
    elements = elements.map(element => element.trim());
    return elements;
}

function makeUniversityCard(university) {
    return (<div className="card">
        <div className="card-header">University</div>
        <div className="card-title">{university.Institution_Name}</div>
        <div> <span className="card-rowname"> ID: </span> {university.InstitutionId}</div>
        <div> <span className="card-rowname"> City: </span> {university.City}</div>
        <div> <span className="card-rowname"> Country: </span> {university.Country}</div>
    </div>);
}

function makeTopicCard(topic) {
    return (<div className="card">
        <div className="card-header">Topic</div>
        <div className="card-title">{topic.topic_name}</div>
        <div> <span className="card-rowname"> ID: </span> {topic.topic_id}</div>
        <div> <span className="card-rowname"> Category: </span> {topic.category}</div>
    </div>);
}

function makePeopleCard(people) {
    return (<div className="card">
        <div className="card-header">People</div>
        <div className="card-title">{people.author_name}</div>
        <div> <span className="card-rowname"> ID: </span> {people.author_id}</div>
        <div> <span className="card-rowname"> University: </span> {people.university_name}</div>
    </div>);
}

const Board = () => {
    // State variables for board creation and inputs
    const [universityInput, setUniversityInput] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [peopleInput, setPeopleInput] = useState("");

    // State variables for fetched data
    const [universityInfo, setUniversityInfo] = useState(null);
    const [topicInfo, setTopicInfo] = useState(null);
    const [peopleInfo, setPeopleInfo] = useState(null);

    // // State variables for display loading, error and message
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState("");
    // const [message, setMessage] = useState("");

    // Handler for fetching universities
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
                    throw new Error("Failed to insert: ${response.status}");
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

    // Handler for fetching topics
    const handleFetchTopics = () => {
        if (!topicInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("Topic Input:", topicInput);

        fetch("http://127.0.0.1:5000/api/insertTopic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic: topicInput }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to insert: ${response.status}");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Topic successfully inserted:", data);
                setTopicInfo(data); // Display the topic information
                setTopicInput(""); // Clear the input field
            })
            .catch((error) => {
                console.error("Error inserting topic:", error);
            });
    };

    // Handler for fetching people
    const handleFetchPeople = () => {
        if (!peopleInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("People Input:", peopleInput);

        fetch("http://127.0.0.1:5000/api/insertPeople", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ people: peopleInput }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to insert: ${response.status}");
                }
                return response.json();
            })
            .then((data) => {
                console.log("People successfully inserted:", data);
                setPeopleInfo(data); // Display the people information
                setPeopleInput(""); // Clear the input field
            })
            .catch((error) => {
                console.error("Error inserting people:", error);
            });
    };

    return (
        <div className="board-page">
            {/* Main Content */}
            <div className="board-content">

                <div className="board-area">
                    <div className="info-board">
                        {universityInfo ? (
                            makeUniversityCard(universityInfo)
                        ) : (
                            <p>No university information to display</p>
                        )}

                        {topicInfo ? (
                            makeTopicCard(topicInfo)
                        ) : (
                            <p>No topic information to display</p>
                        )}

                        {peopleInfo ? (
                            makePeopleCard(peopleInfo)
                        ) : (
                            <p>No people information to display</p>
                        )}


                    </div>

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


        </div>
    );
};
export default Board;
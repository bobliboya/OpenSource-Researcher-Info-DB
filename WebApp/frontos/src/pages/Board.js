import React, { useState } from "react";
import "./Board.css"; // Include a CSS file for styling
import graph_holder from "./img/graph_holder.png";

function processInput(inputString) {
    let elements = inputString.split(";");
    elements = elements.map(element => element.trim());
    return elements;
}

function makeUniversityCard(university) {
    return (
        <div className="card" key={university.InstitutionId}>
            <div className="card-header">University</div>
            <div className="card-title">{university.Institution_Name}</div>
            <div>
                <span className="card-rowname">ID:</span> {university.InstitutionId}
            </div>
            <div>
                <span className="card-rowname">City:</span> {university.City}
            </div>
            <div>
                <span className="card-rowname">Country:</span> {university.Country}
            </div>
        </div>
    );
}

function makeTopicCard(topic) {
    return (
        <div className="card" key={topic.topic_id}>
            <div className="card-header">Topic</div>
            <div className="card-title">{topic.topic_name}</div>
            <div>
                <span className="card-rowname">ID:</span> {topic.topic_id}
            </div>
            <div>
                <span className="card-rowname">Category:</span> {topic.category}
            </div>
        </div>
    );
}

function makePeopleCard(people) {
    return (
        <div className="card" key={people.author_id}>
            <div className="card-header">People</div>
            <div className="card-title">{people.author_name}</div>
            <div>
                <span className="card-rowname">ID:</span> {people.author_id}
            </div>
            <div>
                <span className="card-rowname">University:</span> {people.university_name}
            </div>
        </div>
    );
}

const Board = () => {
    // State variables for board creation and inputs
    const [universityInput, setUniversityInput] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [peopleInput, setPeopleInput] = useState("");

    // State variables for fetched data (now arrays)
    const [universityInfo, setUniversityInfo] = useState([]);
    const [topicInfo, setTopicInfo] = useState([]);
    const [peopleInfo, setPeopleInfo] = useState([]);

    // Handler for fetching universities
    const handleFetchUniversities = () => {
        if (!universityInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("University Input:", universityInput);

        // Process the input into an array of universities
        const universityList = processInput(universityInput);

        // Map over the university list and fetch each one
        Promise.all(
            universityList.map((university) =>
                fetch("http://127.0.0.1:5000/api/insertUniversity", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ university: university }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to insert: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("University successfully inserted:", data);
                        return data; // Return the data to be collected in Promise.all
                    })
                    .catch((error) => {
                        console.error("Error inserting university:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
            setUniversityInfo(validData); // Set the array of university information
            setUniversityInput(""); // Clear the input field
        });
    };

    // Handler for fetching topics
    const handleFetchTopics = () => {
        if (!topicInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("Topic Input:", topicInput);

        // Process the input into an array of topics
        const topicList = processInput(topicInput);

        // Map over the topic list and fetch each one
        Promise.all(
            topicList.map((topic) =>
                fetch("http://127.0.0.1:5000/api/insertTopic", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ topic: topic }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to insert: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Topic successfully inserted:", data);
                        return data; // Return the data to be collected in Promise.all
                    })
                    .catch((error) => {
                        console.error("Error inserting topic:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
            setTopicInfo(validData); // Set the array of topic information
            setTopicInput(""); // Clear the input field
        });
    };

    // Handler for fetching people
    const handleFetchPeople = () => {
        if (!peopleInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("People Input:", peopleInput);

        // Process the input into an array of people
        const peopleList = processInput(peopleInput);

        // Map over the people list and fetch each one
        Promise.all(
            peopleList.map((person) =>
                fetch("http://127.0.0.1:5000/api/insertPeople", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ people: person }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to insert: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("People successfully inserted:", data);
                        return data; // Return the data to be collected in Promise.all
                    })
                    .catch((error) => {
                        console.error("Error inserting people:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
            setPeopleInfo(validData); // Set the array of people information
            setPeopleInput(""); // Clear the input field
        });
    };

    return (
        <div className="board-page">
            {/* Main Content */}
            <div className="board-content">
                <div className="board-area">
                    <div className="info-board">
                        {/* Render University Cards */}
                        {universityInfo.length > 0 ? (
                            universityInfo.map((university) => makeUniversityCard(university))
                        ) : (
                            <p>No university information to display</p>
                        )}

                        {/* Render Topic Cards */}
                        {topicInfo.length > 0 ? (
                            topicInfo.map((topic) => makeTopicCard(topic))
                        ) : (
                            <p>No topic information to display</p>
                        )}

                        {/* Render People Cards */}
                        {peopleInfo.length > 0 ? (
                            peopleInfo.map((people) => makePeopleCard(people))
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
                            placeholder="Insert universities here, separated by (;)"
                            className="option-input"
                            value={universityInput}
                            onChange={(e) => setUniversityInput(e.target.value)}
                        />
                        <button onClick={handleFetchUniversities}>Insert Universities</button>
                    </div>

                    {/* Topics */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert topics here, separated by (;)"
                            className="option-input"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                        />
                        <button onClick={handleFetchTopics}>Insert Topics</button>
                    </div>

                    {/* People */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert people here, separated by (;)"
                            className="option-input"
                            value={peopleInput}
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

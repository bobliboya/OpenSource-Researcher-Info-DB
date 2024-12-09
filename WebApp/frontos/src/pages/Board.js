// import React, { useState } from "react";
// import "./Board.css"; // Include a CSS file for styling
// import graph_holder from "./img/graph_holder.png";

// // Function to process input into an array
// function processInput(inputString) {
//     let elements = inputString.split(";");
//     elements = elements.map(element => element.trim());
//     return elements;
// }

// // Function to create a university card
// function makeUniversityCard(university) {
//     return (
//         <div className="card" key={university.InstitutionId}>
//             <div className="card-header">University</div>
//             <div className="card-title">{university.Institution_Name}</div>
//             <div>
//                 <span className="card-rowname">ID:</span> {university.InstitutionId}
//             </div>
//             <div>
//                 <span className="card-rowname">City:</span> {university.City}
//             </div>
//             <div>
//                 <span className="card-rowname">Country:</span> {university.Country}
//             </div>
//         </div>
//     );
// }

// // Function to create a topic card
// function makeTopicCard(topic) {
//     return (
//         <div className="card" key={topic.topic_id}>
//             <div className="card-header">Topic</div>
//             <div className="card-title">{topic.topic_name}</div>
//             <div>
//                 <span className="card-rowname">ID:</span> {topic.topic_id}
//             </div>
//             <div>
//                 <span className="card-rowname">Category:</span> {topic.category}
//             </div>
//         </div>
//     );
// }

// // Function to create a people card
// function makePeopleCard(people) {
//     return (
//         <div className="card" key={people.author_id}>
//             <div className="card-header">People</div>
//             <div className="card-title">{people.author_name}</div>
//             <div>
//                 <span className="card-rowname">ID:</span> {people.author_id}
//             </div>
//             <div>
//                 <span className="card-rowname">University:</span> {people.university_name}
//             </div>
//         </div>
//     );
// }

// // Function to create a work card
// function makeWorkCard(work) {
//     return (
//         <div className="card" key={work.work_id}>
//             <div className="card-header">Work</div>
//             <div className="card-title">{work.title}</div>
//             <div>
//                 <span className="card-rowname">ID:</span> {work.work_id}
//             </div>
//             <div>
//                 <span className="card-rowname">Publication Year:</span> {work.publication_year}
//             </div>
//         </div>
//     );
// }

// const Board = () => {
//     // State variables for board creation and inputs
//     const [universityInput, setUniversityInput] = useState("");
//     const [topicInput, setTopicInput] = useState("");
//     const [peopleInput, setPeopleInput] = useState("");
//     const [workInput, setWorkInput] = useState("");

//     // State variables for fetched data (now arrays)
//     const [universityInfo, setUniversityInfo] = useState([]);
//     const [topicInfo, setTopicInfo] = useState([]);
//     const [peopleInfo, setPeopleInfo] = useState([]);
//     const [workInfo, setWorkInfo] = useState([]);
//     const [imageSrc, setImageSrc] = useState(""); // State variable for image source

//     // Handler for fetching universities
//     const handleFetchUniversities = () => {
//         if (!universityInput.trim()) {
//             console.error("Input is empty");
//             return;
//         }
//         console.log("University Input:", universityInput);

//         // Process the input into an array of universities
//         const universityList = processInput(universityInput);

//         // Map over the university list and fetch each one
//         Promise.all(
//             universityList.map((university) =>
//                 fetch("http://127.0.0.1:5000/api/insertUniversity", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ university: university }),
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error(`Failed to insert: ${response.status}`);
//                         }
//                         return response.json();
//                     })
//                     .then((data) => {
//                         console.log("University successfully inserted!!!", data);
//                         const { university_info, image } = data;
//                         setUniversityInfo([university_info]); // Set the university information
//                         setImageSrc(`data:image/png;base64,${image}`); // Set the image source
//                         return { university, university_info, image }; // Return the university and URL
//                     })
//                     .catch((error) => {
//                         console.error("Error inserting university:", error);
//                         return null; // Handle errors gracefully
//                     })
//             )
//         ).then((dataArray) => {
//             // Filter out any null responses due to errors
//             const validData = dataArray.filter((data) => data !== null);
//             setUniversityInput(""); // Clear the input field
//         });
//     };

//     // Handler for fetching topics
//     const handleFetchTopics = () => {
//         if (!topicInput.trim()) {
//             console.error("Input is empty");
//             return;
//         }
//         console.log("Topic Input:", topicInput);

//         // Process the input into an array of topics
//         const topicList = processInput(topicInput);

//         // Map over the topic list and fetch each one
//         Promise.all(
//             topicList.map((topic) =>
//                 fetch("http://127.0.0.1:5000/api/insertTopic", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ topic: topic }),
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error(`Failed to insert: ${response.status}`);
//                         }
//                         return response.json();
//                     })
//                     .then((data) => {
//                         console.log("Topic successfully inserted!!!", data);
//                         const { topic_info, image } = data;
//                         setTopicInfo([topic_info]); // Set the topic information
//                         setImageSrc(`data:image/png;base64,${image}`); // Set the image source
//                         return { topic, topic_info, image }; // Return the topic and URL
//                     })
//                     .catch((error) => {
//                         console.error("Error inserting topic:", error);
//                         return null; // Handle errors gracefully
//                     })
//             )
//         ).then((dataArray) => {
//             // Filter out any null responses due to errors
//             const validData = dataArray.filter((data) => data !== null);
//             setTopicInput(""); // Clear the input field
//         });
//     };

//     // Handler for fetching people
//     const handleFetchPeople = () => {
//         if (!peopleInput.trim()) {
//             console.error("Input is empty");
//             return;
//         }
//         console.log("People Input:", peopleInput);

//         // Process the input into an array of people
//         const peopleList = processInput(peopleInput);

//         // Map over the people list and fetch each one
//         Promise.all(
//             peopleList.map((person) =>
//                 fetch("http://127.0.0.1:5000/api/insertPeople", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ people: person }),
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error(`Failed to insert: ${response.status}`);
//                         }
//                         return response.json();
//                     })
//                     .then((data) => {
//                         console.log("People successfully inserted!!!", data);
//                         const { people_info, image } = data;
//                         setPeopleInfo([people_info]); // Set the people information
//                         setImageSrc(`data:image/png;base64,${image}`); // Set the image source
//                         return { person, people_info, image }; // Return the person and URL
//                     })
//                     .catch((error) => {
//                         console.error("Error inserting people:", error);
//                         return null; // Handle errors gracefully
//                     })
//             )
//         ).then((dataArray) => {
//             // Filter out any null responses due to errors
//             const validData = dataArray.filter((data) => data !== null);
//             setPeopleInput(""); // Clear the input field
//         });
//     };

//     // Handler for fetching work
//     const handleFetchWork = () => {
//         if (!workInput.trim()) {
//             console.error("Input is empty");
//             return;
//         }
//         console.log("Work Input:", workInput);

//         // Process the input into an array of works
//         const workList = processInput(workInput);

//         // Map over the work list and fetch each one
//         Promise.all(
//             workList.map((work) =>
//                 fetch("http://127.0.0.1:5000/api/insertWork", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ work: work }),
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error(`Failed to insert: ${response.status}`);
//                         }
//                         return response.json();
//                     })
//                     .then((data) => {
//                         console.log("Work successfully inserted!!!", data);
//                         const { work_info, image } = data;
//                         setWorkInfo([work_info]); // Set the work information
//                         setImageSrc(`data:image/png;base64,${image}`); // Set the image source
//                         return { work, work_info, image }; // Return the work and URL
//                     })
//                     .catch((error) => {
//                         console.error("Error inserting work:", error);
//                         return null; // Handle errors gracefully
//                     })
//             )
//         ).then((dataArray) => {
//             // Filter out any null responses due to errors
//             const validData = dataArray.filter((data) => data !== null);
//             setWorkInput(""); // Clear the input field
//         });
//     };

//     return (
//         <div className="board-page">
//             {/* Main Content */}
//             <div className="board-content">
//                 <div className="board-area">
//                     <div className="info-board">
//                         {/* Render University Cards */}
//                         {universityInfo.length > 0 ? (
//                             universityInfo.map((university) => makeUniversityCard(university))
//                         ) : (
//                             <p>No university information to display</p>
//                         )}

//                         {/* Render Topic Cards */}
//                         {topicInfo.length > 0 ? (
//                             topicInfo.map((topic) => makeTopicCard(topic))
//                         ) : (
//                             <p>No topic information to display</p>
//                         )}

//                         {/* Render People Cards */}
//                         {peopleInfo.length > 0 ? (
//                             peopleInfo.map((people) => makePeopleCard(people))
//                         ) : (
//                             <p>No people information to display</p>
//                         )}

//                         {/* Render Work Cards */}
//                         {workInfo.length > 0 ? (
//                             workInfo.map((work) => makeWorkCard(work))
//                         ) : (
//                             <p>No work information to display</p>
//                         )}

//                         {/* Render the image if imageSrc is set */}
//                         {imageSrc && <img src={imageSrc} alt="University Graph" />}
//                     </div>
//                 </div>
//                 {/* Insert Options Section */}
//                 <div className="insert-options">
//                     <h2>Add Content</h2>
//                     {/* Universities */}
//                     <div className="insert-option">
//                         <textarea
//                             placeholder="Insert universities here, separated by (;)"
//                             className="option-input"
//                             value={universityInput}
//                             onChange={(e) => setUniversityInput(e.target.value)}
//                         />
//                         <button onClick={handleFetchUniversities}>Insert Universities</button>
//                     </div>

//                     {/* Topics */}
//                     <div className="insert-option">
//                         <textarea
//                             placeholder="Insert topics here, separated by (;)"
//                             className="option-input"
//                             value={topicInput}
//                             onChange={(e) => setTopicInput(e.target.value)}
//                         />
//                         <button onClick={handleFetchTopics}>Insert Topics</button>
//                     </div>

//                     {/* People */}
//                     <div className="insert-option">
//                         <textarea
//                             placeholder="Insert people here, separated by (;)"
//                             className="option-input"
//                             value={peopleInput}
//                             onChange={(e) => setPeopleInput(e.target.value)}
//                         />
//                         <button onClick={handleFetchPeople}>Insert People</button>
//                     </div>

//                     {/* Work */}
//                     <div className="insert-option">
//                         <textarea
//                             placeholder="Insert works here, separated by (;)"
//                             className="option-input"
//                             value={workInput}
//                             onChange={(e) => setWorkInput(e.target.value)}
//                         />
//                         <button onClick={handleFetchWork}>Insert Works</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Board;

import React, { useState } from "react";
import "./Board.css"; // Include a CSS file for styling
import graph_holder from "./img/graph_holder.png";

// Function to process input into an array
function processInput(inputString) {
    let elements = inputString.split(";");
    elements = elements.map(element => element.trim());
    return elements;
}

// Function to create a university card
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

// Function to create a topic card
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
            <div>
                <span className="card-rowname">Total Popularity:</span> {topic.total_popularity} {/* Display the new key */}
            </div>
        </div>
    );
}

// Function to create a people card
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

// Function to create a work card
function makeWorkCard(work) {
    return (
        <div className="card" key={work.work_id}>
            <div className="card-header">Work</div>
            <div className="card-title">{work.title}</div>
            <div>
                <span className="card-rowname">ID:</span> {work.work_id}
            </div>
            <div>
                <span className="card-rowname">Publication Year:</span> {work.publication_year}
            </div>
        </div>
    );
}

const Board = () => {
    // State variables for board creation and inputs
    const [universityInput, setUniversityInput] = useState("");
    const [topicInput, setTopicInput] = useState("");
    const [peopleInput, setPeopleInput] = useState("");
    const [workInput, setWorkInput] = useState("");

    // State variables for fetched data (now arrays)
    const [universityInfo, setUniversityInfo] = useState([]);
    const [topicInfo, setTopicInfo] = useState([]);
    const [peopleInfo, setPeopleInfo] = useState([]);
    const [workInfo, setWorkInfo] = useState([]);
    const [imageSrc, setImageSrc] = useState(""); // State variable for image source

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
                        console.log("University successfully inserted!!!", data);
                        const { university_info, image } = data;
                        setUniversityInfo(prevInfo => [...prevInfo, university_info]); // Append the university information
                        setImageSrc(`data:image/png;base64,${image}`); // Set the image source
                        return { university, university_info, image }; // Return the university and URL
                    })
                    .catch((error) => {
                        console.error("Error inserting university:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
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
                        console.log("Topic successfully inserted!!!", data);
                        const { topic_info, image } = data;
                        setTopicInfo(prevInfo => [...prevInfo, topic_info]); // Append the topic information
                        setImageSrc(`data:image/png;base64,${image}`); // Set the image source
                        return { topic, topic_info, image }; // Return the topic and URL
                    })
                    .catch((error) => {
                        console.error("Error inserting topic:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
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
                        console.log("People successfully inserted!!!", data);
                        const { people_info, image } = data;
                        setPeopleInfo(prevInfo => [...prevInfo, people_info]); // Append the people information
                        setImageSrc(`data:image/png;base64,${image}`); // Set the image source
                        return { person, people_info, image }; // Return the person and URL
                    })
                    .catch((error) => {
                        console.error("Error inserting people:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
            setPeopleInput(""); // Clear the input field
        });
    };

    // Handler for fetching work
    const handleFetchWork = () => {
        if (!workInput.trim()) {
            console.error("Input is empty");
            return;
        }
        console.log("Work Input:", workInput);

        // Process the input into an array of works
        const workList = processInput(workInput);

        // Map over the work list and fetch each one
        Promise.all(
            workList.map((work) =>
                fetch("http://127.0.0.1:5000/api/insertWork", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ work: work }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to insert: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Work successfully inserted!!!", data);
                        const { work_info, image } = data;
                        setWorkInfo(prevInfo => [...prevInfo, work_info]); // Append the work information
                        setImageSrc(`data:image/png;base64,${image}`); // Set the image source
                        return { work, work_info, image }; // Return the work and URL
                    })
                    .catch((error) => {
                        console.error("Error inserting work:", error);
                        return null; // Handle errors gracefully
                    })
            )
        ).then((dataArray) => {
            // Filter out any null responses due to errors
            const validData = dataArray.filter((data) => data !== null);
            setWorkInput(""); // Clear the input field
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

                        {/* Render Work Cards */}
                        {workInfo.length > 0 ? (
                            workInfo.map((work) => makeWorkCard(work))
                        ) : (
                            <p>No work information to display</p>
                        )}

                        {/* Render the image if imageSrc is set */}
                        {imageSrc && <img src={imageSrc} alt="University Graph" />}
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

                    {/* Work */}
                    <div className="insert-option">
                        <textarea
                            placeholder="Insert works here, separated by (;)"
                            className="option-input"
                            value={workInput}
                            onChange={(e) => setWorkInput(e.target.value)}
                        />
                        <button onClick={handleFetchWork}>Insert Works</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;
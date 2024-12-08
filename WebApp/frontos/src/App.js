import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import About from "./pages/About";
import Board from "./pages/Board";
import Home from "./pages/Home";
import Music from "./pages/Music";
import EditData from "./pages/EditData";
import Statistics from "./pages/Statistics";

const App = () => {
  return (
    <Router>
      <Banner />
      <div style={{ marginTop: "100px", padding: "0px", position: "relative"}}> {/* Offset for fixed banner */}
        <Routes>
            <Route path="/" element={<Home />} />  
          <Route path="/about" element={<About />} />
          <Route path="/board" element={<Board />} />
          <Route path="/music" element={<Music />} />
          <Route path="/edit-data" element={<EditData />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;



// How to call the backend
// function App() {
//   const [authors, setAuthors] = useState([]);

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/authors')
//         .then(response => response.json())
//         .then(data => setAuthors(data))
//         .catch(error => console.error('Error fetching data:', error));
//   }, []);
//   return (
//     <div>
//       <Banner />
//       {/* Other components */}
//     </div>
//   );
//   return (
//     <div>
//         <h1>Authors:</h1>
//         {authors.length > 0 ? (
//             <ul>
//                 {(() => {
//                     const items = [];
//                     for (let i = 0; i < authors.length; i++) {
//                         items.push(
//                             <li key={i}>
//                                 {authors[i].name} 
//                                   (
//                                     ID: {authors[i].author_id}
//                                     Name: {authors[i].author_name}
//                                     Uni Name: {authors[i].university_name}
//                                   )
//                             </li>
//                         );
//                     }
//                     return items;
//                 })()}
//             </ul>
//         ) : (
//             <p>Loading...</p>
//         )}
//     </div>
// );
// }

// export default App;




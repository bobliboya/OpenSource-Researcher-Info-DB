import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/authors')
        .then(response => response.json())
        .then(data => setAuthors(data))
        .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
        <h1>Authors:</h1>
        {authors.length > 0 ? (
            <ul>
                {(() => {
                    const items = [];
                    for (let i = 0; i < authors.length; i++) {
                        items.push(
                            <li key={i}>
                                {authors[i].name} 
                                  (
                                    ID: {authors[i].author_id}
                                    Name: {authors[i].author_name}
                                    Uni Name: {authors[i].university_name}
                                  )
                            </li>
                        );
                    }
                    return items;
                })()}
            </ul>
        ) : (
            <p>Loading...</p>
        )}
    </div>
);
}

export default App;

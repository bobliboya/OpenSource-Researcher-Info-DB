// import './App.css';
import React, { useEffect, useState } from 'react';


function GetAllAuthors() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/authors')
        .then(response => response.json())
        .then(data => setAuthors(data))
        .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container">
        <hi className="page-header text-center">Group 096 Opensource Project</hi>
        <hi className="page-header text-center">Below is a table of authors.</hi>
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>UniName</th>
          </tr>
        </thead>
        <tbody>
          {authors.length > 0 ? (
            authors.map((row) => (
              <tr key={row.id}>
                <td>{row.author_id}</td>
                <td>{row.author_name}</td>
                <td>{row.university_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Loading
              </td>
            </tr>
          )}
        </tbody>
        </table>
    </div>
);
}

export default GetAllAuthors;
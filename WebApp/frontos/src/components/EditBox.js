// this file was written by chatGPT
import React, { useState, useEffect } from 'react';

const EditableFields = ({ data, onSave }) => {
  const [showSaveStatus, setShowSaveStatus] = useState([]);
  const [saveStatus, setSaveStatus] = useState([]);
  const [workData, setWorkData] = useState({
    id: '',
    title: '',
    publication_year: '',
    authors: '',
    topics: '',
  });

  useEffect(() => {
    if (data) {
      setWorkData({
        id: data.id || '',
        title: data.title || '',
        publication_year: data.publication_year || '',
        authors: data.authors.map((author) => author.author_name).join(', ') || '',
        topics: data.topics.map((topic) => topic.topic_name).join(', ') || '',
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setWorkData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Prepare data for the PUT request
    const updatedData = {
      work_id: workData.id,
      title: workData.title,
      publication_year: workData.publication_year,
      authors: workData.authors.split(',').map((author) => author.trim()),
      topics: workData.topics.split(',').map((topic) => topic.trim()),
    };

    fetch('http://127.0.0.1:5000/api/UpdateWorkInfo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          setSaveStatus("Error updating data. Please use valid OpenAlex authors and topics.");
          throw new Error(`Failed to update data: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log('Successfully updated:', responseData);
        setSaveStatus("Successfully updated");
        onSave(updatedData); // Update the parent state if needed
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setSaveStatus("Error updating data. Please use valid OpenAlex authors and topics.");
      });
      setShowSaveStatus(true);
  };

  return (
    <div style={{ width: '100%', padding: '20px', border: '1px solid #ddd', marginBottom: '20px' }}>
      <h4>Edit Work (ID: {workData.id})</h4>
      
      {/* Title */}
      <div style={{ marginBottom: '10px' }}>
        <label>Title:</label>
        <input
          type="text"
          value={workData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Publication Year */}
      <div style={{ marginBottom: '10px' }}>
        <label>Publication Year:</label>
        <input
          type="text"
          value={workData.publication_year}
          onChange={(e) => handleChange('publication_year', e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Authors */}
      <div style={{ marginBottom: '10px' }}>
        <label>Authors:</label>
        <input
          type="text"
          value={workData.authors}
          onChange={(e) => handleChange('authors', e.target.value)}
          placeholder="Separate authors with commas"
          style={{ width: '100%' }}
        />
      </div>

      {/* Topics */}
      <div style={{ marginBottom: '10px'}}>
        <label>Topics:</label>
        <input
          type="text"
          value={workData.topics}
          onChange={(e) => handleChange('topics', e.target.value)}
          placeholder="Separate topics with commas"
          style={{ width: '100%' }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{ padding: '10px 30px', marginRight: '10px', backgroundColor: '#4CAF50', color: 'white' }}
      >
        Save
      </button>
      {showSaveStatus ? saveStatus : ""}
      
    </div>
  );
};

export default EditableFields;

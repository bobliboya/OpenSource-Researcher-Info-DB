import React, { useState, useEffect } from 'react';
// this file was written by chatGPT
const EditBox = ({ data, onSave }) => {
  const [workData, setWorkData] = useState({
    title: '',
    publication_year: '',
    authors: [],
    topics: [],
  });

  useEffect(() => {
    if (data) {
      setWorkData({
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
    // Convert authors and topics back into arrays of objects before saving
    const updatedData = {
      ...workData,
      authors: workData.authors.split(',').map((author) => ({ author_name: author.trim() })),
      topics: workData.topics.split(',').map((topic) => ({ topic_name: topic.trim() })),
    };

    onSave(updatedData);
  };

  return (
    <div style={{ width: '100%', padding: '20px', border: '1px solid #ddd', marginBottom: '20px' }}>
      <h4>Edit Work</h4>
      
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
      <div style={{ marginBottom: '10px' }}>
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
        style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}
      >
        Save
      </button>
    </div>
  );
};

export default EditBox;

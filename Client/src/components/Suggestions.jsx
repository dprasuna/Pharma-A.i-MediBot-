import React, { useState } from 'react';
import './Suggestions.css';
import Loader from './Loader';
import axios from 'axios';

const commonMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Omeprazole"
];

function Suggestions({ onSuggestionClick }) {
  const [loadingSuggestion, setLoadingSuggestion] = useState(null);

  const handleSubmit = async (medicine) => {
    setLoadingSuggestion(medicine);
    try {
      const response = await axios.post('https://ai-pharma-dfcp.vercel.app/generate', { medicineName: medicine });
      const generatedContent = response.data.content;
      onSuggestionClick(medicine);
  
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(
            'https://ai-pharma-dfcp.vercel.app/generate/save',
            { medicineName: medicine, content: generatedContent },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
        }
      }
    } catch (error) {
      console.error('Error fetching generated content:', error);
    } finally {
      setLoadingSuggestion(null);
    }
  };

  return (
    <>
      <div className="suggestions">
        {commonMedicines.map((medicine, index) => (
          <button
            key={index}
            onClick={() => handleSubmit(medicine)}
            className="suggestion-button"
            disabled={loadingSuggestion === medicine}
          >
            {medicine}
          </button>
        ))}
      </div>
      <Loader loading={loadingSuggestion !== null} />
    </>
  );
}

export default Suggestions;

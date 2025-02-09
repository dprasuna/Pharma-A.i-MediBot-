import React from 'react';
import './Loader.css';

function Loader({ loading }) {
  if (!loading) return null;

  return (
    <div className="loader">
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
    </div>
  );
}

export default Loader;
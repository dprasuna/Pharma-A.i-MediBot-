import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; 
import Loader from '../components/Loader'; 
import { MdHealthAndSafety } from "react-icons/md";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post('https://ai-pharma-dfcp.vercel.app/auth/signup', { username, password });
      console.log(response.data); 
      setLoading(false); 
      navigate('/login');
    } catch (error) {
      console.error('Failed to signup', error);
      setLoading(false); 
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        {loading && <Loader loading={loading} />} {/* Show loader */}
        {!loading && (
          <>
            <div className="logo_name"><MdHealthAndSafety className='logo-icon' />MediBot</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Signup</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import Loader from '../components/Loader';
import { MdHealthAndSafety } from "react-icons/md";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);  
    try {
      await login(username, password);
      setLoading(false); 
      navigate('/');
    } catch (error) {
      console.error('Failed to login', error);
      setError('Invalid username or password');
      setLoading(false); 
    }
  };

  return (
    
    <div className="login-container">
      
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {loading && <Loader loading={loading} />} {}
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
            <button type="submit">Login</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCogs } from 'react-icons/fa';
import { MdHealthAndSafety } from "react-icons/md";

import { MdMenu } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ savedContent, isOpen, onItemClick, selectedItem }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    onItemClick(item);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-details">
          <MdHealthAndSafety className='logo-icon' />
          <div className="logo_name">MediBot</div>
        </div>
      </div>
      {user ? (
        <div className="user-content">
          <div className="saved-content">
            <h2>Your Saved Content</h2>
            {savedContent.length === 0 ? (
              <p>No saved content to display.</p>
            ) : (
              <div className="content-list">
                {savedContent.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                  <div
                    key={index}
                    className={`content-item ${selectedItem === item ? 'selected' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="content-title">{item.medicineName}</div>
                    <div className="content-date">{new Date(item.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="sidebar-login-signup">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}
      {user && (
        <div className="sidebar-footer">
          <div className="footer-content">
            <FaUser id="profile-icon" />
            <span className="username">{user.username}</span>
            <FaSignOutAlt id="footer-logout" onClick={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

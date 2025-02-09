import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import InputForm from '../components/InputForm';
import GeneratedContent from '../components/GeneratedContent';
import ThemeSelector from '../components/ThemeSelector';
import Suggestions from '../components/Suggestions';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader'; 
import './Home.css';

const themes = {
  clinical: {
    bgColor: '#f5f8f9',  
    fontColor: '#2c3e50',  
    hlColor: '#3498db',  
    fgColor: '#ffffff'   
  },
  professional: {
    bgColor: '#ffffff',  
    fontColor: '#333333',  
    hlColor: '#4caf50',  
    fgColor: '#f2f2f2'  
  },
  mkbhd: {
    bgColor: '#000',
    fontColor: '#fff',
    hlColor: '#4caf50',
    fgColor: '#333'
  },  
  health: {
    bgColor: '#e9f5f7',  
    fontColor: '#2c3e50',  
    hlColor: '#1abc9c',  
    fgColor: '#ffffff'   
  },
  serenity: {
    bgColor: '#d6e4f0',  
    fontColor: '#364f6b',  
    hlColor: '#f6b352',  
    fgColor: '#f9f9f9'   
  },
  moch:{
    bgColor: '#f2e6d8',
        fontColor: '#3b2925',
        hlColor: '#c19875',
        fgColor: '#f2e6d8'
      },
  tranquility: {
    bgColor: '#fefae0',  
    fontColor: '#7e5a2f',  
    hlColor: '#c9cba3',  
    fgColor: '#d6d6c2'   
  },
  rose_milk: {
    bgColor: '#fce4ec',
    fontColor: '#333',
    hlColor: '#f48fb1',
    fgColor: '#fff0f6'
  },
};

const Home = () => {
  const [generatedContent, setGeneratedContent] = useState([]);
  const [savedContent, setSavedContent] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const [currentInput, setCurrentInput] = useState('');
  const [promptLogin, setPromptLogin] = useState(false);

  const fetchSavedContent = async () => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ai-pharma-dfcp.vercel.app/savedContent', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSavedContent(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error('Error fetching saved content:', error);
      }
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, [user]);

  const changeTheme = (themeName) => {
    setSelectedTheme(themeName);
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.bgColor);
    document.documentElement.style.setProperty('--font-color', theme.fontColor);
    document.documentElement.style.setProperty('--hl-color', theme.hlColor);
    document.documentElement.style.setProperty('--fg-color', theme.fgColor);
  };

  const handleGenerateContent = async (content) => {
    setLoading(true); // Start loader
    setCurrentInput(content);

    try {
      const response = await axios.post(
        'https://ai-pharma-dfcp.vercel.app/generate',
        { medicineName: content }
      );
      const generatedContent = response.data.content;

      const newContent = [
        { type: 'ai', content: generatedContent, medicineName: content }
      ];

      setTimeout(() => {
        setGeneratedContent(newContent);
        setShowSuggestions(false);
        setSelectedSidebarItem(null);
        setLoading(false);

        if (user) {
          const token = localStorage.getItem('token');
          if (token) {
            axios.post(
              'https://ai-pharma-dfcp.vercel.app/generate/save',
              { medicineName: content, content: generatedContent },
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchSavedContent();
          }
        } else {
          setPromptLogin(true);
        }
      }, 1000); 

    } catch (error) {
      console.error('Error generating or saving content:', error);
      setLoading(false); 
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
    setCurrentInput(item.medicineName);
    setGeneratedContent([
      { type: 'ai', content: item.content, medicineName: item.medicineName }
    ]);
    setShowSuggestions(false);
  };

  return (
    <div className="app">
      <Sidebar
        savedContent={savedContent}
        user={user}
        onLogout={logout}
        onLoginClick={() => navigate('/login')}
        onSignUpClick={() => navigate('/signup')}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onItemClick={handleSidebarItemClick}
        selectedItem={selectedSidebarItem}
      />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <ThemeSelector themes={themes} changeTheme={changeTheme} />
        <div className="app-content">
          {loading && <Loader loading={loading} />} {}
          {!loading && showSuggestions && (
            <div className="welcome-container">
              <h1>Welcome to AI Pharma</h1>
              <p>Choose a medicine or search for one below:</p>
            </div>
          )}
          {!loading && currentInput && (
            <div className="current-input">
              <h2>Current Input: {currentInput}</h2>
            </div>
          )}
          {!loading && <GeneratedContent generatedContent={generatedContent} />}
          {!loading && showSuggestions && <Suggestions onSuggestionClick={handleGenerateContent} />}
          {!loading && <InputForm setGeneratedContent={handleGenerateContent} />}
          {!loading && promptLogin && (
            <div className="login-prompt">
              <p>To save your content, please <button onClick={() => navigate('/login')}>log in</button> or <button onClick={() => navigate('/signup')}>sign up</button>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

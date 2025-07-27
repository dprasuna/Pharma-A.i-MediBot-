// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="app">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onload = () => {
          window.googleTranslateElementInit();
        };
        document.body.appendChild(script);
      } else {
        window.googleTranslateElementInit();
      }
    };

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );

      // "Powered by Google" text remove karne ke liye
      setTimeout(() => {
        const poweredByGoogle = document.querySelector(".goog-te-gadget span");
        if (poweredByGoogle) poweredByGoogle.style.display = "none";
      }, 1000);
    };

    loadGoogleTranslate();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {/* Google Translate Widget - Left Side pe Move Kiya */}
          <div id="google_translate_element" className="translate-widget"></div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

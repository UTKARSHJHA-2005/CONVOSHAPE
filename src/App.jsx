import React, { useState, useEffect } from 'react';
// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Authentication
import { app } from './db'; // Firebase App
import {Atom} from 'react-loading-indicators' // Loader
import { Userstore } from './usestore';
import './index.css'
const auth = getAuth(app); // Auth
function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Opening page should be login
  const { currentUser, isLoading, fetchUserInfo } = Userstore();
  // If User info changes then it should go to chat page.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid); 
        setCurrentPage('chat'); 
      } else {
        fetchUserInfo(null);
        setCurrentPage('login'); 
      }
    });
    return () => unsub(); 
  }, [fetchUserInfo]);
  // Loading screen
  if (isLoading) return <div className='h-screen flex items-center justify-center'><Atom color="black" size="large"/></div> 
  return (
    // Chat page should after login.
    <div>
      {currentUser == null ? (
        <>
          {currentPage === 'login' && (
            <Login onNavigateToSignup={() => setCurrentPage('signup')} />
          )}
          {currentPage === 'signup' && (
            <Signup onNavigateToLogin={() => setCurrentPage('login')} />
          )}
        </>
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;

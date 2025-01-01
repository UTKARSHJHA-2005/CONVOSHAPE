import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './db';
import {Atom} from 'react-loading-indicators'
import { Userstore } from './usestore';
import './index.css'
const auth = getAuth(app);
function App() {
  const [currentPage, setCurrentPage] = useState('login'); 
  const { currentUser, isLoading, fetchUserInfo } = Userstore();
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
  if (isLoading) return <div className='h-screen flex items-center justify-center'><Atom color="black" size="large"/></div>
  return (
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
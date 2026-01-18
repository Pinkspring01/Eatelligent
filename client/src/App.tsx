import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import './App.css';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5050/auth/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5050/auth/logout', {
      credentials: 'include'
    })
      .then(() => {
        setUser(null);
        window.location.href = '/';
      });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍽️ Eatelligent Dashboard</h1>
        <div className="user-info">
          {user.picture && (
            <img 
              src={user.picture} 
              alt={user.name || 'User'} 
              className="user-avatar"
            />
          )}
          <span>Welcome, {user.name || user.email}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <h2>Your Ingredients</h2>
        <p>Ingredient management coming soon...</p>
      </main>
    </div>
  );
}

export default App;
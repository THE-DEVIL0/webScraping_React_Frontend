import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7); // Default 7-day trial
  const navigate = useNavigate();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const trialStart = localStorage.getItem('trialStart');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Calculate trial days left
      if (trialStart) {
        const trialStartDate = new Date(parseInt(trialStart));
        const today = new Date();
        const daysLeft = 7 - Math.floor((today - trialStartDate) / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, daysLeft));
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set trial start date if not already set
    if (!localStorage.getItem('trialStart')) {
      localStorage.setItem('trialStart', Date.now().toString());
      setTrialDaysLeft(7);
    }
    
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Don't remove trialStart to persist trial period
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, trialDaysLeft, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;

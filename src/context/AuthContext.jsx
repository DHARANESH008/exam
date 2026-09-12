import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usersList, setUsersList] = useState(MOCK_USERS);
  
  // Unauthenticated by default until user logs in via LoginPage or selects a demo user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smart_exam_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null; // Start on LoginPage!
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smart_exam_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smart_exam_user');
    }
  }, [currentUser]);

  const addUser = (newUser) => {
    const formatted = {
      id: `usr_${Date.now()}`,
      username: newUser.username || newUser.rollNo || `user_${Date.now()}`,
      name: newUser.name,
      rollNo: newUser.rollNo || '',
      email: newUser.email || `${newUser.rollNo || 'user'}@college.edu`,
      role: newUser.role || 'STUDENT',
      department: newUser.department || 'CSE',
      batch: newUser.batch || '2021-2025 (3rd Year)',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    setUsersList(prev => [formatted, ...prev]);
    return formatted;
  };

  const switchRole = (userId) => {
    const target = usersList.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const login = (inputQuery) => {
    if (!inputQuery) return { success: false, message: 'Please enter a username or roll number.' };
    
    const query = inputQuery.trim().toLowerCase();
    const found = usersList.find(u => 
      u.username.toLowerCase() === query || 
      (u.rollNo && u.rollNo.toLowerCase() === query) ||
      u.id.toLowerCase() === query ||
      u.role.toLowerCase() === query
    );
    
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    
    // Fallback: match by role prefix or default
    return { success: false, message: 'User not found. Try student1, faculty1, hod1, or admin1' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smart_exam_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, login, logout, allUsers: usersList, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

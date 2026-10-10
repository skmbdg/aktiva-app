import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '../data/initialAssets';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Saved active role in localStorage or default to Admin
  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('aktiva_current_role');
    return saved ? JSON.parse(saved) : USER_ROLES[0];
  });

  const [currentUser, setCurrentUser] = useState({
    name: 'Mukinaryo (Super Admin)',
    email: 'admin@perusahaan.co.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  });

  useEffect(() => {
    localStorage.setItem('aktiva_current_role', JSON.stringify(currentRole));
  }, [currentRole]);

  const switchRole = (roleId) => {
    const found = USER_ROLES.find(r => r.id === roleId);
    if (found) {
      setCurrentRole(found);
      if (roleId === 'admin') {
        setCurrentUser({
          name: 'Mukinaryo (Super Admin)',
          email: 'admin@perusahaan.co.id',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        });
      } else if (roleId === 'auditor') {
        setCurrentUser({
          name: 'Agus Pratama (Auditor Opname)',
          email: 'agus.auditor@perusahaan.co.id',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
        });
      } else {
        setCurrentUser({
          name: 'Budi Santoso (Lead Dev)',
          email: 'budi.dev@perusahaan.co.id',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
        });
      }
    }
  };

  const hasPermission = (permission) => {
    if (currentRole.permissions.includes('all')) return true;
    return currentRole.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ currentRole, currentUser, switchRole, hasPermission, USER_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

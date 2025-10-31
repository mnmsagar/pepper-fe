import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

// Dummy user data with roles array
const DUMMY_USERS: { [key: string]: User } = {
  'admin@peppermint.in': {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'admin@peppermint.in',
    name: 'Admin User',
    phone: '+91-9876543210',
    roles: [
      { role: 'admin', userId: '550e8400-e29b-41d4-a716-446655440000' }
    ],
    createdAt: new Date('2024-01-01')
  },
  'partner@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'partner@example.com',
    name: 'Partner User',
    phone: '+91-9876543211',
    roles: [
      { role: 'partner', userId: '550e8400-e29b-41d4-a716-446655440001' }
    ],
    createdAt: new Date('2024-01-01')
  },
  'member@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'member@example.com',
    name: 'member User',
    phone: '+91-9876543212',
    roles: [
      { role: 'member', userId: '550e8400-e29b-41d4-a716-446655440002' }
    ],
    createdAt: new Date('2024-01-01')
  }
};

interface AuthContextType {
  user: User | null;
  activeRole: string | null;
  currentUserRole: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveRole: (role: string) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Compute current user role based on active role
  const currentUserRole: UserRole | null = user && activeRole 
    ? user.roles.find(role => role.role === activeRole) || null
    : null;

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkStoredAuth = () => {
      console.log('🔍 Checking stored authentication...');
      
      try {
        const storedUser = localStorage.getItem('pepperloyal_user');
        const storedActiveRole = localStorage.getItem('pepperloyal_active_role');
        
        if (storedUser && storedActiveRole) {
          const userData = JSON.parse(storedUser);
          const activeRoleData = JSON.parse(storedActiveRole);
          
          console.log('✅ Found stored auth:', { user: userData.email, activeRole: activeRoleData });
          setUser(userData);
          setActiveRoleState(activeRoleData);
        } else {
          console.log('❌ No stored authentication found');
        }
      } catch (error) {
        console.error('❌ Error checking stored auth:', error);
        // Clear corrupted data
        localStorage.removeItem('pepperloyal_user');
        localStorage.removeItem('pepperloyal_active_role');
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading time
    setTimeout(checkStoredAuth, 500);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Starting dummy login process for:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check dummy credentials
      const dummyUser = DUMMY_USERS[email as keyof typeof DUMMY_USERS];
      
      if (!dummyUser || password !== 'password123') {
        console.log('❌ Invalid credentials');
        return false;
      }
      
      console.log('✅ Dummy authentication successful for:', email);
      
      // Get user data with roles
      const userData = dummyUser;
      const defaultRole = userData.roles[0].role;
      
      // Store in localStorage for persistence
      localStorage.setItem('pepperloyal_user', JSON.stringify(userData));
      localStorage.setItem('pepperloyal_active_role', JSON.stringify(defaultRole));
      
      // Set state
      setUser(userData);
      setActiveRoleState(defaultRole);
      
      console.log('🎯 User state set:', { user: userData.email, activeRole: defaultRole });
      console.log('✅ Login process completed successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Starting logout process...');
      
      // Clear localStorage
      localStorage.removeItem('pepperloyal_user');
      localStorage.removeItem('pepperloyal_active_role');
      
      // Clear state
      setUser(null);
      setActiveRoleState(null);
      
      console.log('✅ Logout completed');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const setActiveRole = (role: string) => {
    if (user && user.roles.some(r => r.role === role)) {
      setActiveRoleState(role);
      localStorage.setItem('pepperloyal_active_role', JSON.stringify(role));
      console.log('🔄 Active role changed to:', role);
    }
  };

  const value: AuthContextType = {
    user,
    activeRole,
    currentUserRole,
    login,
    logout,
    setActiveRole,
    isAuthenticated: !!user && !!activeRole,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Define the user roles
export type UserRole = 'admin' | 'baseCommander' | 'logisticsOfficer';

// Define the user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  baseId?: string; // Only relevant for baseCommander and logisticsOfficer
  email: string;
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (action: string, resourceType: string, resourceId?: string) => boolean;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@military.gov',
  },
  {
    id: '2',
    name: 'Base Commander Alpha',
    role: 'baseCommander',
    baseId: 'b1', // Alpha Base
    email: 'commander@military.gov',
  },
  {
    id: '3',
    name: 'Logistics Officer',
    role: 'logisticsOfficer',
    baseId: 'b1', // Alpha Base
    email: 'logistics@military.gov',
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, this would verify credentials against a backend)
      const foundUser = mockUsers.find((u) => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: "Welcome back",
          description: `Logged in as ${foundUser.name} (${foundUser.role})`,
        });
        return;
      } else {
        throw new Error("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Permission check function
  const hasPermission = (action: string, resourceType: string, resourceId?: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Base Commander has full access to their base
    if (user.role === 'baseCommander') {
      // If resource is base-specific, check if it's the commander's base
      if (resourceId && resourceType === 'base' && resourceId !== user.baseId) {
        return false;
      }
      
      // Base commander can do everything in their base
      return true;
    }
    
    // Logistics Officer has limited access
    if (user.role === 'logisticsOfficer') {
      // Logistics officers can only view and add purchases/transfers
      const allowedActions = ['view', 'add'];
      const allowedResources = ['purchase', 'transfer', 'inventory'];
      
      if (!allowedActions.includes(action)) return false;
      if (!allowedResources.includes(resourceType)) return false;
      
      // If resource is base-specific, check if it's the officer's base
      if (resourceId && resourceType === 'base' && resourceId !== user.baseId) {
        return false;
      }
      
      return true;
    }
    
    // Default: no permission
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    location: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
          setLoading(false);
          return;
        }        
        // Configure axios to use the token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Fetch user data
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/auth/me`
        );
        
        // Check if response.data has user object directly or nested in data property
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else if (response.data && response.data.data && response.data.data.user) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        // Check if it's a status 401 Unauthorized, which means the token is invalid
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Only clear tokens when there's a genuine authentication error
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
        } else {
          // For other errors, log but don't automatically clear tokens
          console.error("Auth validation error (not clearing tokens):", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}/auth/login`,
        {
          email,
          password,
        }
      );
      
      if (!response.data || !response.data.data) {
        throw new Error("Invalid login response format");
      }
      
      const { accessToken, refreshToken, userId } = response.data.data;
      
      if (!accessToken || !refreshToken || !userId) {
        throw new Error("Missing required authentication tokens");
      }

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);

      // Set auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Fetch user details
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/auth/user/${userId}`
        );
        
        console.log('User details response:', userResponse.data);
        
        if (userResponse.data.success && userResponse.data.data && userResponse.data.data.user) {
          setUser(userResponse.data.data.user);
          console.log('User set after login:', userResponse.data.data.user);
        } else {
          console.error("Failed to fetch user details:", userResponse.data);
          throw new Error("Failed to fetch user details");
        }
      } catch (userError) {
        console.error("Error fetching user details:", userError);
        // Still continue with the login process but log the error
      }

      router.push("/account");
    } catch (error) {
      console.error("Login failed:", error);
      
      // Clean up any partial auth state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    location: string
  ) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_PUBLIC}/auth/register`,
        {
          name,
          email,
          password,
          location,
        }
      );

      // After registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    
    // First clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    
    // Clear auth headers
    delete axios.defaults.headers.common["Authorization"];
    
    // Clear user state last
    setUser(null);
    
    console.log('Logout complete, redirecting to login');
    // Use a slight delay to ensure state is properly cleared before redirect
    setTimeout(() => {
      router.push("/login");
    }, 100);
  };

  // Add a helper function to check if we have valid tokens
  const hasValidTokens = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem("accessToken");
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user || hasValidTokens(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

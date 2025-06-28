import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Validate token and auto-logout if invalid
  const validateToken = async (token: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Token invalid");
      }
      
      return true;
    } catch (error) {
      console.log("Token validation failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("cosmic-auth-token");
    const storedUser = localStorage.getItem("cosmic-auth-user");
    
    if (storedToken && storedUser) {
      // Validate token before setting state
      validateToken(storedToken).then((isValid) => {
        if (isValid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Auto-logout if token is invalid
          localStorage.removeItem("cosmic-auth-token");
          localStorage.removeItem("cosmic-auth-user");
        }
      });
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("cosmic-auth-token", newToken);
    localStorage.setItem("cosmic-auth-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cosmic-auth-token");
    localStorage.removeItem("cosmic-auth-user");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

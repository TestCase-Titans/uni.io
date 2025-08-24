import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import apiClient from "../utils/api";
import { LoadingScreen } from "../components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<User>;
  logout: () => Promise<void>;
}

export type UserRole = "student" | "clubAdmin" | "sysAdmin";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<User> => {
    // Change return type to Promise<User>
    try {
      const userData = {
        email,
        password,
        rememberMe,
      };

      const response = await apiClient.post("/auth/login", userData);
      setUser(response.data.user); // Set user state on successful login
      return response.data.user;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);

      toast.warn(error.response?.data?.message || "An error occured", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.get("/auth/logout");
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // This function checks if a valid cookie session exists on the server
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Create an endpoint on your backend that returns the user if they have a valid session
      const response = await apiClient.get("/auth/status");
      setUser(response.data.user);
    } catch (error) {
      // If the request fails (e.g., 401 Unauthorized), it means no valid session
      setUser(null);
    } finally {
      setIsLoading(false); // Stop loading once the check is complete
    }
  };

  // Run the auth status check when the provider is first mounted
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = { user, isLoading, login, logout };

  // Render a loading screen while checking auth, so the app doesn't flicker
  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import apiClient from "../utils/api";
import { LoadingScreen } from "../components/LoadingScreen";
import { toast } from "react-toastify";

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  username: string;
  isSysAdmin: boolean | 0 | 1; // Handle both boolean and number
  clubAdminStatus: "never_applied" | "pending" | "accepted" | "rejected";
  img_url?: string;
}

export interface User extends BackendUser {
  role: UserRole;
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

const processUser = (backendUser: BackendUser): User | null => {
  let role: UserRole;

  if (backendUser.isSysAdmin) {
    role = "sysAdmin";
  } else if (backendUser.clubAdminStatus === "accepted") {
    role = "clubAdmin";
  } else if (backendUser.clubAdminStatus === "never_applied") {
    role = "student";
  } else {
    // Users with 'pending' or 'rejected' status will not get a valid user object
    return null;
  }

  return { ...backendUser, role };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<User> => {
    try {
      const userData = {
        email,
        password,
        rememberMe,
      };

      const response = await apiClient.post("/auth/login", userData);
      const backendUser: BackendUser = response.data.user;

      // console.log("Backend user data on LOGIN:", backendUser);

      if (backendUser.clubAdminStatus === "pending") {
        throw new Error("Your club admin application is pending approval.");
      }

      if (backendUser.clubAdminStatus === "rejected") {
        throw new Error("Your club admin application has been rejected.");
      }

      const processedUser = processUser(backendUser);

      if (!processedUser) {
        throw new Error("Could not determine user role. Access denied.");
      }

      setUser(processedUser);

      return processedUser;
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
      const backendUser: BackendUser = response.data.user;

      // console.log("Backend user data on REFRESH:", backendUser);

      const processedUser = processUser(backendUser);

      //console.log("Processed user on REFRESH:", processedUser);

      setUser(processedUser);
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

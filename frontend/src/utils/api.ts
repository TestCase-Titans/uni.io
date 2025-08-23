// API configuration and types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "student" | "admin";
  };
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// API base configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw {
      message: errorData.message || `HTTP error! status: ${response.status}`,
      status: response.status,
    } as ApiError;
  }

  return response.json();
}

// Authentication API functions
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return handleResponse<AuthResponse>(response);
  },

  // Register new user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return handleResponse<AuthResponse>(response);
  },

  // Logout user (if you have a logout endpoint)
  async logout(): Promise<void> {
    const token = localStorage.getItem("Uni.io-token");
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Logout endpoint might not exist, just clear local storage
      console.log("Logout endpoint not available, clearing local storage");
    }
  },

  // Validate token (optional - for checking if user is still authenticated)
  async validateToken(): Promise<{ user: AuthResponse["user"] }> {
    const token = localStorage.getItem("Uni.io-token");
    if (!token) {
      throw { message: "No token found", status: 401 } as ApiError;
    }

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse<{ user: AuthResponse["user"] }>(response);
  },
};

// Mock API for development (fallback when no backend is available)
export const mockAuthApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw {
        message: "Email and password are required",
        status: 400,
      } as ApiError;
    }

    // Mock user data based on email
    const mockUser = {
      id: Date.now().toString(),
      name: credentials.email.includes("admin") ? "Admin User" : "Student User",
      email: credentials.email,
      role: credentials.email.includes("admin")
        ? "admin"
        : ("student" as const),
    };

    return {
      user: mockUser,
      token: `mock-token-${Date.now()}`,
    };
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!userData.name || !userData.email || !userData.password) {
      throw { message: "All fields are required", status: 400 } as ApiError;
    }

    if (userData.password.length < 6) {
      throw {
        message: "Password must be at least 6 characters",
        status: 400,
      } as ApiError;
    }

    const mockUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    return {
      user: mockUser,
      token: `mock-token-${Date.now()}`,
    };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  async validateToken(): Promise<{ user: AuthResponse["user"] }> {
    const storedUser = localStorage.getItem("Uni.io-user");
    if (!storedUser) {
      throw { message: "No user found", status: 401 } as ApiError;
    }

    return { user: JSON.parse(storedUser) };
  },
};

// Export the appropriate API based on environment
export const api =
  import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL
    ? mockAuthApi
    : authApi;

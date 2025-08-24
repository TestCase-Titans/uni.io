import React, { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Navigation } from "./components/Navigation";
import { LoadingScreen } from "./components/LoadingScreen";
import { PageRouter } from "./components/PageRouter";
import Chatbot from "./components/Chatbot";
import GeminiTest from "./components/GeminiTest";
import {
  getNavigationTarget,
  getDefaultDashboard,
  shouldRedirectAfterAuth,
} from "./utils/navigation";
import { NO_NAVIGATION_PAGES } from "./utils/router";
import { ToastContainer, toast } from "react-toastify";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const { user, isLoading } = useAuth();

  const handleNavigation = (page: string) => {
    const targetPage = getNavigationTarget(page, user);
    setCurrentPage(targetPage);
  };

  // Auto-redirect after login based on role
  useEffect(() => {
    if (user && shouldRedirectAfterAuth(currentPage)) {
      const dashboard = getDefaultDashboard(user.role);
      setCurrentPage(dashboard);
    }
  }, [user, currentPage]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const shouldShowNavigation = !NO_NAVIGATION_PAGES.includes(
    currentPage as any
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {shouldShowNavigation && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigation} />
      )}
      <main>
        <PageRouter currentPage={currentPage} onNavigate={handleNavigation} />
      </main>
      <ToastContainer />
      <Toaster />
      <Chatbot />
      {/* Uncomment the line below to test the Gemini API key */}
      {/* <GeminiTest /> */}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="Uni.io-ui-theme">
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

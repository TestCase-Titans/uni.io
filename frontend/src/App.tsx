import { Toaster } from "./components/ui/sonner";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Navigation } from "./components/Navigation";
import { AppRoutes } from "./AppRoutes.tsx";
import { ToastContainer } from "react-toastify";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="Uni.io-ui-theme">
      <AuthProvider>
        <DataProvider>
          <Navigation />
          <main>
            <AppRoutes />
          </main>
          <ToastContainer />
          {/* <Toaster /> */}
          <Chatbot />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
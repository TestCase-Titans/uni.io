import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Navigation } from "./components/Navigation";
import { AppRoutes } from "./AppRoutes.tsx";
import { ToastContainer } from "react-toastify";

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
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

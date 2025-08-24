import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { EventsPage } from "./components/EventsPage";
import { EventDetailsPage } from "./components/EventDetailsPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { EventFormPage } from "./components/EventFormPage";
import { CertificatesPage } from "./components/CertificatesPage";
import { SettingsPage } from "./components/SettingsPage";
import AutoCertificateGenerator from "./pages/AutoCertificateGenerator";
import { useAuth, UserRole } from "./contexts/AuthContext";
import { LoadingScreen } from "./components/LoadingScreen";

// A component to protect routes that require authentication
const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles: UserRole[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role as UserRole)) {
    // Redirect to a relevant page if the role doesn't match
    return (
      <Navigate
        to={user.role === "student" ? "/student-dashboard" : "/admin-dashboard"}
      />
    );
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:eventId" element={<EventDetailsPage />} />

      {/* Student-only Routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute roles={["student"]}>
            <CertificatesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute roles={["clubAdmin", "sysAdmin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute roles={["clubAdmin", "sysAdmin"]}>
            <EventFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-event/:eventId"
        element={
          <ProtectedRoute roles={["clubAdmin", "sysAdmin"]}>
            <EventFormPage />
          </ProtectedRoute>
        }
      />

      {/* Routes for all authenticated users */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute roles={["student", "clubAdmin", "sysAdmin"]}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Auto Certificate Generator - assuming it can be accessed directly for demo purposes */}
      <Route
        path="/auto-certificate-generator"
        element={
          <AutoCertificateGenerator
            participant={{ id: "U-0001", name: "Demo User" }}
            event={{
              id: "EVT-2025-UNI",
              title: "University Event",
              venue: "Main Campus",
              dateText: new Date().toLocaleDateString(),
            }}
            org={{ name: "University", code: "UNI" }}
            certificateId={`UNI-${Date.now()}`}
            verifyUrl="https://example.com/verify"
            fileName="Certificate.pdf"
          />
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

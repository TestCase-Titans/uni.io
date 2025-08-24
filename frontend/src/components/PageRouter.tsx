import React from "react";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { EventsPage } from "./EventsPage";
import { EventDetailsPage } from "./EventDetailsPage";
import { StudentDashboard } from "./StudentDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { EventFormPage } from "./EventFormPage";
import { CertificatesPage } from "./CertificatesPage";
import { SettingsPage } from "./SettingsPage";
import {
  ROUTES,
  isEventDetailsPage,
  isEditEventPage,
  extractEventId,
} from "../utils/router";
import AutoCertificateGenerator from "../pages/AutoCertificateGenerator";
import { useNavigate } from "react-router-dom";

interface PageRouterProps {
  currentPage: string;
}

export function PageRouter({ currentPage }: PageRouterProps) {
  const navigate = useNavigate();
  // Handle event details pages
  if (isEventDetailsPage(currentPage)) {
    const eventId = extractEventId(currentPage);
    return <EventDetailsPage eventId={eventId} />;
  }

  // Handle edit event pages
  if (isEditEventPage(currentPage)) {
    const eventId = extractEventId(currentPage);
    return <EventFormPage eventId={eventId} />;
  }

  switch (currentPage) {
    case ROUTES.HOME:
      return <HomePage />;
    case ROUTES.LOGIN:
      return <LoginPage />;
    case ROUTES.SIGNUP:
      return <SignupPage />;
    case ROUTES.EVENTS:
      return <EventsPage />;
    case ROUTES.STUDENT_DASHBOARD:
      return <StudentDashboard />;
    case ROUTES.ADMIN_DASHBOARD:
      return <AdminDashboard />;
    case ROUTES.CREATE_EVENT:
      return <EventFormPage />;
    case ROUTES.CERTIFICATES:
      return <CertificatesPage />;
    case ROUTES.SETTINGS:
      return <SettingsPage />;
    case ROUTES.AUTO_CERTIFICATE_GENERATOR:
      return (
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
      );
    default:
      return <HomePage />;
  }
}

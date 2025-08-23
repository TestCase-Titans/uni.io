import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage' 
import { SignupPage } from './SignupPage'
import { EventsPage } from './EventsPage'
import { EventDetailsPage } from './EventDetailsPage'
import { StudentDashboard } from './StudentDashboard'
import { AdminDashboard } from './AdminDashboard'
import { EventFormPage } from './EventFormPage'
import { CertificatesPage } from './CertificatesPage'
import { SettingsPage } from './SettingsPage'
import { ROUTES, isEventDetailsPage, isEditEventPage, extractEventId } from '../utils/router'

interface PageRouterProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function PageRouter({ currentPage, onNavigate }: PageRouterProps) {
  // Handle event details pages
  if (isEventDetailsPage(currentPage)) {
    const eventId = extractEventId(currentPage)
    return <EventDetailsPage eventId={eventId} onNavigate={onNavigate} />
  }

  // Handle edit event pages
  if (isEditEventPage(currentPage)) {
    const eventId = extractEventId(currentPage)
    return <EventFormPage eventId={eventId} onNavigate={onNavigate} />
  }

  switch (currentPage) {
    case ROUTES.HOME:
      return <HomePage onNavigate={onNavigate} />
    case ROUTES.LOGIN:
      return <LoginPage onNavigate={onNavigate} />
    case ROUTES.SIGNUP:
      return <SignupPage onNavigate={onNavigate} />
    case ROUTES.EVENTS:
      return <EventsPage onNavigate={onNavigate} />
    case ROUTES.STUDENT_DASHBOARD:
      return <StudentDashboard onNavigate={onNavigate} />
    case ROUTES.ADMIN_DASHBOARD:
      return <AdminDashboard onNavigate={onNavigate} />
    case ROUTES.CREATE_EVENT:
      return <EventFormPage onNavigate={onNavigate} />
    case ROUTES.CERTIFICATES:
      return <CertificatesPage onNavigate={onNavigate} />
    case ROUTES.SETTINGS:
      return <SettingsPage onNavigate={onNavigate} />
    default:
      return <HomePage onNavigate={onNavigate} />
  }
}
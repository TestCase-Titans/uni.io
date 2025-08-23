export const ROUTES = {
  HOME: "home",
  LOGIN: "login",
  SIGNUP: "signup",
  EVENTS: "events",
  STUDENT_DASHBOARD: "student-dashboard",
  ADMIN_DASHBOARD: "admin-dashboard",
  CREATE_EVENT: "create-event",
  CERTIFICATES: "certificates",
  SETTINGS: "settings",
} as const;

export const PROTECTED_PAGES = [
  ROUTES.STUDENT_DASHBOARD,
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.CREATE_EVENT,
  ROUTES.CERTIFICATES,
  ROUTES.SETTINGS,
];

export const ADMIN_ONLY_PAGES = [ROUTES.ADMIN_DASHBOARD, ROUTES.CREATE_EVENT];

export const STUDENT_ONLY_PAGES = [
  ROUTES.STUDENT_DASHBOARD,
  ROUTES.CERTIFICATES,
];

export const NO_NAVIGATION_PAGES = [ROUTES.LOGIN, ROUTES.SIGNUP];

export const isEventDetailsPage = (page: string): boolean => {
  return page.startsWith("event-");
};

export const isEditEventPage = (page: string): boolean => {
  return page.startsWith("edit-event-");
};

export const extractEventId = (page: string): string => {
  if (isEventDetailsPage(page)) {
    return page.replace("event-", "");
  }
  if (isEditEventPage(page)) {
    return page.replace("edit-event-", "");
  }
  return "";
};

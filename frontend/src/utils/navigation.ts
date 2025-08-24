import {
  ROUTES,
  PROTECTED_PAGES,
  ADMIN_ONLY_PAGES,
  STUDENT_ONLY_PAGES,
} from "./router";
import type { User } from "../contexts/AuthContext";

export const getNavigationTarget = (
  page: string,
  user: User | null
): string => {
  // check if page requires authentication
  if (PROTECTED_PAGES.includes(page as any) && !user) {
    return ROUTES.LOGIN;
  }

  // check role-specific pages
  if (
    ADMIN_ONLY_PAGES.includes(page as any) &&
    user?.role !== "clubAdmin" &&
    user?.role !== "sysAdmin"
  ) {
    return ROUTES.HOME;
  }

  if (STUDENT_ONLY_PAGES.includes(page as any) && user?.role !== "student") {
    return ROUTES.HOME;
  }

  return page;
};

export const getDefaultDashboard = (userRole: string): string => {
  return userRole === "student"
    ? ROUTES.STUDENT_DASHBOARD
    : ROUTES.ADMIN_DASHBOARD;
};

export const shouldRedirectAfterAuth = (currentPage: string): boolean => {
  return currentPage === ROUTES.LOGIN || currentPage === ROUTES.SIGNUP;
};

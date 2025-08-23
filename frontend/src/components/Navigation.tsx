import React, { useState } from "react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X, Zap } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface NavigationProps {
  onNavigate: (page: string) => void
  currentPage: string
}

export function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { id: "home", label: "Home", show: true },
    { id: "events", label: "Events", show: true },
    { id: "student-dashboard", label: "Dashboard", show: user?.role === "student" },
    { id: "admin-dashboard", label: "Dashboard", show: user?.role === "admin" },
  ].filter((item) => item.show)

  const handleNavigation = (page: string) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    onNavigate("home")
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <span className="redis-heading-sm text-xl font-bold text-foreground">
              Uni.io
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-300
                  ${
                    currentPage === item.id
                      ? "bg-destructive text-white"
                      : "text-muted-foreground hover:bg-destructive hover:text-white"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-bold">{user.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {user.role}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="redis-button border-2 hover:border-destructive hover:bg-destructive hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation("login")}
                  className="redis-button hover:bg-destructive hover:text-white"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNavigation("signup")}
                  className="redis-button bg-destructive hover:bg-destructive/90"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50 bg-background/95 backdrop-blur-xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-200
                  ${
                    currentPage === item.id
                      ? "bg-destructive text-white"
                      : "text-muted-foreground hover:bg-destructive hover:text-white"
                  }`}
              >
                {item.label}
              </button>
            ))}

            <div className="px-4 pt-4 border-t border-border/50">
              {user ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {user.role}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full redis-button border-2 hover:bg-destructive hover:text-white"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation("login")}
                    className="w-full redis-button hover:bg-destructive hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleNavigation("signup")}
                    className="w-full redis-button bg-destructive hover:bg-destructive/90 text-white"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

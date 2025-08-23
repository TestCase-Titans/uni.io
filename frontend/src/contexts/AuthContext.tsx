'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, type ApiError } from '../utils/api'

export type UserRole = 'student' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user and token on mount
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('Uni.io-user')
        const storedToken = localStorage.getItem('Uni.io-token')
        
        if (storedUser && storedToken) {
          // Try to validate the token
          try {
            const { user: validatedUser } = await api.validateToken()
            setUser(validatedUser)
          } catch (error) {
            // Token is invalid, clear storage
            console.log('Invalid token, clearing storage')
            localStorage.removeItem('Uni.io-user')
            localStorage.removeItem('Uni.io-token')
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await api.login({ email, password })
      
      // Store user and token
      setUser(response.user)
      localStorage.setItem('Uni.io-user', JSON.stringify(response.user))
      localStorage.setItem('Uni.io-token', response.token)
      
      return { success: true }
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.message || 'Login failed. Please try again.'
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await api.signup({ name, email, password, role })
      
      // Store user and token
      setUser(response.user)
      localStorage.setItem('Uni.io-user', JSON.stringify(response.user))
      localStorage.setItem('Uni.io-token', response.token)
      
      return { success: true }
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.message || 'Signup failed. Please try again.'
      
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Always clear local storage
      setUser(null)
      localStorage.removeItem('Uni.io-user')
      localStorage.removeItem('Uni.io-token')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
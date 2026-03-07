"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tokenUtils, User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = tokenUtils.getToken()
    const savedUser = tokenUtils.getUser()

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      
      setUser(response.user)
      setToken(response.token)
      
      tokenUtils.setToken(response.token)
      tokenUtils.setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data)
      
      setUser(response.user)
      setToken(response.token)
      
      tokenUtils.setToken(response.token)
      tokenUtils.setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    tokenUtils.logout()
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    tokenUtils.setUser(userData)
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
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

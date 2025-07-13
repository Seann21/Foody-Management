"use client"

import { useState, useEffect } from "react"
import type { User, AuthState } from "../types"

const STATIC_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    fullName: "Administrator",
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    fullName: "Regular User",
  },
]

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedAuth = localStorage.getItem("auth")
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth)
          if (parsed.user && parsed.isAuthenticated) {
            setAuthState(parsed)
          }
        }
      } catch (error) {
        console.error("Error loading auth from localStorage:", error)
        localStorage.removeItem("auth")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (username: string, password: string): boolean => {
    const user = STATIC_USERS.find((u) => u.username === username && u.password === password)
    if (user) {
      const newAuthState = { isAuthenticated: true, user }
      setAuthState(newAuthState)
      localStorage.setItem("auth", JSON.stringify(newAuthState))
      return true
    }
    return false
  }

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null })
    localStorage.removeItem("auth")
  }

  const updateUser = (updatedUser: User) => {
    const newAuthState = { isAuthenticated: true, user: updatedUser }
    setAuthState(newAuthState)
    localStorage.setItem("auth", JSON.stringify(newAuthState))
  }

  return {
    ...authState,
    isLoading,
    login,
    logout,
    updateUser,
  }
}

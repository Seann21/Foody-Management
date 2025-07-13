"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useTheme } from "../hooks/useTheme"
import { Link, useNavigate } from "react-router-dom"
import type { ThemeMode } from "../types"

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const themeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
    setIsDropdownOpen(false)
  }

  const handleThemeChange = (newTheme: ThemeMode) => {
    console.log("Theme button clicked:", newTheme)
    setTheme(newTheme)
    setIsThemeDropdownOpen(false)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return "☀️"
      case "dark":
        return "🌙"
      default:
        return "💻"
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "System"
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🥐</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-500 dark:to-indigo-500">Foodyy</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/foods"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Food
            </Link>

            {/* Theme Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span>{getThemeIcon()}</span>
                <span className="hidden sm:inline">{getThemeLabel()}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-600">
                  <div className="py-1">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                        theme === "light"
                          ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">☀️</span>
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                        theme === "dark"
                          ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">🌙</span>
                      Dark
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                        theme === "system"
                          ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">💻</span>
                      System
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user?.fullName}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-600">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

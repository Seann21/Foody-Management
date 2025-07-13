"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { useTheme } from "./hooks/useTheme"
import { Navbar } from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { FoodList } from "./pages/FoodList"
import { FoodForm } from "./pages/FoodForm"
import { Profile } from "./pages/Profile"

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  useTheme() // Initialize theme

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🍽️</span>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading FoodManager...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/foods"
            element={
              <ProtectedRoute>
                <FoodList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/foods/create"
            element={
              <ProtectedRoute>
                <FoodForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/foods/edit/:id"
            element={
              <ProtectedRoute>
                <FoodForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export const Profile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(user?.fullName || "")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!fullName.trim()) {
      setError("Full name is required")
      return
    }

    if (!user) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const updatedUser = {
        ...user,
        fullName: fullName.trim(),
      }

      updateUser(updatedUser)
      setSuccess(true)

  
      setTimeout(() => {
        navigate("/")
      }, 2000)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        <p className="mt-2 text-indigo-600 dark:text-gray-400">Update your personal information</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6">
          {/* Profile Avatar */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm">
                Profile updated successfully! Redirecting wait...
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={user.username}
                disabled
                className="w-full px-3 py-2 border rounded-xl border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-red-500 dark:text-gray-400">Username cannot be changed</p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  error && !fullName.trim()
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex-1 bg-indigo-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import type { ThemeMode } from "../types"

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>("system")

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Default to system if no saved theme
      setTheme("system")
    }
  }, [])

  // Apply theme whenever it changes
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement

      // Remove existing theme classes
      root.classList.remove("dark")

      if (theme === "dark") {
        root.classList.add("dark")
      } else if (theme === "light") {
        // Light mode - ensure dark class is removed
        root.classList.remove("dark")
      } else if (theme === "system") {
        // System mode - check OS preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (systemPrefersDark) {
          root.classList.add("dark")
        }
      }

      console.log("Theme applied:", theme, "Dark class present:", root.classList.contains("dark"))
    }

    applyTheme()
    localStorage.setItem("theme", theme)

    // Listen for system theme changes only if theme is "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleSystemThemeChange = () => {
        applyTheme()
      }

      mediaQuery.addEventListener("change", handleSystemThemeChange)
      return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [theme])

  const changeTheme = (newTheme: ThemeMode) => {
    console.log("Changing theme to:", newTheme)
    setTheme(newTheme)
  }

  return { theme, setTheme: changeTheme }
}

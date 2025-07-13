export interface User {
  id: string
  username: string
  fullName: string
  password: string
}

export interface Food {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export interface FoodFilters {
  search: string
  category: string
  page: number
  limit: number
}

export type ThemeMode = "light" | "dark" | "system"

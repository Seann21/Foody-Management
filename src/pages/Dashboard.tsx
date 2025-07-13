"use client"

import { useFood } from "../hooks/useFood"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"

export const Dashboard = () => {
  const { foods, getCategories } = useFood()
  const { user } = useAuth()
  const categories = getCategories()

  const stats = {
    totalFoods: foods.length,
    totalCategories: categories.length,
    averagePrice: foods.length > 0 ? Math.round(foods.reduce((sum, food) => sum + food.price, 0) / foods.length) : 0,
    recentFoods: foods.slice(-3).reverse(),
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.fullName}! 👋</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Easy and efficient food manager.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🍽️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Food total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalFoods}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Avg. Price</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Rp {stats.averagePrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Status</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Foods */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Foods</h2>
            <Link
              to="/foods"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {stats.recentFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentFoods.map((food) => (
                <div
                  key={food.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={food.image || "/placeholder.svg"}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{food.category}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    Rp {food.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">🍴</span>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No foods added yet</p>
              <Link
                to="/foods/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Add Your First Food
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Manage Foods</h3>
          <p className="text-blue-100 mb-4">Add, edit, or delete food items from your inventory</p>
          <Link
            to="/foods"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
          >
            Go to Foods
          </Link>
        </div>

        <div className="bg-gradient-to-r from-cyan-700 to-pink-500 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 ">Add New Food</h3>
          <p className="text-green-100 mb-4">Quickly add a new food item to your inventory</p>
          <Link
            to="/foods/create"
            className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
          >
            Add Food
          </Link>
        </div>
      </div>
    </div>
  )
}

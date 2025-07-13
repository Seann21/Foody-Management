"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useFood } from "../hooks/useFood"
import type { FoodFilters } from "../types"
import { Pagination } from "../components/Pagination"

export const FoodList = () => {
  const { getFilteredFoods, getCategories, deleteFood } = useFood()
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = getCategories()

  const [filters, setFilters] = useState<FoodFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: 6,
  })

  const { foods, total, totalPages } = getFilteredFoods(filters)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.category !== "all") params.set("category", filters.category)
    if (filters.page > 1) params.set("page", filters.page.toString())

    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (key: keyof FoodFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : Number(value), 
    }))
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteFood(id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Food Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your food inventory ({total} items)</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/foods/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 "
            >
              <span className="mr-2">+</span>
              Add New Food
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Foods
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Food Grid */}
      {foods.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img src={food.image || "/placeholder.svg"} alt={food.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{food.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {food.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Rp {food.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-5 space-x-4">
                    <Link
                      to={`/foods/edit/${food.id}`}
                      className="flex-1 bg-indigo-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-xl text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(food.id, food.name)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange("page", page)}
          />
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-12 text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No foods found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.search || filters.category !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first food item."}
          </p>
          {!filters.search && filters.category === "all" && (
            <Link
              to="/foods/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add Your First Food
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

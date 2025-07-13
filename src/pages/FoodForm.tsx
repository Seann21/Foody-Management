"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFood } from "../hooks/useFood"

export const FoodForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addFood, updateFood, getFoodById, isFoodsLoaded } = useFood() 
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isEdit && id && isFoodsLoaded) {
      const food = getFoodById(id)
      if (food) {
        setFormData({
          name: food.name,
          category: food.category,
          price: food.price.toString(),
          description: food.description,
          image: food.image,
        })
      } else {
        console.warn(`Food with ID ${id} not found. Redirecting to /foods.`)
        navigate("/foods", { replace: true })
      }
    } else if (isEdit && id && !isFoodsLoaded) {
      console.log("FoodForm: Waiting for foods data to load...")
    }
  }, [isEdit, id, getFoodById, isFoodsLoaded, navigate]) 

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Food name is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number"
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const foodData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        image: formData.image.trim(),
      }

      if (isEdit && id) {
        updateFood(id, foodData)
      } else {
        addFood(foodData)
      }

      navigate("/foods")
    } catch (error) {
      console.error("Error saving food:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const categories = [
    "Indonesian",
    "Italian",
    "American",
    "Japanese",
    "Thai",
    "Chinese",
    "Other",
  ]

  // Tampilkan loading state jika ini mode edit dan data belum dimuat
  if (isEdit && id && !isFoodsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading food data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Food" : "Add New Food"}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 bg-gradient-to-r from-blue-500 to-red-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-500 dark:to-indigo-500">
          {isEdit ? "Update the food information below." : "Fill in the details to add a new food item."}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.name ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter food name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.category ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.price ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter price"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.image ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="https://example.com/image.jpg or use /placeholder.svg?height=200&width=300"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.description ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter food description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-indigo-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-xl font-medium transition-colors"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Food" : "Add Food"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/foods")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

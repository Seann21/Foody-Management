"use client"

import { useState, useEffect, useCallback } from "react"
import type { Food, FoodFilters } from "../types"

const INITIAL_FOODS: Food[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    category: "Indonesian",
    price: 25000,
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
    image: "https://cdn1-production-images-kly.akamaized.net/LDRjBxjUH3gyrzEAUFrCi_XisTs=/0x148:1920x1230/800x450/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3093328/original/069244600_1585909700-fried-2509089_1920.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Spaghetti Carbonara",
    category: "Italian",
    price: 45000,
    description: "Pasta dengan saus krim, bacon, dan keju parmesan",
    image: "https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-mediumSquareAt3X-v2.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Burger Beef Deluxe",
    category: "American",
    price: 35000,
    description: "Burger daging sapi dengan keju, lettuce, dan tomat",
    image: "https://asset.kompas.com/crops/zbmx5CMyQLbONPHVHv3Ip4Ax9lg=/12x51:892x637/1200x800/data/photo/2022/03/05/622358ed771fb.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Sushi Salmon Roll",
    category: "Japanese",
    price: 55000,
    description: "Sushi roll dengan salmon segar dan nori",
    image: "https://www.tiger-corporation.com/wp-content/uploads/2023/02/hero-img-recipe-salmon-roll-22a44bc8993e779162aa80766bda8751.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Tom Yum Goong",
    category: "Thai",
    price: 40000,
    description: "Sup pedas asam dengan udang dan jamur",
    image: "https://hot-thai-kitchen.com/wp-content/uploads/2013/03/tom-yum-goong-blog.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([])
  const [isFoodsLoaded, setIsFoodsLoaded] = useState(false) 

  useEffect(() => {
    const loadFoods = () => {
      const savedFoods = localStorage.getItem("foods")
      if (savedFoods) {
        try {
          setFoods(JSON.parse(savedFoods))
        } catch (error) {
          console.error("Error parsing foods from localStorage, resetting:", error)
          setFoods(INITIAL_FOODS)
          localStorage.setItem("foods", JSON.stringify(INITIAL_FOODS))
        }
      } else {
        setFoods(INITIAL_FOODS)
        localStorage.setItem("foods", JSON.stringify(INITIAL_FOODS))
      }
      setIsFoodsLoaded(true) 
    }
    loadFoods()
  }, [])

  const saveToStorage = useCallback((updatedFoods: Food[]) => {
    setFoods(updatedFoods)
    localStorage.setItem("foods", JSON.stringify(updatedFoods))
  }, [])

  const addFood = useCallback(
    (food: Omit<Food, "id" | "createdAt" | "updatedAt">) => {
      const newFood: Food = {
        ...food,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updatedFoods = [...foods, newFood]
      saveToStorage(updatedFoods)
      return newFood
    },
    [foods, saveToStorage],
  )

  const updateFood = useCallback(
    (id: string, updates: Partial<Food>) => {
      const updatedFoods = foods.map((food) =>
        food.id === id ? { ...food, ...updates, updatedAt: new Date().toISOString() } : food,
      )
      saveToStorage(updatedFoods)
    },
    [foods, saveToStorage],
  )

  const deleteFood = useCallback(
    (id: string) => {
      const updatedFoods = foods.filter((food) => food.id !== id)
      saveToStorage(updatedFoods)
    },
    [foods, saveToStorage],
  )

  const getFoodById = useCallback(
    (id: string) => {
      return foods.find((food) => food.id === id)
    },
    [foods],
  )

  const getFilteredFoods = useCallback(
    (filters: FoodFilters) => {
      let filtered = foods

      if (filters.search) {
        filtered = filtered.filter(
          (food) =>
            food.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            food.description.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      if (filters.category && filters.category !== "all") {
        filtered = filtered.filter((food) => food.category === filters.category)
      }

      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit

      return {
        foods: filtered.slice(startIndex, endIndex),
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / filters.limit),
      }
    },
    [foods],
  )

  const getCategories = useCallback(() => {
    const categories = Array.from(new Set(foods.map((food) => food.category)))
    return categories
  }, [foods])

  return {
    foods,
    isFoodsLoaded, 
    addFood,
    updateFood,
    deleteFood,
    getFoodById,
    getFilteredFoods,
    getCategories,
  }
}

// Shared service for fetching and managing products
import type { Product } from "@/types/product"

// Fetch all products from the API
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products", {
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to fetch products: ${errorData.error || response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

// Fetch a single product by ID
export async function fetchProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to fetch product: ${errorData.error || response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    throw error
  }
}

// Add a product to the basket (localStorage)
export function addToBasket(product: Product, quantity = 1): void {
  // Get current basket from localStorage
  const basketJson = localStorage.getItem("basket")
  const basket = basketJson ? JSON.parse(basketJson) : []

  // Check if product already exists in basket
  const existingItemIndex = basket.findIndex((item: { product: Product }) => item.product.id === product.id)

  if (existingItemIndex > -1) {
    // Update quantity if product already exists
    basket[existingItemIndex].quantity += quantity
  } else {
    // Add new product to basket
    basket.push({ product, quantity })
  }

  // Save updated basket to localStorage
  localStorage.setItem("basket", JSON.stringify(basket))
}


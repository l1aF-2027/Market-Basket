"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/types/product";
import CheckoutForm from "@/components/CheckOutForm";
import { DeleteIcon } from "@/components/DeleteIcon";
import { RefreshIcon } from "@/components/RefreshIcon";
import { motion } from "framer-motion";
import ProductRecommendations from "@/components/ProductReccomendation";
import { fetchProducts } from "@/lib/product-service";

interface BasketProps {
  items: {
    product: Product;
    quantity: number;
  }[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromBasket: (productId: number) => void;
  clearBasket: () => void;
  setActiveTab: (tab: string) => void;
  addToBasket: (product: Product, quantity: number) => void;
}

export default function Basket({
  items,
  updateQuantity,
  removeFromBasket,
  clearBasket,
  setActiveTab,
  addToBasket,
}: BasketProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  // Add state to manage input values for each item
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  // Add state to track which inputs are focused
  const [focusedInputs, setFocusedInputs] = useState<Record<number, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  // Initialize input values when items change
  useEffect(() => {
    const newInputValues = { ...inputValues };

    items.forEach((item) => {
      // Only set value if not focused and not already set
      if (!focusedInputs[item.product.id]) {
        newInputValues[item.product.id] = item.quantity.toString();
      }
    });

    setInputValues(newInputValues);
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

useEffect(() => {
  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setAllProducts(products);

      if (items.length > 0) {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();
        if (data && Array.isArray(data)) {
          const recommended = data
            .map((name: string) => products.find((p) => p.name === name))
            .filter((p): p is Product => !!p)
            .filter((p) => !items.some((item) => item.product.id === p.id))
            .slice(0, 4);

          setRecommendedProducts(recommended);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      const response = await fetch("/api/top-products");
      if (!response.ok) throw new Error("Failed to fetch top products");

      const data = await response.json();
      setRecommendedProducts(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    loadTopProducts();
  } else {
    loadProducts();
  }
}, [items]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  // Function to handle image URLs safely
  const getImageUrl = (src: string) => {
    // Check if it's an external URL
    if (src.startsWith("http")) {
      return src;
    }
    // Otherwise use placeholder
    return src || "/placeholder.svg?height=80&width=80";
  };

  // Handle quantity input change
  const handleQuantityChange = (productId: number, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Handle input focus
  const handleFocus = (productId: number) => {
    // Mark this input as focused
    setFocusedInputs((prev) => ({
      ...prev,
      [productId]: true,
    }));

    // Clear the input
    setInputValues((prev) => ({
      ...prev,
      [productId]: "",
    }));
  };

  // Handle input blur
  const handleBlur = (productId: number) => {
    // Mark this input as not focused
    setFocusedInputs((prev) => ({
      ...prev,
      [productId]: false,
    }));

    const value = inputValues[productId];

    // If input is empty, revert to previous quantity
    if (value === "") {
      const item = items.find((item) => item.product.id === productId);
      if (item) {
        setInputValues((prev) => ({
          ...prev,
          [productId]: item.quantity.toString(),
        }));
      }
      return;
    }

    // Parse the numeric value
    const numValue = parseInt(value);

    // If it's 0, remove the product
    if (numValue === 0) {
      removeFromBasket(productId);
      return;
    }

    // If it's a valid number greater than 0, update quantity
    if (!isNaN(numValue) && numValue > 0) {
      updateQuantity(productId, numValue);
    } else {
      // If invalid, revert to previous quantity
      const item = items.find((item) => item.product.id === productId);
      if (item) {
        setInputValues((prev) => ({
          ...prev,
          [productId]: item.quantity.toString(),
        }));
      }
    }
  };

  // Handle pressing Enter key on input
  const handleKeyDown = (e: React.KeyboardEvent, productId: number) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Animation variants for containers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for card items
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 12,
      },
    },
  };

  // Animation variants for summary card
  const summaryVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  if (items.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Your basket is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some items from the menu to get started.
        </p>
        <Button
          variant="outline"
          onClick={() => setActiveTab("menu")}
          className="cursor-pointer"
        >
          Browse Menu
        </Button>

        {/* Thêm danh sách gợi ý sản phẩm */}
        <div className="mt-8 text-left">
          <ProductRecommendations
            basketItems={items}
            addToBasket={addToBasket}
            recommendedProducts={recommendedProducts}
          />
        </div>
      </motion.div>
    );
  }


if (isCheckingOut) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
    >
      <CheckoutForm
        items={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onCancel={() => setIsCheckingOut(false)}
        onComplete={() => {
          clearBasket();
          setActiveTab("menu");
        }}
      />
    </motion.div>
  );
}

  return (
    <div className="h-full flex flex-col">
      {/* Phần header cố định */}
      <motion.div
        className="sticky top-0 z-50 bg-background"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Basket</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={clearBasket}
            className="flex items-center gap-1"
          >
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Phần nội dung scrollable - container riêng */}
      <div className="flex-1 overflow-auto container mx-auto px-4 py-4">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div key={item.product.id} variants={cardVariants}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={
                            getImageUrl(item.product.image) ||
                            "/placeholder.svg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                          unoptimized={item.product.image.startsWith("http")}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} each
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-r-none cursor-pointer"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <input
                              type="number"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={
                                focusedInputs[item.product.id]
                                  ? inputValues[item.product.id] || ""
                                  : inputValues[item.product.id] ||
                                    item.quantity.toString()
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product.id,
                                  e.target.value
                                )
                              }
                              onFocus={() => handleFocus(item.product.id)}
                              onBlur={() => handleBlur(item.product.id)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, item.product.id)
                              }
                              className="h-7 w-12 border-y px-2 text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              aria-label="Quantity"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-l-none cursor-pointer"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromBasket(item.product.id)}
                            className="h-7 px-2 text-destructive"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="mt-4">
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="px-4 py-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
            <ProductRecommendations
              basketItems={items}
              addToBasket={addToBasket}
              recommendedProducts={recommendedProducts}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

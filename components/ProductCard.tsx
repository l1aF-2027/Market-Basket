"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/types/product";
import { CartIcon } from "@/components/ShoppingCart";

interface ProductCardProps {
  product: Product;
  addToBasket: (product: Product, quantity: number) => void;
}

export default function ProductCard({
  product,
  addToBasket,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const inputRef = useRef<HTMLInputElement>(null);

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Only update actual quantity if the value is a valid number
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
    } else if (value === "") {
      // Allow empty input but don't update quantity yet
      setQuantity(1);
    }
  };

  const handleFocus = () => {
    setInputValue("");
  };

  const handleBlur = () => {
    if (
      inputValue === "" ||
      isNaN(parseInt(inputValue)) ||
      parseInt(inputValue) <= 0
    ) {
      setInputValue("1");
      setQuantity(1);
    }
  };

  const handleAddToBasket = () => {
    addToBasket(product, quantity);
    setQuantity(1);
    setInputValue("1");
  };

  // Function to handle image URLs safely
  const getImageUrl = (src: string) => {
    // Check if it's an external URL
    if (src.startsWith("http")) {
      return src;
    }
    // Otherwise use placeholder
    return src || "/placeholder.svg?height=200&width=200";
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-40 w-full">
        <Image
          src={getImageUrl(product.image) || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized={product.image.startsWith("http")}
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span className="font-bold">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {product.description}
        </p>
        <div className="text-xs bg-muted inline-block px-2 py-1 rounded-full">
          {product.category}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none cursor-pointer"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleQuantityChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="h-8 w-12 border-y px-2 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none cursor-pointer"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToBasket} className="ml-2 cursor-pointer">
            <CartIcon className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

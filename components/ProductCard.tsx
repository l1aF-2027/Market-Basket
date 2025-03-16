"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  addToBasket: (product: Product, quantity: number) => void;
}

export default function ProductCard({
  product,
  addToBasket,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToBasket = () => {
    addToBasket(product, quantity);
    setQuantity(1); // Reset quantity after adding to basket
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
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={getImageUrl(product.image) || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized={product.image.startsWith("http")}
        />
      </div>
      <CardContent className="p-4">
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
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-8 px-3 flex items-center justify-center border-y">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddToBasket} className="ml-2">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from "react";
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
import { Trash, Plus, Minus, RefreshCw } from "lucide-react";
import type { Product } from "@/types/product";
import CheckoutForm from "@/components/CheckOutForm";

interface BasketProps {
  items: {
    product: Product;
    quantity: number;
  }[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromBasket: (productId: number) => void;
  clearBasket: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Basket({
  items,
  updateQuantity,
  removeFromBasket,
  clearBasket,
  setActiveTab,
}: BasketProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your basket is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some items from the menu to get started.
        </p>
        <Button variant="outline" onClick={() => setActiveTab("menu")}>
          Browse Menu
        </Button>
      </div>
    );
  }

  if (isCheckingOut) {
    return (
      <CheckoutForm
        items={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onCancel={() => setIsCheckingOut(false)}
        onComplete={clearBasket}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Phần header cố định */}
      <div className="sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Basket</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={clearBasket}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Phần nội dung scrollable - container riêng */}
      <div className="flex-1 overflow-auto container mx-auto px-4 py-4">
        <div className="space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={
                          getImageUrl(item.product.image) || "/placeholder.svg"
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
                            className="h-7 w-7 rounded-r-none"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-7 px-3 flex items-center justify-center text-sm border-y">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-l-none"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
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
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-4">
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
              <Button className="w-full" onClick={() => setIsCheckingOut(true)}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

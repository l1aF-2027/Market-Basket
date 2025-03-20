"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/ShoppingCart";
import type { Product } from "@/types/product";

interface ProductRecommendationsProps {
  basketItems: { product: Product; quantity: number }[];
  addToBasket: (product: Product, quantity: number) => void;
  recommendedProducts: Product[];
}

export default function ProductRecommendations({
  basketItems,
  addToBasket,
  recommendedProducts,
}: ProductRecommendationsProps) {
  if (recommendedProducts.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Suggested Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col border rounded-xl overflow-hidden"
            >
              <div className="h-32 bg-muted">
                <img
                  src={product.image || "/placeholder.svg?height=128&width=256"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder.svg?height=128&width=256";
                  }}
                />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-medium text-sm mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Button
                    size="sm"
                    onClick={() => addToBasket(product, 1)}
                    className="ml-2 cursor-pointer"
                  >
                    <CartIcon className="h-4 w-4 mr-2 p-6" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

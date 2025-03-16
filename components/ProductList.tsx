"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { fetchProducts } from "@/lib/product-service";
import { toast } from "sonner";

interface ProductListProps {
  addToBasket: (product: Product, quantity: number) => void;
}

export default function ProductList({ addToBasket }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories from products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Phần cố định - search + category */}
      <div className="sticky z-10 bg-background pt-2 pb-2 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="cursor-pointer shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Phần scrollable - danh sách sản phẩm */}
      <div className="flex-1 overflow-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              No products found. Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToBasket={addToBasket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Purchase {
  id: number;
  date: string;
  totalAmount: number;
  totalItems: number;
  products: Product[];
}

export default function RecentPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/recent-purchases");

        if (!response.ok) {
          throw new Error("Failed to fetch recent purchases");
        }

        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching recent purchases:", error);
        toast.error("Failed to load recent purchases");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPurchases();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Purchases</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[330px]  overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recent purchases to display
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Order #{purchase.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(purchase.date)}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    ${purchase.totalAmount.toFixed(2)}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Items: </span>
                  {purchase.totalItems}
                </div>
                <div className="mt-2 text-sm">
                  <div className="text-muted-foreground mb-1">Products:</div>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {purchase.products.map((product, idx) => (
                      <li key={idx} className="text-xs">
                        {product.name} × {product.quantity} ($
                        {(product.price * product.quantity).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

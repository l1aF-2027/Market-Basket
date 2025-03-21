"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailedStats {
  totalRevenue: number;
  totalItemsSold: number;
  totalOrders: number;
  averageOrderValue: number;
  topProductsByQuantity: {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
    price: number;
  }[];
  topProductsByRevenue: {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
    price: number;
  }[];
  productDistribution: {
    name: string;
    value: number;
  }[];
  categoryDistribution: {
    name: string;
    value: number;
  }[];
  highestRevenueDay: {
    date: string;
    totalRevenue: number;
    totalItems: number;
  } | null;
  mostItemsSoldDay: {
    date: string;
    totalRevenue: number;
    totalItems: number;
  } | null;
}

// Colors for pie charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

export default function Detail() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DetailedStats | null>(null);

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      setIsLoading(true);

      const startDateParam = startDate ? format(startDate, "yyyy-MM-dd") : "";
      const endDateParam = endDate ? format(endDate, "yyyy-MM-dd") : "";

      const response = await fetch(
        `/api/admin/detail?startDate=${startDateParam}&endDate=${endDateParam}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch detailed statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching detailed statistics:", error);
      toast.error("Failed to load detailed statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDateRange = () => {
    fetchDetailedStats();
  };

  // Custom tooltip formatter for pie charts
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            Quantity: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm">
            Percentage:{" "}
            <span className="font-medium">
              {(
                (payload[0].value / payload[0].payload.totalValue) *
                100
              ).toFixed(1)}
              %
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Prepare pie chart data with total value for percentage calculation
  const preparePieData = (data: { name: string; value: number }[]) => {
    if (!data || data.length === 0) return [];

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item) => ({
      ...item,
      totalValue,
    }));
  };
  const calculateAverages = (stats: DetailedStats) => {
    if (!stats.highestRevenueDay || !stats.mostItemsSoldDay)
      return { avgRevenue: 0, avgItems: 0 };

    const days =
      Math.ceil(
        (new Date(endDate!).getTime() - new Date(startDate!).getTime()) /
          (1000 * 3600 * 24)
      ) || 1;

    return {
      avgRevenue: stats.totalRevenue / days,
      avgItems: stats.totalItemsSold / days,
    };
  };

  return (
    <div className="flex flex-col">
      {/* Date Controls - Fixed height */}
      <div className="py-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start cursor-pointer"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start cursor-pointer"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleApplyDateRange}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Apply Date Range"
            )}
          </Button>
        </div>
      </div>

      {/* Fixed height container with scroll for dashboard content only */}
      <div className="mx-auto w-full ">
        <div className="h-[50vh] md:h-[60vh] lg:h-[66vh] xl:h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !stats ? (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              No data available for the selected date range
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.totalRevenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For period {format(startDate!, "MMM d, yyyy")} -{" "}
                      {format(endDate!, "MMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalOrders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average value: ${stats.averageOrderValue.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Items Sold
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalItemsSold}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across {stats.totalOrders} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Order Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.averageOrderValue.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Per order</p>
                  </CardContent>
                </Card>
              </div>

              {/* Distribution Charts */}
              <div className="grid gap-4 md:grid-cols-2 pb-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.productDistribution.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No product data available
                      </div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={preparePieData(stats.productDistribution)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {stats.productDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={customTooltip} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.categoryDistribution.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No category data available
                      </div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={preparePieData(stats.categoryDistribution)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {stats.categoryDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip content={customTooltip} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      Peak Revenue Day
                      <span className="text-xs ml-2 text-muted-foreground font-normal">
                        (Highest single day revenue)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.highestRevenueDay ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">
                            {format(
                              new Date(stats.highestRevenueDay.date),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              ${stats.highestRevenueDay.totalRevenue.toFixed(2)}
                            </span>
                            {stats.highestRevenueDay.totalRevenue >
                              calculateAverages(stats).avgRevenue && (
                              <span className="text-green-500 text-xs">
                                ↑{" "}
                                {(
                                  stats.highestRevenueDay.totalRevenue /
                                  calculateAverages(stats).avgRevenue
                                ).toFixed(1)}
                                x average
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Items Sold
                          </span>
                          <span className="font-medium">
                            {stats.highestRevenueDay.totalItems}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        No revenue data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>
                      Best Selling Day
                      <span className="text-xs ml-2 text-muted-foreground font-normal">
                        (Most items sold in a day)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.mostItemsSoldDay ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">
                            {format(
                              new Date(stats.mostItemsSoldDay.date),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Items Sold
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {stats.mostItemsSoldDay.totalItems}
                            </span>
                            {stats.mostItemsSoldDay.totalItems >
                              calculateAverages(stats).avgItems && (
                              <span className="text-green-500 text-xs">
                                ↑{" "}
                                {(
                                  stats.mostItemsSoldDay.totalItems /
                                  calculateAverages(stats).avgItems
                                ).toFixed(1)}
                                x average
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-medium">
                            ${stats.mostItemsSoldDay.totalRevenue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        No sales data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="quantity">
                    <TabsList className="mb-4">
                      <TabsTrigger value="quantity" className="cursor-pointer">
                        By Quantity
                      </TabsTrigger>
                      <TabsTrigger value="revenue" className="cursor-pointer">
                        By Revenue
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="quantity">
                      <div className="rounded-md border">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="py-2 px-4 text-left font-medium">
                                  Product
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Quantity
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Revenue
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.topProductsByQuantity.map((product) => (
                                <tr key={product.id} className="border-b">
                                  <td className="py-2 px-4">{product.name}</td>
                                  <td className="py-2 px-4 text-right">
                                    {product.quantity}
                                  </td>
                                  <td className="py-2 px-4 text-right">
                                    ${product.revenue.toFixed(2)}
                                  </td>
                                  <td className="py-2 px-4 text-right">
                                    ${product.price.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="revenue">
                      <div className="rounded-md border">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="py-2 px-4 text-left font-medium">
                                  Product
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Quantity
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Revenue
                                </th>
                                <th className="py-2 px-4 text-right font-medium">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.topProductsByRevenue.map((product) => (
                                <tr key={product.id} className="border-b">
                                  <td className="py-2 px-4">{product.name}</td>
                                  <td className="py-2 px-4 text-right">
                                    {product.quantity}
                                  </td>
                                  <td className="py-2 px-4 text-right">
                                    ${product.revenue.toFixed(2)}
                                  </td>
                                  <td className="py-2 px-4 text-right">
                                    ${product.price.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

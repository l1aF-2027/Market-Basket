"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export default function SalesChart() {
  const [data, setData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/sales-data?period=${period}`);

        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }

        const salesData = await response.json();
        setData(salesData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        toast.error("Failed to load sales data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [period]);

  const formatDate = (dateStr: string) => {
    try {
      // Check if the date is in yyyy-MM-dd format
      if (dateStr.length === 10) {
        return format(parseISO(dateStr), "MMM d");
      }
      // If it's in yyyy-MM format (for monthly data)
      return format(parseISO(`${dateStr}-01`), "MMM yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Sales Overview</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] cursor-pointer">
            <SelectValue  placeholder="Select period" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="week" className="cursor-pointer">
              Last Week
            </SelectItem>
            <SelectItem value="month" className="cursor-pointer">
              Last Month
            </SelectItem>
            <SelectItem value="year" className="cursor-pointer">
              Last Year
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No sales data available for the selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value, name) =>
                  name === "sales" ? formatCurrency(value as number) : value
                }
                labelFormatter={formatDate}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorSales)"
                yAxisId="left"
                name="Sales ($)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorOrders)"
                yAxisId="right"
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

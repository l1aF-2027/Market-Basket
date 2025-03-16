import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "week";

    let startDate: Date;
    const endDate = new Date();
    let interval: "day" | "week" | "month" = "day";

    // Determine date range based on period
    switch (period) {
      case "week":
        startDate = subDays(endDate, 7);
        interval = "day";
        break;
      case "month":
        startDate = subDays(endDate, 30);
        interval = "day";
        break;
      case "year":
        startDate = subDays(endDate, 365);
        interval = "month";
        break;
      default:
        startDate = subDays(endDate, 7);
        interval = "day";
    }

    // Get all purchases within the date range
    const purchases = await prisma.purchase.findMany({
      where: {
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      include: {
        purchaseDetails: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group purchases by date
    const salesByDate = new Map<string, { sales: number; orders: number }>();

    // Initialize all dates in the range
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dateKey = format(
        currentDate,
        interval === "day" ? "yyyy-MM-dd" : "yyyy-MM"
      );
      salesByDate.set(dateKey, { sales: 0, orders: 0 });
      currentDate =
        interval === "day" ? addDays(currentDate, 1) : addDays(currentDate, 30);
    }

    // Aggregate sales data
    purchases.forEach((purchase) => {
      const dateKey = format(
        purchase.createdAt,
        interval === "day" ? "yyyy-MM-dd" : "yyyy-MM"
      );

      const totalSale = purchase.purchaseDetails.reduce((sum, detail) => {
        return sum + detail.quantity * detail.product.price;
      }, 0);

      const existingData = salesByDate.get(dateKey) || { sales: 0, orders: 0 };
      salesByDate.set(dateKey, {
        sales: existingData.sales + totalSale,
        orders: existingData.orders + 1,
      });
    });

    // Convert to array for chart data
    const chartData = Array.from(salesByDate.entries()).map(([date, data]) => ({
      date,
      sales: Number.parseFloat(data.sales.toFixed(2)),
      orders: data.orders,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}

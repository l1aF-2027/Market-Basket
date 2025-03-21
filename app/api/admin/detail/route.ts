import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    // Parse dates or use defaults (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all purchases within the date range with their details
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
    });

    // Calculate total revenue and total items sold
    let totalRevenue = 0;
    let totalItemsSold = 0;

    // Track product statistics
    const productStats = new Map();

    // Track daily statistics
    const dailyStatsMap = new Map<
      string,
      {
        date: string;
        totalRevenue: number;
        totalItems: number;
      }
    >();

    // Process each purchase - ONLY ONCE
    purchases.forEach((purchase) => {
      const purchaseDate = purchase.createdAt.toISOString().split("T")[0];

      // Initialize daily stats
      if (!dailyStatsMap.has(purchaseDate)) {
        dailyStatsMap.set(purchaseDate, {
          date: purchaseDate,
          totalRevenue: 0,
          totalItems: 0,
        });
      }
      const dailyStats = dailyStatsMap.get(purchaseDate)!;

      let purchaseRevenue = 0;
      let purchaseItems = 0;

      purchase.purchaseDetails.forEach((detail) => {
        const { product, quantity } = detail;
        const revenue = product.price * quantity;

        // Update totals
        totalRevenue += revenue;
        totalItemsSold += quantity;
        purchaseRevenue += revenue;
        purchaseItems += quantity;

        // Update product statistics
        if (!productStats.has(product.id)) {
          productStats.set(product.id, {
            id: product.id,
            name: product.name,
            category: product.category,
            quantity: 0,
            revenue: 0,
            price: product.price,
          });
        }

        const stats = productStats.get(product.id);
        stats.quantity += quantity;
        stats.revenue += revenue;
      });

      // Update daily stats
      dailyStats.totalRevenue += purchaseRevenue;
      dailyStats.totalItems += purchaseItems;
    });

    const dailyStatsArray = Array.from(dailyStatsMap.values());

    // Find peak days
    const highestRevenueDay =
      dailyStatsArray.length > 0
        ? dailyStatsArray.reduce((max, current) =>
            current.totalRevenue > max.totalRevenue ? current : max
          )
        : null;

    const mostItemsSoldDay =
      dailyStatsArray.length > 0
        ? dailyStatsArray.reduce((max, current) =>
            current.totalItems > max.totalItems ? current : max
          )
        : null;

    // Convert product stats to array
    const productStatsArray = Array.from(productStats.values());

    // Average order value
    const averageOrderValue =
      purchases.length > 0 ? totalRevenue / purchases.length : 0;

    return NextResponse.json({
      totalRevenue,
      totalItemsSold,
      totalOrders: purchases.length,
      averageOrderValue,
      topProductsByQuantity: [...productStatsArray]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      topProductsByRevenue: [...productStatsArray]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      productDistribution: productStatsArray.map((product) => ({
        name: product.name,
        value: product.quantity,
      })),
      categoryDistribution: Array.from(
        new Map(
          productStatsArray.reduce((acc, product) => {
            acc.set(
              product.category,
              (acc.get(product.category) || 0) + product.quantity
            );
            return acc;
          }, new Map())
        ).entries()
      ).map(([name, value]) => ({ name, value })),
      highestRevenueDay,
      mostItemsSoldDay,
    });
  } catch (error) {
    console.error("Error fetching detailed stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch detailed statistics" },
      { status: 500 }
    );
  }
}

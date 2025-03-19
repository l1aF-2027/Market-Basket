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

    // Process each purchase
    purchases.forEach((purchase) => {
      purchase.purchaseDetails.forEach((detail) => {
        const { product, quantity } = detail;
        const revenue = product.price * quantity;

        totalRevenue += revenue;
        totalItemsSold += quantity;

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
    });

    // Convert product stats to array and sort
    const productStatsArray = Array.from(productStats.values());

    // Top products by quantity
    const topProductsByQuantity = [...productStatsArray]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Top products by revenue
    const topProductsByRevenue = [...productStatsArray]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Product distribution for pie chart
    const productDistribution = productStatsArray.map((product) => ({
      name: product.name,
      value: product.quantity,
    }));

    // Category distribution for pie chart
    const categoryMap = new Map();
    productStatsArray.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, 0);
      }
      categoryMap.set(
        product.category,
        categoryMap.get(product.category) + product.quantity
      );
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Average order value
    const averageOrderValue =
      purchases.length > 0 ? totalRevenue / purchases.length : 0;

    return NextResponse.json({
      totalRevenue,
      totalItemsSold,
      totalOrders: purchases.length,
      averageOrderValue,
      topProductsByQuantity,
      topProductsByRevenue,
      productDistribution,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Error fetching detailed stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch detailed statistics" },
      { status: 500 }
    );
  }
}

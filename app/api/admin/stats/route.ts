import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get total number of products
    const totalProducts = await prisma.product.count();

    // Get all purchase details with their products
    const purchaseDetails = await prisma.purchaseDetail.findMany({
      include: {
        product: true,
      },
    });

    // Calculate total sales (number of items sold)
    const totalSales = purchaseDetails.reduce(
      (total, detail) => total + detail.quantity,
      0
    );

    // Calculate total revenue
    const totalRevenue = purchaseDetails.reduce(
      (total, detail) => total + detail.quantity * detail.product.price,
      0
    );

    // Find top selling product
    const productSales: Record<number, { count: number; name: string }> = {};

    purchaseDetails.forEach((detail) => {
      const { productId, quantity } = detail;
      if (!productSales[productId]) {
        productSales[productId] = { count: 0, name: detail.product.name };
      }
      productSales[productId].count += quantity;
    });

    let topSellingProduct = "";
    let maxSales = 0;

    Object.values(productSales).forEach(({ count, name }) => {
      if (count > maxSales) {
        maxSales = count;
        topSellingProduct = name;
      }
    });

    // Get total number of purchases (orders)
    const totalPurchases = await prisma.purchase.count();

    return NextResponse.json({
      totalProducts,
      totalSales,
      totalRevenue,
      topSellingProduct,
      totalPurchases,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

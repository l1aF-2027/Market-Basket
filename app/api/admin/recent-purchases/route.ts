import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the 5 most recent purchases with their details
    const recentPurchases = await prisma.purchase.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }, // Lấy 5 đơn hàng mới nhất
      include: {
        purchaseDetails: {
          include: { product: true },
        },
      },
    });

    // Format the data for the frontend
    const formattedPurchases = recentPurchases.map((purchase) => {
      // Calculate total amount
      const totalAmount = purchase.purchaseDetails.reduce((sum, detail) => {
        return sum + detail.quantity * detail.product.price;
      }, 0);

      // Get total items count
      const totalItems = purchase.purchaseDetails.reduce((sum, detail) => {
        return sum + detail.quantity;
      }, 0);

      // Get list of product names
      const products = purchase.purchaseDetails.map((detail) => ({
        name: detail.product.name,
        quantity: detail.quantity,
        price: detail.product.price,
      }));

      return {
        id: purchase.id,
        date: purchase.createdAt,
        totalAmount,
        totalItems,
        products,
      };
    });

    return NextResponse.json(formattedPurchases);
  } catch (error) {
    console.error("Error fetching recent purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent purchases" },
      { status: 500 }
    );
  }
}

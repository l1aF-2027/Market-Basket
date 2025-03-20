import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        purchaseDetails: {
          select: { quantity: true },
        },
      },
    });

    // Calculate total sold and format response
    const topProducts = products
      .map((product) => ({
        ...product,
        totalSold: product.purchaseDetails.reduce(
          (sum, detail) => sum + detail.quantity,
          0
        ),
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 4)
      .map(({ purchaseDetails, totalSold, ...product }) => product);

    return NextResponse.json<Product[]>(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 }
    );
  }
}

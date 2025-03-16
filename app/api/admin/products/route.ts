import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get all products with their purchase details
    const products = await prisma.product.findMany({
      include: {
        purchaseDetails: true,
      },
    });

    // Add purchase count to each product
    const productsWithPurchases = products.map((product) => ({
      ...product,
      purchases: product.purchaseDetails.reduce(
        (total, detail) => total + detail.quantity,
        0
      ),
      // Remove the purchaseDetails from the response
      purchaseDetails: undefined,
    }));

    return NextResponse.json(productsWithPurchases);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, price, description, category, image } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category,
        image,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

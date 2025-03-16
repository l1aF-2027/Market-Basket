import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { purchases } = body;

    // First create a purchase (order) record without customer information
    const purchase = await prisma.purchase.create({
      data: {}, // No customer information needed
    });

    // Then create purchase details for each product in the order
    const purchaseDetailPromises = purchases.map(
      async (item: { productId: number; quantity: number }) => {
        return prisma.purchaseDetail.create({
          data: {
            purchaseId: purchase.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    );

    await Promise.all(purchaseDetailPromises);

    return NextResponse.json(
      {
        success: true,
        purchaseId: purchase.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("Purchase API called");

    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);
    const body = JSON.parse(rawBody);
    const { purchases } = body;

    if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
      return NextResponse.json(
        { error: "Invalid purchase data. Expected an array of purchases." },
        { status: 400 }
      );
    }

    // Get new purchase ID
    const lastPurchase = await prisma.purchase.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });
    const newPurchaseId = lastPurchase ? lastPurchase.id + 1 : 1000;

    // Get new purchase detail ID
    const lastPurchaseDetail = await prisma.purchaseDetail.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });
    let newPurchaseDetailId = lastPurchaseDetail
      ? lastPurchaseDetail.id + 1
      : 5000;

    // Create purchase with details
    const purchase = await prisma.purchase.create({
      data: {
        id: newPurchaseId,
        purchaseDetails: {
          create: purchases.map((p) => ({
            id: newPurchaseDetailId++,
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
      include: {
        purchaseDetails: true,
      },
    });

    console.log("Created purchase with ID:", purchase.id);

    // Prepare data for Hugging Face API
    const productIds = purchase.purchaseDetails.map((d) => d.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p.name]));
    const cart: string[] = [];

    purchase.purchaseDetails.forEach((detail) => {
      const productName = productMap.get(detail.productId);
      if (productName) {
        // Add product name multiple times according to quantity
        for (let i = 0; i < detail.quantity; i++) {
          cart.push(productName);
        }
      }
    });

    // Async call to Hugging Face API (fire-and-forget)
    (async () => {
      try {
        const response = await fetch(
          "https://hnd04-market-basket-recommendation.hf.space/confirm_purchase/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart }),
          }
        );

        if (!response.ok) {
          console.error("HF API error:", await response.text());
        } else {
          console.log("Successfully sent cart to HF API");
        }
      } catch (error) {
        console.error("Failed to send cart to HF API:", error);
      }
    })();

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

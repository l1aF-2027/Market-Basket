import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("Purchase API called");

    // Log the raw request body for debugging
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON body
    const body = JSON.parse(rawBody);
    console.log("Parsed body:", body);

    const { purchases } = body;
    console.log("Extracted purchases:", purchases);

    if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
      console.log("Invalid purchase data:", purchases);
      return NextResponse.json(
        { error: "Invalid purchase data. Expected an array of purchases." },
        { status: 400 }
      );
    }

    // 🚀 Lấy ID lớn nhất của Purchase
    console.log("Fetching max purchase ID");
    const lastPurchase = await prisma.purchase.findFirst({
      orderBy: { id: "desc" }, // Lấy bản ghi có ID lớn nhất
      select: { id: true },
    });

    const newPurchaseId = lastPurchase ? lastPurchase.id + 1 : 1000; // Nếu chưa có bản ghi nào, bắt đầu từ 1000
    console.log("New purchase ID:", newPurchaseId);

    // 🚀 Lấy ID lớn nhất của PurchaseDetail
    console.log("Fetching max purchase detail ID");
    const lastPurchaseDetail = await prisma.purchaseDetail.findFirst({
      orderBy: { id: "desc" }, // Lấy bản ghi có ID lớn nhất
      select: { id: true },
    });

    let newPurchaseDetailId = lastPurchaseDetail
      ? lastPurchaseDetail.id + 1
      : 5000; // Nếu chưa có, bắt đầu từ 5000
    console.log("Starting purchase detail ID from:", newPurchaseDetailId);

    // 🚀 Tạo Purchase cùng với các PurchaseDetails
    console.log("Creating purchase record");
    const purchase = await prisma.purchase.create({
      data: {
        id: newPurchaseId, 
        purchaseDetails: {
          create: purchases.map((p) => {
            return {
              id: newPurchaseDetailId++, 
              productId: p.productId,
              quantity: p.quantity,
            };
          }),
        },
      },
      include: {
        purchaseDetails: true,
      },
    });

    console.log("Created purchase with ID:", purchase.id);
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

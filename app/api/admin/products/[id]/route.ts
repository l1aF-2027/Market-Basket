import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        purchaseDetails: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add purchase count
    const productWithPurchases = {
      ...product,
      purchases: product.purchaseDetails.reduce(
        (total, detail) => total + detail.quantity,
        0
      ),
      // Remove the purchaseDetails from the response
      purchaseDetails: undefined,
    };

    return NextResponse.json(productWithPurchases);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    const body = await request.json();

    const { name, price, description, category, image } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        category,
        image,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    // First delete all purchase details related to this product
    await prisma.purchaseDetail.deleteMany({
      where: { productId: id },
    });

    // Then delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

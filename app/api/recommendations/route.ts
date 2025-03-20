import { NextResponse } from "next/server";

// API endpoint to get product recommendations based on cart items
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    // Extract product names from the cart items
    const cartItems = items.map((item: any) => item.product.name);

    // Format the payload for the external API
    const payload = {
      cart: cartItems,
    };

    console.log(
      "Sending recommendation request with payload:",
      JSON.stringify(payload)
    );

    // Call the external recommendation API
    const response = await fetch(
      "https://hnd04-market-basket-recommendation.hf.space/recommend/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Recommendation API error:", errorText);
      throw new Error(
        `Recommendation API returned ${response.status}: ${errorText}`
      );
    }

    const recommendations = await response.json();
    console.log("Received recommendations:", JSON.stringify(recommendations));

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);

    // Return a graceful error response
    return NextResponse.json(
      {
        error: "Failed to fetch recommendations",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

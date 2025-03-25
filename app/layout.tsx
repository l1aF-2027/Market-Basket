import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Market Basket",
  description:
    "Market Basket is a demo e-commerce website that applies the Apriori algorithm for Data Mining to suggest products that customers may want to buy.",
  icons: {
    icon: "web.ico",
  },
  robots: "index, follow",
  openGraph: {
    title: "Market Basket - Smart Shopping Suggestions",
    description:
      "Discover products you may want to buy based on data mining techniques.",
    url: "https://market-basket.vercel.app",
    type: "website",
    images: [
      {
        url: "https://storage.googleapis.com/kaggle-datasets-images/6896627/11067550/c232b880c9a1236f9c8937c3190debc9/dataset-cover.jpeg?t=2025-03-18-01-30-42",
        width: 1200,
        height: 630,
        alt: "Market Basket Website Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="Market Basket - Smart Shopping Suggestions"
          />
          <meta
            property="og:description"
            content="Discover products you may want to buy based on data mining techniques."
          />
          <meta property="og:url" content="https://market-basket.vercel.app" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://storage.googleapis.com/kaggle-datasets-images/6896627/11067550/c232b880c9a1236f9c8937c3190debc9/dataset-cover.jpeg?t=2025-03-18-01-30-42"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta
            property="og:image:alt"
            content="Market Basket Website Preview"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Market Basket - Smart Shopping Suggestions"
          />
          <meta
            name="twitter:description"
            content="Discover products you may want to buy based on data mining techniques."
          />
          <meta
            name="twitter:image"
            content="https://storage.googleapis.com/kaggle-datasets-images/6896627/11067550/c232b880c9a1236f9c8937c3190debc9/dataset-cover.jpeg?t=2025-03-18-01-30-42"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

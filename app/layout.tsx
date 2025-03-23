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
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta
            property="og:description"
            content={metadata.openGraph.description}
          />
          <meta property="og:url" content={metadata.openGraph.url} />
          <meta property="og:type" content={metadata.openGraph.type} />
          <meta
            property="og:image"
            content={metadata.openGraph.images[0].url}
          />
          <meta
            property="og:image:width"
            content={metadata.openGraph.images[0].width.toString()}
          />
          <meta
            property="og:image:height"
            content={metadata.openGraph.images[0].height.toString()}
          />
          <meta
            property="og:image:alt"
            content={metadata.openGraph.images[0].alt}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Market Basket - Smart Shopping Suggestions",
  description:
    "Market Basket is a demo e-commerce website that applies the Apriori algorithm for Data Mining to suggest products that customers may want to buy.",
  metadataBase: new URL("https://market-basket.vercel.app"),
  icons: {
    icon: "/web.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
  twitter: {
    card: "summary_large_image",
    title: "Market Basket - Smart Shopping Suggestions",
    description:
      "Discover products you may want to buy based on data mining techniques.",
    images: [
      "https://storage.googleapis.com/kaggle-datasets-images/6896627/11067550/c232b880c9a1236f9c8937c3190debc9/dataset-cover.jpeg?t=2025-03-18-01-30-42",
    ],
  },
  alternates: {
    canonical: "https://market-basket.vercel.app",
  },
  verification: {
    google: "ADD_YOUR_VERIFICATION_CODE_HERE",
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Market Basket",
                url: "https://market-basket.vercel.app",
                description:
                  "Market Basket is a demo e-commerce website that applies the Apriori algorithm for Data Mining to suggest products that customers may want to buy.",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://market-basket.vercel.app/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
                logo: "https://storage.googleapis.com/kaggle-datasets-images/6896627/11067550/c232b880c9a1236f9c8937c3190debc9/dataset-cover.jpeg?t=2025-03-18-01-30-42",
                sameAs: ["https://github.com/l1aF-2027/Market-Basket"],
              }),
            }}
          />
          {/* Remove duplicate meta tags as they're now in the metadata object */}
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

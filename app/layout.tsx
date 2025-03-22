import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Market Basket",
  icons: {
    icon: "web.ico",
  },
  description:
    "Market Basket is a demo e-commerce website that applies the Apriori algorithm for Data Mining to suggest products that customers may want to buy.",
  keywords:
    "market basket, market-basket.vercel.app, market basket for data mining, data mining, data mining project, market basket project, market basket data mining, market basket data mining project, market basket data mining project website, market basket data mining project website using data mining techniques, market basket data mining project website using data mining techniques for suggested products, market basket data mining project website using data mining techniques for suggested products for shopping, market basket data mining project website using data mining techniques for suggested products for shopping website, market basket data mining project website using data mining techniques for suggested products for shopping website simualte, market basket data mining project website using data mining techniques for suggested products for shopping website simualte a shopping website",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

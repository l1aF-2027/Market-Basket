"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBasket, ShoppingCart } from "lucide-react";
import ProductList from "@/components/ProductList";
import Basket from "@/components/Basket";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [basketItems, setBasketItems] = useState<
    {
      product: Product;
      quantity: number;
    }[]
  >([]);

  const [activeTab, setActiveTab] = useState("menu");
  useEffect(() => {
    const savedBasket = localStorage.getItem("basket");
    if (savedBasket) {
      setBasketItems(JSON.parse(savedBasket));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basketItems));
  }, [basketItems]);

  const addToBasket = (product: Product, quantity = 1) => {
    setBasketItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setBasketItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.product.id !== productId);
      }

      return prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromBasket = (productId: number) => {
    setBasketItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const clearBasket = () => {
    setBasketItems([]);
  };

  const totalItems = basketItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="container mx-auto px-4 h-screen flex flex-col">
      {/* Phần header - cố định */}
      <div className="flex items-center justify-between p-4 bg-background sticky top-0 z-10">
        <motion.div
          className="w-1/4"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            bounce: 0.3,
            type: "spring",
          }}
        ></motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        >
          <motion.img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png"
            alt="Shopping Cart"
            width="50"
            height="50"
            className="inline-block"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
          />
          <motion.h1
            className="text-4xl font-bold"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
          >
            Market Basket
          </motion.h1>
        </motion.div>

        <motion.div
          className="w-1/4 flex justify-end"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            bounce: 0.3,
            type: "spring",
          }}
        >
          <SignedIn>
            <UserButton />
          </SignedIn>
        </motion.div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Thanh tab - cố định */}
          <TabsList className="grid w-full grid-cols-2 bg-accent sticky z-10">
            <TabsTrigger
              value="menu"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger
              value="basket"
              className="flex items-center gap-2 cursor-pointer w-full "
            >
              <ShoppingBasket className="h-4 w-4" />
              <span>Basket</span>
              {totalItems > 0 && (
                <motion.span
                  className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.0,
                    bounce: 0.5,
                    type: "spring",
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="menu" className="h-full">
              <div className="h-full flex flex-col">
                <ProductList addToBasket={addToBasket} />
              </div>
            </TabsContent>

            <TabsContent value="basket" className="h-full">
              <Basket
                items={basketItems}
                updateQuantity={updateQuantity}
                removeFromBasket={removeFromBasket}
                clearBasket={clearBasket}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}

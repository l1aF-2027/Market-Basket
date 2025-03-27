"use client";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <a
      href="https://github.com/l1aF-2027/Market-Basket"
      className="flex items-center"
    >
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
    </a>
  );
}

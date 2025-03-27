"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import LoginSection from "@/components/LoginSection";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center">
        <a
          href="https://github.com/l1aF-2027/Market-Basket"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Header />
        </a>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-10">
        {/* Phần Login Section - Căn sát phải trong container */}
        <motion.div
          className="lg:col-span-5 flex justify-end md:h-screen"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div className="lg:pl-8 ">
            <LoginSection />
          </div>
        </motion.div>
        {/* Phần hình ảnh bên trái */}
        <motion.div
          className="lg:col-span-5 flex justify-start items-center lg:pl-8 pt-10 hidden lg:block"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <img
            src="./demo.gif"
            alt="Web Demo"
            className="w-full max-w-xl object-cover aspect-[16/9] "
          />
        </motion.div>
      </div>
    </main>
  );
}

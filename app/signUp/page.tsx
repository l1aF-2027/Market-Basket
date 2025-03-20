"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SignUpSection from "@/components/SignUpSection";
import ExampleChat from "@/components/ExampleChat";

export default function Home() {
  return (
    <main className="container mx-auto justify-between px-4 py-8">
      <div className="flex justify-center items-center">
        <Header />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-10">
        {/* Phần Login Section - Căn sát phải trong container */}
        <motion.div
          className="lg:col-span-5 flex justify-end"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div className="lg:pl-8">
            <SignUpSection />
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

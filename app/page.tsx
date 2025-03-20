"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import LoginSection from "@/components/LoginSection";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center">
        <Header />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-10 md:flex md:flex-col-reverse">
        {/* Phần hình ảnh (sẽ hiển thị trên cùng ở màn hình md) */}
        <motion.div
          className="lg:col-span-5 flex justify-start items-center md:justify-center md:items-center"
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

        {/* Phần Login Section */}
        <motion.div
          className="lg:col-span-5 flex justify-end md:justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <div className="w-full max-w-md border-r lg:pl-8">
            <LoginSection />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

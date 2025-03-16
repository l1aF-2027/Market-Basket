"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "admin")) {
      router.push("/main");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || user.publicMetadata?.role !== "admin") {
    return; // Hoặc hiển thị loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-6 h-screen overflow-hidden">
      <AdminDashboard />
    </div>
  );
}

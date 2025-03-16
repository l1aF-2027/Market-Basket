"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSection() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra hash trong URL để xử lý sau khi đăng nhập
    if (typeof window !== "undefined") {
      if (window.location.hash === "#/sso-callback" && isLoaded && user) {
        const userRole = user.publicMetadata?.role;
        if (userRole === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/main";
        }
      }
    }
  }, [user, isLoaded, router]);

  // Kiểm tra user đã đăng nhập chưa
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role;
      if (userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/main";
      }
    }
  }, [user, isLoaded]);

  return (
    <div className="">
      <SignIn
        routing="hash"
        signUpUrl="/signUp"
        redirectUrl={window.location.origin}
      />
    </div>
  );
}

"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSection() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role;
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/main");
      }
    }
  }, [user, isLoaded, router]);
  return (
    <div className="">
      <SignIn routing="hash" signUpForceRedirectUrl="/signUp" />
    </div>
  );
}

"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Separate component for handling redirects
function RedirectHandler() {
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

  return null; // This component doesn't render anything
}

export default function LoginSection() {
  return (
    <div className="">
      <RedirectHandler />
      <SignIn routing="hash" signUpUrl="/signUp" redirectUrl="/main" />
    </div>
  );
}

"use client";
import { SignIn } from "@clerk/nextjs";

export default function LoginSection() {
  return (
    <div className="">
      <SignIn routing="hash" signUpUrl="/signUp" redirectUrl="/admin" />
    </div>
  );
}

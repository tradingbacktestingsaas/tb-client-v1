"use client";

import React from "react";
import OfferSection from "@/components/common/offerings";
import { Div } from "@/components/ui/tags";
import SignInForm from "@/features/auth/signin/form";

const SignIn = () => {
  return (
    <Div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
      {/* Content */}
      <Div
        className="
          relative z-10
          flex flex-col lg:flex-row
          w-full max-w-8xl
          mx-auto
          items-center justify-center
          p-6 sm:p-10
          gap-18
        "
      >
        {/* Left Side: Offer Section (hidden on small) */}
        <Div className="hidden md:flex w-full lg:w-1/2 justify-center mb-26">
          <OfferSection />
        </Div>

        {/* Right Side: Sign In Form */}
        <Div>
          <SignInForm />
        </Div>
      </Div>
    </Div>
  );
};

export default SignIn;

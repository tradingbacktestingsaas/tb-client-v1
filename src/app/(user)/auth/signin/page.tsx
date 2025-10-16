"use client";

import React from "react";
import OfferSection from "@/components/common/offerings";
import { Div } from "@/components/ui/tags";
import SignInForm from "@/features/auth/signin/form";
import ShootingStars from "@/components/ui/shooting-stars";

const SignIn = () => {
  return (
    <Div className="grid items-center justify-center h-screen w-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
      <Div className="z-50">
        <ShootingStars />
      </Div>
      <Div className="lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3 md:grid grid-cols-2 w-screen z-50">
        <Div className="hidden sm:flex h-screen align-middle justify-center items-center xl:col-span-2">
          <Div className="justify-center align-middle items-center">
            <OfferSection />
          </Div>
        </Div>
        <Div className="flex h-screen align-middle justify-center items-center p-6">
          <SignInForm />
        </Div>
      </Div>
    </Div>
  );
};

export default SignIn;

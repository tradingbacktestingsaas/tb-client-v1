"use client";

import React from "react";
import OfferSection from "@/components/common/offerings";
import { Div } from "@/components/ui/tags";
import ForgotPasswordForm from "@/features/auth/forgot-password/form";
import ShootingStars from "@/components/ui/shooting-stars";

const ForgotPassword = () => {
  return (
    <div className="grid items-center justify-center h-screen w-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
      <div className="z-50">
        <ShootingStars />
      </div>
      <div className="lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3 md:grid grid-cols-2 w-screen z-50">
        <div className="hidden sm:flex h-screen align-middle justify-center items-center xl:col-span-2">
          <div className="justify-center align-middle items-center">
            <OfferSection />
          </div>
        </div>
        <div className="flex h-screen align-middle justify-center items-center p-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

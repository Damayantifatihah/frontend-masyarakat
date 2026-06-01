"use client";

import { useEffect, useState } from "react";

import SplashScreen from "@/components/splashScreen";

import Navbar from "@/components/landingpage/landing/navbar";
import HeroSection from "@/components/landingpage/landing/herosection";
import StatsBar from "@/components/landingpage/landing/statsbar";
import LayananSection from "@/components/landingpage/landing/layanansection";
import CaraKerjaSection from "@/components/landingpage/landing/carakerja";
import TestimoniSection from "@/components/landingpage/landing/testi";
import CtaSection from "@/components/landingpage/landing/ctasection";
import FooterSection from "@/components/landingpage/landing/footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("splash");

    if (hasSeenSplash) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("splash", "true");

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen font-[Poppins,sans-serif] bg-white">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <LayananSection />
      <CaraKerjaSection />
      <TestimoniSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
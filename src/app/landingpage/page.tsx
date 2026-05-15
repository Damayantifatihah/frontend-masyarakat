"use client";

import Navbar from "./navbar";
import HeroSection from "./herosection";
import StatsBar from "./statsbar";
import LayananSection from "./layanansection";
import CaraKerjaSection from "./carakerja";
import TestimoniSection from "./testi";
import CtaSection from "./ctasection";
import FooterSection from "./footer";

export default function Home() {
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
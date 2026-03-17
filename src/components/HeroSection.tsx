"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  totalCities: number;
  totalCountries: number;
  totalEntries: number;
}

export default function HeroSection({ totalCities, totalCountries, totalEntries }: Props) {
  return (
    <section className="relative h-screen bg-[#87CEEB] overflow-hidden flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')",
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#A8DAEF] to-[#C5E8F7]" />

      {/* Center Content */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="journal-cover w-[520px] h-[420px] rounded bg-gradient-to-b from-[#FFF9E6] via-[#FFF3CC] to-[#FFF9E6] border border-[#F0E0A0] shadow-2xl flex flex-col items-center justify-center gap-6 p-12">
          {/* Compass */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border border-[#6B2D3C]" />
            <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B2D3C]" />
          </div>

          <h1 className="font-cormorant text-[36px] font-medium tracking-tight text-[#2C3E50]">
            Hello World
          </h1>
          <p className="font-outfit text-[13px] tracking-[0.5px] text-[#777]">
            Places I&apos;ve Been, Stories I Keep
          </p>
          <div className="w-[60px] h-px bg-[#E0D090]" />
          <span className="font-outfit text-[11px] font-semibold tracking-[2px] text-[#6B2D3C]">
            2024 — 2026
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative flex items-center justify-between px-20 pb-8">
        <div className="flex items-center gap-12">
          {[
            { value: totalCities, label: "CITIES" },
            { value: totalCountries, label: "COUNTRIES" },
            { value: totalEntries, label: "ENTRIES" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-0.5">
              <span className="font-cormorant text-[28px] font-medium text-[#2C3E50]">
                {stat.value}
              </span>
              <span className="font-outfit text-[10px] font-semibold tracking-[2px] text-[#777]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="font-outfit text-[11px] tracking-[1px] text-[#777]">
            Scroll to open
          </span>
          <ChevronDown size={16} className="text-[#777]" />
        </div>
      </div>
    </section>
  );
}

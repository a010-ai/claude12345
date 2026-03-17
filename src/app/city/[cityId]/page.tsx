"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import EntryCard from "@/components/EntryCard";
import AddEntryDialog from "@/components/AddEntryDialog";
import { sampleCities, sampleEntries } from "@/lib/sample-data";

const cityImages: Record<string, string> = {
  osaka: "/photos/osaka/KakaoTalk_20260317_101011488_02.jpg",
  firenze: "/photos/firenze/KakaoTalk_20260317_101040112.jpg",
};

export default function CityPage({ params }: { params: { cityId: string } }) {
  const { cityId } = params;
  const [showAddEntry, setShowAddEntry] = useState(false);

  const city = sampleCities.find((c) => c.id === cityId);
  const entries = sampleEntries.filter((e) => e.cityId === cityId);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-outfit text-[#777]">City not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation onAddEntry={() => setShowAddEntry(true)} />

      {/* Hero Banner */}
      <div className="relative h-[240px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${cityImages[cityId] ?? ""}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0ACC] via-[#0A0A0A99] to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 gap-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link href="/" className="font-outfit text-[11px] text-white/70 hover:text-white">
              Map
            </Link>
            <ChevronRight size={12} className="text-white/40" />
            <span className="font-outfit text-[11px] text-white font-medium">
              {city.name}
            </span>
          </div>
          <h1 className="font-cormorant text-[48px] font-medium tracking-tight text-white">
            {city.name}
          </h1>
          <p className="font-outfit text-[14px] text-white/75">
            {city.country} — {entries.length} entries
          </p>
        </div>
      </div>

      {/* Entries */}
      <div className="px-12 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-cormorant text-[28px] font-medium tracking-tight text-[#0A0A0A]">
            Travel Entries
          </h2>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E5E5] font-outfit text-[12px] text-[#777] hover:border-[#999]">
            <ArrowUpDown size={14} />
            Latest first
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      <AddEntryDialog
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        cities={sampleCities}
        onSubmit={(entry) => {
          console.log("New entry:", entry);
          setShowAddEntry(false);
        }}
      />
    </main>
  );
}

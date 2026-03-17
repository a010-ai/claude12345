"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import WorldMap from "@/components/WorldMap";
import RecentEntries from "@/components/RecentEntries";
import AddEntryDialog from "@/components/AddEntryDialog";
import { sampleCities, sampleEntries } from "@/lib/sample-data";
import type { City } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [showAddEntry, setShowAddEntry] = useState(false);

  const cities = sampleCities;
  const entries = sampleEntries;
  const totalCountries = new Set(cities.map((c) => c.country)).size;

  const handleCityClick = (city: City) => {
    router.push(`/city/${city.id}`);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroSection
        totalCities={cities.length}
        totalCountries={totalCountries}
        totalEntries={entries.length}
      />

      {/* Map Section */}
      <section className="h-screen flex flex-col">
        <Navigation onAddEntry={() => setShowAddEntry(true)} />
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            <WorldMap cities={cities} onCityClick={handleCityClick} />
          </div>
          <RecentEntries entries={entries.slice(0, 5)} />
        </div>
      </section>

      <AddEntryDialog
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        cities={cities}
        onSubmit={(entry) => {
          console.log("New entry:", entry);
          setShowAddEntry(false);
        }}
      />
    </main>
  );
}

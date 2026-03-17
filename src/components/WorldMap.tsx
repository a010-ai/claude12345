"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { City } from "@/lib/types";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  cities: City[];
  onCityClick: (city: City) => void;
}

export default function WorldMap({ cities, onCityClick }: Props) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative w-full h-full bg-[#FAFAFA] rounded border border-[#E5E5E5] overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-8 z-10">
        <h2 className="font-cormorant text-[32px] font-medium tracking-tight text-[#0A0A0A]">
          My World
        </h2>
        <p className="font-outfit text-[13px] text-[#777]">
          {cities.length} cities across{" "}
          {new Set(cities.map((c) => c.country)).size} countries
        </p>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-6 right-8 z-10 flex gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
          className="w-8 h-8 bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
        >
          <Plus size={14} className="text-[#0A0A0A]" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
          className="w-8 h-8 bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
        >
          <Minus size={14} className="text-[#0A0A0A]" />
        </button>
      </div>

      {/* Map */}
      <ComposableMap
        projectionConfig={{ scale: 147, center: [0, 20] }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={zoom} onMoveEnd={({ zoom: z }) => setZoom(z)}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E5E5E5"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#D5D5D5", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {cities.map((city) => (
            <Marker
              key={city.id}
              coordinates={[city.lng, city.lat]}
              onClick={() => onCityClick(city)}
              style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: {} }}
            >
              <circle r={4} fill="#6B2D3C" />
              <circle r={8} fill="#6B2D3C" opacity={0.15} />
              <text
                textAnchor="middle"
                y={-14}
                className="font-outfit"
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  fill: "#0A0A0A",
                }}
              >
                {city.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

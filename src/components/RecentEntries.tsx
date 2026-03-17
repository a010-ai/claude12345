"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Entry } from "@/lib/types";

export default function RecentEntries({ entries }: { entries: Entry[] }) {
  return (
    <div className="w-[380px] shrink-0 border-l border-[#E5E5E5] bg-white flex flex-col">
      <div className="px-7 pt-8 pb-6 flex items-center justify-between">
        <h2 className="font-cormorant text-[22px] font-medium text-[#0A0A0A]">
          Recent Entries
        </h2>
        <Link
          href="/entries"
          className="font-outfit text-[12px] font-medium text-[#6B2D3C] hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/city/${entry.cityId}`}
            className="flex items-center gap-4 px-7 py-4 border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded bg-[#F5F5F5] overflow-hidden shrink-0">
              {entry.photos[0] ? (
                <img
                  src={entry.photos[0]}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#E5E5E5]" />
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-outfit text-[14px] font-medium text-[#0A0A0A]">
                {entry.cityName}, {entry.country}
              </p>
              <p className="font-outfit text-[11px] text-[#999] mt-0.5">
                {entry.visitDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="font-outfit text-[12px] text-[#777] mt-1 truncate">
                {entry.text}
              </p>
            </div>
            <ChevronRight size={16} className="text-[#999] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

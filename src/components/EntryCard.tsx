"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import type { Entry } from "@/lib/types";

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="border border-[#E5E5E5] rounded overflow-hidden group">
      {/* Image */}
      <div className="w-full h-[200px] bg-[#F5F5F5] overflow-hidden">
        {entry.photos[0] ? (
          <img
            src={entry.photos[0]}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={32} className="text-[#E5E5E5]" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <span className="font-outfit text-[11px] font-semibold tracking-[1px] text-[#999]">
          {entry.visitDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <h3 className="font-cormorant text-[20px] font-medium text-[#0A0A0A]">
          {entry.title}
        </h3>
        <p className="font-outfit text-[13px] text-[#777] leading-relaxed line-clamp-3">
          {entry.text}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <ImageIcon size={14} className="text-[#999]" />
            <span className="font-outfit text-[11px] text-[#999]">
              {entry.photos.length} photos
            </span>
          </div>
          <Link
            href={`/city/${entry.cityId}`}
            className="font-outfit text-[12px] font-medium text-[#6B2D3C] hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}

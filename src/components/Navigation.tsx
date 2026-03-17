"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export default function Navigation({ onAddEntry }: { onAddEntry?: () => void }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Map" },
    { href: "/cities", label: "Cities" },
    { href: "/entries", label: "Entries" },
  ];

  return (
    <nav className="h-16 border-b border-[#E5E5E5] bg-white flex items-center justify-between px-12">
      <Link href="/" className="font-cormorant text-[22px] font-semibold text-[#0A0A0A]">
        Hello World
      </Link>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-outfit text-[13px] transition-colors ${
              pathname === link.href
                ? "text-[#6B2D3C] font-medium"
                : "text-[#777] hover:text-[#0A0A0A]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={onAddEntry}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white px-5 py-2.5 font-outfit text-[13px] font-medium hover:bg-[#222] transition-colors"
        >
          <Plus size={14} />
          New Entry
        </button>
      </div>
    </nav>
  );
}

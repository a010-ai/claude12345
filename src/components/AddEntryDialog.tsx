"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import type { City, Entry } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  cities: City[];
  onSubmit: (entry: Omit<Entry, "id" | "createdAt">) => void;
}

export default function AddEntryDialog({ open, onClose, cities, onSubmit }: Props) {
  const [cityId, setCityId] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isNewCity, setIsNewCity] = useState(false);

  const handleSubmit = () => {
    const selectedCity = cities.find((c) => c.id === cityId);
    onSubmit({
      cityId: isNewCity ? "new" : cityId,
      cityName: isNewCity ? newCityName : selectedCity?.name ?? "",
      country: isNewCity ? newCountry : selectedCity?.country ?? "",
      title,
      text,
      photos,
      visitDate: new Date(visitDate),
    });
    // Reset
    setCityId("");
    setTitle("");
    setText("");
    setVisitDate("");
    setPhotos([]);
    setIsNewCity(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="font-cormorant text-[24px] font-medium text-[#0A0A0A]">
            New Entry
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* City Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[12px] font-semibold tracking-[1px] text-[#999] uppercase">
              City
            </label>
            {!isNewCity ? (
              <div className="flex gap-2">
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="flex-1 h-10 px-3 border border-[#E5E5E5] rounded font-outfit text-[13px] bg-white focus:border-[#6B2D3C] focus:outline-none"
                >
                  <option value="">Select a city...</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsNewCity(true)}
                  className="px-3 h-10 border border-[#E5E5E5] rounded font-outfit text-[12px] text-[#6B2D3C] hover:bg-[#FAFAFA]"
                >
                  + New
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="City name"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    className="font-outfit text-[13px]"
                  />
                  <Input
                    placeholder="Country"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="font-outfit text-[13px] w-[140px]"
                  />
                </div>
                <button
                  onClick={() => setIsNewCity(false)}
                  className="self-start font-outfit text-[12px] text-[#777] hover:text-[#0A0A0A]"
                >
                  ← Select existing city
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[12px] font-semibold tracking-[1px] text-[#999] uppercase">
              Title
            </label>
            <Input
              placeholder="Give this entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-outfit text-[13px]"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[12px] font-semibold tracking-[1px] text-[#999] uppercase">
              Visit Date
            </label>
            <Input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="font-outfit text-[13px]"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[12px] font-semibold tracking-[1px] text-[#999] uppercase">
              Your Story
            </label>
            <Textarea
              placeholder="Write about your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-outfit text-[13px] min-h-[120px] leading-relaxed"
            />
          </div>

          {/* Photos */}
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[12px] font-semibold tracking-[1px] text-[#999] uppercase">
              Photos
            </label>
            <div className="flex gap-2 flex-wrap">
              {photos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 border border-dashed border-[#E5E5E5] rounded flex items-center justify-center cursor-pointer hover:border-[#6B2D3C] transition-colors">
                <ImageIcon size={20} className="text-[#999]" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setPhotos((prev) => [...prev, reader.result as string]);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={(!cityId && !newCityName) || !title || !text || !visitDate}
            className="w-full mt-2 bg-[#0A0A0A] hover:bg-[#222] font-outfit text-[13px] font-medium"
          >
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

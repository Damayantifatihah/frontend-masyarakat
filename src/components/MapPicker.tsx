"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search, MapPin } from "lucide-react";

type Props = { onSelectLocation: (location: string) => void; };

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 15); }, [center, map]);
  return null;
}

function LocationMarker({ position, setPosition, onSelectLocation }: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  onSelectLocation: (location: string) => void;
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        onSelectLocation(data.display_name || `${lat}, ${lng}`);
      } catch {
        onSelectLocation(`${lat}, ${lng}`);
      }
    },
  });
  return <Marker position={position} />;
}

export default function MapPicker({ onSelectLocation }: Props) {
  const [search, setSearch]     = useState("");
  const [position, setPosition] = useState<[number, number]>([-6.2, 106.816666]);
  const [selected, setSelected] = useState("");

  const searchLocation = async () => {
    if (!search.trim()) return;
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data?.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setSelected(data[0].display_name);
        onSelectLocation(data[0].display_name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (location: string) => {
    setSelected(location);
    onSelectLocation(location);
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-xl">

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            placeholder="Cari lokasi..."
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#B45743] focus:bg-white transition-colors font-[inherit]"
          />
        </div>
        <button
          type="button"
          onClick={searchLocation}
          className="px-4 rounded-xl bg-[#B45743] hover:bg-[#9E3D2C] text-white text-sm font-bold transition-colors font-[inherit] border-none cursor-pointer"
        >
          Cari
        </button>
      </div>

      {/* Selected location */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F9EAE7] border border-[#F0D0C8]">
        <MapPin className="w-4 h-4 text-[#B45743] shrink-0" />
        <p className="text-xs text-[#8B3A2A] truncate">
          {selected || "Klik pada peta untuk memilih lokasi"}
        </p>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <MapContainer center={position} zoom={15} style={{ height: "320px", width: "100%" }} className="z-0">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeMapView center={position} />
          <LocationMarker position={position} setPosition={setPosition} onSelectLocation={handleSelect} />
        </MapContainer>
      </div>

    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Shield, Star, CheckCircle, Percent, Compass, ShieldCheck } from "lucide-react";

const popularCities = [
  { name: "Bangalore", label: "Bangalore" },
  { name: "Chennai", label: "Chennai" },
  { name: "Delhi", label: "Delhi" },
  { name: "Hyderabad", label: "Hyderabad" },
  { name: "Mumbai", label: "Mumbai" },
  { name: "Pune", label: "Pune" },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Verified PGs",
    desc: "Every property goes through strict physical verification.",
  },
  {
    icon: Percent,
    title: "Best Price Guarantee",
    desc: "No agent fees, no hidden costs. Lowest deposit rates.",
  },
  {
    icon: Star,
    title: "Guest Rated Stays",
    desc: "Browse authentic reviews and star ratings from students.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (city) params.append("city", city);
    if (maxPrice) params.append("max", maxPrice);
    navigate(`/find-pg?${params.toString()}`);
  };

  const handleCityClick = (cityName) => {
    navigate(`/find-pg?city=${cityName}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sub-header: Curated OYO Cities Bar */}
      <div className="w-full bg-zinc-950/80 border-b border-orange-600/30 overflow-x-auto whitespace-nowrap py-3 px-6 scrollbar-none flex justify-center gap-8">
        {popularCities.map((item) => (
          <button
            key={item.name}
            onClick={() => handleCityClick(item.name)}
            className="text-sm font-semibold text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Hero Banner Section */}
      <section className="relative py-20 md:py-32 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black border-b border-orange-600/20 px-4">
        <div className="container mx-auto max-w-4xl text-center flex flex-col gap-6">
          <span className="text-orange-500 text-xs md:text-sm font-bold tracking-widest uppercase bg-orange-600/10 px-4 py-1.5 rounded-full inline-block mx-auto border border-orange-500/25">
            Premium Coliving & PG Stays
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Sanitized, Affordable <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
              PG Accommodations
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-400">
            Book trusted, fully-managed single or sharing rooms. No brokerage, flexible deposits, WiFi, power-backup & food included.
          </p>

          {/* OYO-style Search Box Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-3xl mx-auto bg-zinc-900/90 backdrop-blur-xl border border-orange-600 p-4 md:p-6 rounded-2xl shadow-2xl shadow-orange-600/10 mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-left"
          >
            {/* Search Input */}
            <div className="relative">
              <label className="text-xxs font-bold text-orange-500 uppercase block mb-1">Locality / Area</label>
              <input
                type="text"
                placeholder="Search location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 bg-transparent text-white border-b border-zinc-700 focus:border-orange-500 focus:outline-none text-sm placeholder-zinc-500"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <label className="text-xxs font-bold text-orange-500 uppercase block mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-2 bg-transparent text-white border-b border-zinc-700 focus:border-orange-500 focus:outline-none text-sm cursor-pointer"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">All Cities</option>
                {popularCities.map((c) => (
                  <option key={c.name} value={c.name} className="bg-zinc-900 text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Limit */}
            <div className="relative">
              <label className="text-xxs font-bold text-orange-500 uppercase block mb-1">Max Rent</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full py-2 bg-transparent text-white border-b border-zinc-700 focus:border-orange-500 focus:outline-none text-sm cursor-pointer"
              >
                <option value="" className="bg-zinc-900 text-zinc-400">No Limit</option>
                <option value="5000" className="bg-zinc-900 text-white">Under ₹5,000</option>
                <option value="8000" className="bg-zinc-900 text-white">Under ₹8,000</option>
                <option value="12000" className="bg-zinc-900 text-white">Under ₹12,000</option>
                <option value="18000" className="bg-zinc-900 text-white">Under ₹18,000</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-500 text-black font-extrabold rounded-xl transition hover:opacity-90 hover:scale-102 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/25"
              >
                <Search className="w-5 h-5 text-black font-bold" />
                Find PG
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Trust Points (OYO Trust badges) */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-zinc-950 border border-orange-600/20 rounded-xl hover:border-orange-500/40 transition duration-300"
              >
                <div className="p-3 bg-orange-600/10 rounded-lg">
                  <item.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OYO-inspired "Ready to List" banner */}
      <section className="py-12 bg-zinc-950 border-t border-orange-600/20">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Earn double income from your property!</h3>
            <p className="text-gray-400 text-sm mt-1">Convert your space into a premium coliving home with zero hassle.</p>
          </div>
          <button
            onClick={() => navigate("/provider-dashboard/add-property")}
            className="px-6 py-3 border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-black font-bold rounded-xl transition duration-300 cursor-pointer"
          >
            Register as Host
          </button>
        </div>
      </section>
    </div>
  );
}

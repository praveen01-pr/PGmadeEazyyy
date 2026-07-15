import { useNavigate } from "react-router-dom";
import { Search, Shield, UserCircle2 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find PGs based on location, price, amenities, and more with our advanced search filters.",
  },
  {
    icon: UserCircle2,
    title: "Verified Hosts",
    description: "All our PG owners are verified to ensure a safe and reliable booking experience.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Book your PG with confidence using our secure payment system and booking protection.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-black/90 backdrop-blur-lg px-4 py-20">
        <div className="container mx-auto flex flex-col items-center text-center gap-6">
          
          {/* Hero Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Your Perfect <span className="text-orange-500">PG Accommodation</span>
          </h1>
          
          {/* Hero Subtitle */}
          <p className="max-w-2xl text-lg text-gray-400">
            Discover comfortable and affordable PG accommodations in your preferred location. Verified listings, instant
            booking, and hassle-free stay.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            
            {/* Search PGs Button */}
            <button 
              onClick={() => navigate('/find-pg')}
              className="flex items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-black font-medium shadow-md shadow-orange-600/30 transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="h-5 w-5" />
              Search PGs
            </button>

            {/* List Your Property Button */}
            <button 
              onClick={() => navigate('/provider-dashboard/add-property')}
              className="rounded-md border border-orange-500 px-6 py-3 text-orange-500 font-medium transition-all duration-300 hover:bg-orange-600 hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
            >
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/90 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          
          {/* Section Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-gray-400">
              Everything you need to find or list PG accommodations, all in one platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl border border-orange-600 bg-black/80 shadow-md shadow-orange-600/20 transition-transform duration-300 hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-orange-500 mb-4 animate-pulse hover:animate-spin transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

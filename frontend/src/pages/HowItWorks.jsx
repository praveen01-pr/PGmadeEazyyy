import React from 'react';
import { Home, Search, ClipboardCheck, Key, Building2, UserCheck, MessageSquare, CreditCard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "For PG Seekers",
      icon: Home,
      items: [
        {
          title: "Search PGs",
          description: "Browse through our extensive list of verified PGs with detailed information, photos, and amenities.",
          icon: Search
        },
        {
          title: "Book a Visit",
          description: "Schedule visits to your preferred PGs at your convenience.",
          icon: ClipboardCheck
        },
        {
          title: "Secure Booking",
          description: "Complete the booking process online with secure payment options.",
          icon: Key
        }
      ]
    },
    {
      title: "For PG Providers",
      icon: Building2,
      items: [
        {
          title: "List Your Property",
          description: "Register and list your PG with detailed information, photos, and available amenities.",
          icon: Building2
        },
        {
          title: "Get Verified",
          description: "Complete our verification process to build trust with potential tenants.",
          icon: UserCheck
        },
        {
          title: "Manage Bookings",
          description: "Easily manage booking requests and communicate with tenants through our platform.",
          icon: MessageSquare
        }
      ]
    }
  ];

  const features = [
    {
      title: "Secure Payments",
      description: "All transactions are processed through secure payment gateways.",
      icon: CreditCard
    },
    {
      title: "Verified Listings",
      description: "Every PG listing undergoes thorough verification for your safety.",
      icon: UserCheck
    },
    {
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you.",
      icon: MessageSquare
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orange-500">
            How PG Made Eazy Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're looking for a PG or want to list your property, we've made the process simple and secure.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {steps.map((section, index) => (
            <div key={index} className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold text-orange-500">{section.title}</h2>
              </div>
              <div className="space-y-8">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-4 items-start">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <item.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="border-t border-orange-600/30 pt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">
            Why Choose PG Made Eazy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-orange-500/5 rounded-lg border border-orange-600/30">
                <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-12 bg-orange-500/5 rounded-lg border border-orange-600/30">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">Join our platform and experience hassle-free PG booking and management.</p>
          <div className="flex gap-4 justify-center">
            <a href="/register" className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Register Now
            </a>
            <a href="/contact" className="px-6 py-3 bg-transparent border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 
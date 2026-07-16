import React from 'react';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Lock className="h-14 w-14 text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-orange-500">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-sm">
            Last Updated: July 16, 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-500" />
              1. Information We Collect
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We collect personal information necessary to offer hostel listing and booking services. This includes your name, email address, phone number, role type (Seeker or Provider), profile photos, and verification documents (like Government ID types).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-2 leading-relaxed">
              <li>To provide, personalize, and improve our services (like matching you with suitable PGs).</li>
              <li>To allow providers and seekers to contact each other once a booking request is made.</li>
              <li>To verify identity and maintain safety inside the coliving community.</li>
              <li>To process transaction details securely.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              3. Data Protection & Security
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We take the security of your data seriously. We use secure socket layer (SSL) encryption, secure hosting configurations on Vercel and Render, and encrypted authentication tokens. While no storage is 100% secure, we implement industry best-practices to guard your credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              4. Sharing of Information
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed text-justify">
              We do not sell or lease your personal information to third parties. We share details between users (e.g. sharing a seeker's phone number with a provider) strictly to coordinate the booking, visit scheduler, and stay details.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;

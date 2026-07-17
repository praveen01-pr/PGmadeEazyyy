import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, AlertTriangle, HelpCircle, ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Scale className="h-14 w-14 text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-orange-500">
            Terms & Conditions
          </h1>
          <p className="text-zinc-400 text-sm">
            Last Updated: July 16, 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              By registering, accessing, or using the PG Made Easy platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-500" />
              2. User Eligibility & Accounts
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You must be at least 18 years of age to register as a Seeker or Provider. You agree to provide true, accurate, and current registration information. You are solely responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              3. Booking & Cancellation Policies
            </h2>
            <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-2 leading-relaxed">
              <li><strong>Rent & Fees:</strong> All rent details, security deposit amounts, and features are listed by the respective PG Providers. Seekers must pay rent monthly as agreed.</li>
              <li><strong>Security Deposit:</strong> A refundable security deposit is mandatory for all PGs. It is refundable at the time of check-out after adjusting for any repairs or pending utility bills.</li>
              <li><strong>Cancellation:</strong> Bookings can be cancelled freely within 24 hours of reservation. Any cancellation after 24 hours will incur a non-refundable cancellation fee equal to 10% of the token booking amount.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              4. Code of Conduct & Curfew Rules
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              All occupants must strictly follow the house rules set by their PG Provider. By default, a standard curfew of 10:30 PM is observed in all PGs unless explicitly stated otherwise by the provider. Loud music, drug or alcohol possession, and property damage are strictly prohibited and may result in immediate eviction without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-500" />
              5. Provider Guidelines
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Providers must ensure that all listings are authentic, and uploaded images accurately represent the actual physical condition of the hostels. Misleading listings, fake images, or sudden pricing changes after bookings will result in immediate termination of the provider account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-500" />
              6. Limitation of Liability
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed text-justify">
              PG Made Easy is a marketplace platform connecting PG seekers and providers. While we strive to verify listings, we do not inspect every facility and are not liable for disputes, service failures, or property damage occurring between the seeker and the provider.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 animate-fadeIn">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Home</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: January 2025</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. About this agreement</h2>
          <p>By using Verifix, you agree to these terms. Verifix is a marketplace platform connecting customers with independent tradespeople in Malta. We are not a party to the contract between customer and tradesperson — we provide the platform, vetting, and payment infrastructure.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Accounts</h2>
          <p>You must be 18 or over to create an account. You are responsible for all activity under your account. Keep your login credentials secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Bookings and payments</h2>
          <p>All jobs must be booked and paid through the platform. Arranging payment directly with a tradesperson outside the platform is a breach of these terms and may result in account suspension. The platform takes a commission on every completed job to fund operations and the vetting programme.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Reviews</h2>
          <p>Reviews may only be submitted after a completed booking. Fake, manipulated, or retaliatory reviews are not permitted and will be removed.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Disputes</h2>
          <p>If you have a dispute about a job, you must raise it through the platform within 48 hours of job completion. We will review disputes and make a determination, which both parties agree to accept as final.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Tradesperson obligations</h2>
          <p>Tradespeople must maintain valid licences and insurance at all times. Allowing these to lapse while listed on the platform is a breach of these terms and will result in immediate suspension.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Changes to these terms</h2>
          <p>We may update these terms from time to time. Continued use of the platform after a change constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Governing law</h2>
          <p>These terms are governed by the laws of Malta.</p>
        </section>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
          Questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
        </div>
      </div>
    </div>
  );
}

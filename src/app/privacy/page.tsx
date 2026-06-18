import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 animate-fadeIn">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Home</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: January 2025</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">What data we collect</h2>
          <p>When you register, we collect your name, email address, and phone number. When you make a booking, we collect the job address and description. Tradespeople additionally provide their trade licence number, years of experience, and professional references during vetting.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">How we use it</h2>
          <p>We use your data to operate the platform — matching you with tradespeople, processing bookings and payments, sending job confirmations and notifications, and maintaining your review history. We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Who can see your information</h2>
          <p>When you book a tradesperson, your name, phone number, and job address are shared with them for the purposes of completing the booking. Tradespeople&apos;s names, trade, and ratings are visible publicly. Email addresses are never displayed publicly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Data retention</h2>
          <p>We retain booking and payment records for 7 years for legal and tax purposes. You may request deletion of your account and personal data at any time by contacting us — subject to these legal retention obligations.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your rights (GDPR)</h2>
          <p>You have the right to access, correct, or delete your personal data. You have the right to data portability and to object to processing. To exercise any of these rights, contact us at privacy@verifix.mt.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Cookies</h2>
          <p>We use only essential cookies for authentication. We do not use third-party tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Contact</h2>
          <p>For privacy-related enquiries: <a href="mailto:privacy@verifix.mt" className="text-blue-600 hover:underline">privacy@verifix.mt</a></p>
        </section>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
          General enquiries? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
        </div>
      </div>
    </div>
  );
}

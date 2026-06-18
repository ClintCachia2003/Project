import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl">Verifix</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Malta&apos;s marketplace for personally vetted, licensed tradespeople. Every pro on the platform has been identity-checked, licence-verified, and insured — before they appear in search results.
            </p>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Based in Malta · Serving all localities</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Trades</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Plumbing", "Electrical", "Carpentry", "AC Repair", "Painting", "Tiling"].map((s) => (
                <li key={s}>
                  <Link href={`/trades/${s.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "How It Works", href: "/how-it-works" },
                { label: "Apply as a Tradesperson", href: "/apply" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Verifix. All rights reserved.</p>
          <p className="text-sm text-gray-500">Built for Malta 🇲🇹</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl">TradePro</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Connecting you with trusted, verified trade professionals in your area. Quality service, on your schedule.
            </p>
            <div className="flex gap-3 mt-4">
              {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                <div key={social} className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-400 capitalize">{social[0].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Carpentry", "Electrical", "Plumbing", "HVAC", "Painting", "Roofing"].map((s) => (
                <li key={s}>
                  <Link href={`/trades/${s.toLowerCase()}`} className="hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "About Us", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Become a Pro", href: "/register?role=worker" },
                { label: "Help Center", href: "/help" },
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
          <p className="text-sm text-gray-500">© 2024 TradePro. All rights reserved.</p>
          <p className="text-sm text-gray-500">Made with ❤️ for homeowners everywhere</p>
        </div>
      </div>
    </footer>
  );
}

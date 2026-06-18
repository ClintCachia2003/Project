import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Browse by Trade",
    description: "Choose from our trade categories — electrical, plumbing, carpentry, AC, painting, tiling, and more. Each category shows you verified professionals available across Malta and Gozo.",
  },
  {
    number: "02",
    icon: "👷",
    title: "Choose Your Tradesperson",
    description: "Every profile shows verified badges, real customer reviews from completed jobs, years of experience, and a clear hourly rate. What you see is exactly what you get.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Pick a Date and Time",
    description: "View the tradesperson's live availability. Select a slot that works for you — no back-and-forth phone calls, no waiting days for a text reply.",
  },
  {
    number: "04",
    icon: "📋",
    title: "Describe the Job",
    description: "Tell us what needs doing and where. The more detail you include, the more accurate the quote. Add photos in the notes if it helps.",
  },
  {
    number: "05",
    icon: "💶",
    title: "Review the Quote",
    description: "The tradesperson reviews your request and sends a price quote. You see exactly what you'll pay before confirming — no surprises when the job is done.",
  },
  {
    number: "06",
    icon: "⭐",
    title: "Job Done — Leave a Review",
    description: "Once the work is complete, rate your experience. Your review helps other Maltese homeowners choose with confidence, and keeps our standard high.",
  },
];

const vettingChecks = [
  {
    icon: "🪪",
    title: "Identity Verified",
    desc: "We check a government-issued ID for every applicant. You always know exactly who is coming to your home.",
  },
  {
    icon: "📋",
    title: "Trade Licence Confirmed",
    desc: "We validate the tradesperson's licence with the relevant Maltese authority — no self-declarations accepted.",
  },
  {
    icon: "🛡️",
    title: "Insurance Checked",
    desc: "Active public liability insurance is confirmed before approval. You're protected if anything goes wrong.",
  },
  {
    icon: "👥",
    title: "References Personally Reviewed",
    desc: "We contact professional references directly — not just collect a list of names.",
  },
];

const faqs = [
  {
    q: "Why is this different from asking on Facebook?",
    a: "On Facebook you get anonymous recommendations with no accountability. Here, every tradesperson has been personally vetted by our team — licence checked, insured, ID confirmed — and every review is tied to a real completed job on the platform. There's nowhere to hide.",
  },
  {
    q: "How does the vetting process work?",
    a: "Every applicant goes through a four-step review: identity check, trade licence validation with the relevant Maltese authority, confirmation of active public liability insurance, and direct contact with professional references. Only those who pass all four appear on the platform.",
  },
  {
    q: "Do I know the price before I confirm?",
    a: "Yes — always. After you submit a booking request, the tradesperson sends you a fixed quote for the job. You review it and either approve or decline before anything is confirmed. No surprises.",
  },
  {
    q: "What if I'm not happy with the work?",
    a: "You can open a dispute directly through the platform. Our team reviews it and works to reach a fair resolution. Tradespeople on the platform know that their rating and continued listing depends on customer satisfaction.",
  },
  {
    q: "Can I cancel after booking?",
    a: "Yes. You can cancel a booking up to 24 hours before the appointment at no cost. Cancellations within 24 hours may be subject to a small fee.",
  },
  {
    q: "How do I join as a tradesperson?",
    a: "Submit an application through our Apply page. We review all applications personally — not automatically. If you pass our vetting checks, you'll be listed on the platform with a verified badge.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From burst pipe to booked tradesperson — here&apos;s exactly what happens when you use the platform.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={step.number} className={`flex flex-col md:flex-row gap-6 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0 flex items-center gap-4 md:w-64">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {step.number}
                </div>
                <span className="text-4xl">{step.icon}</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vetting section */}
      <section id="vetting" className="bg-blue-950 text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Vetting Process</h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              This is what separates us from a Facebook group. Before any tradesperson appears on the platform, our team personally completes all four of these checks.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vettingChecks.map((check) => (
              <div key={check.title} className="bg-blue-900/50 border border-blue-800/50 rounded-2xl p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0">{check.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{check.title}</h3>
                  <p className="text-sm text-blue-300 leading-relaxed">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-blue-300 text-sm mt-8">
            All four checks must pass before a tradesperson is approved. No exceptions.
          </p>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why homeowners in Malta trust us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "💶", title: "Price agreed before work starts", desc: "The tradesperson sends a quote. You approve it. The price doesn't change." },
              { icon: "⭐", title: "Reviews from real jobs only", desc: "Every review on the platform is linked to a verified, completed booking — not anonymous submissions." },
              { icon: "📱", title: "Everything in one place", desc: "Book, confirm, pay, and review — all through the platform. Full record of every job you've ever had done." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl">
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to find a reliable tradesperson?</h2>
          <p className="text-blue-100 mb-7">No more Facebook posts. No more waiting. Book a verified pro today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-white text-blue-600 font-semibold px-7 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
              Create Free Account
            </Link>
            <Link href="/trades" className="border-2 border-white/50 text-white font-semibold px-7 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Browse Tradespeople
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

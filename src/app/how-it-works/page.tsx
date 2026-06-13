import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Browse Trades",
    description: "Explore our 12+ trade categories from electrical and plumbing to HVAC and landscaping. Each category shows you verified professionals ready to work.",
  },
  {
    number: "02",
    icon: "👷",
    title: "Choose Your Pro",
    description: "Review professional profiles including ratings, years of experience, completed jobs, skills, and hourly rates. Read real reviews from past customers.",
  },
  {
    number: "03",
    icon: "📅",
    title: "Pick a Time",
    description: "View the professional's real-time availability calendar. Select a date and time slot that works best for you — no back-and-forth phone calls needed.",
  },
  {
    number: "04",
    icon: "📋",
    title: "Describe the Job",
    description: "Tell us what needs to be done, provide your address, and add any special instructions. The more detail you provide, the better we can match you.",
  },
  {
    number: "05",
    icon: "✅",
    title: "Get Confirmed",
    description: "Your professional reviews the request and confirms within hours. You'll receive a notification as soon as your booking is accepted.",
  },
  {
    number: "06",
    icon: "⭐",
    title: "Rate & Review",
    description: "After the job is done, rate your experience and leave a review. Your feedback helps maintain quality and helps others find the best pros.",
  },
];

const faqs = [
  {
    q: "Are all professionals background checked?",
    a: "Yes. All verified professionals on TradePro undergo a thorough background check, license verification, and skills assessment before being listed on our platform.",
  },
  {
    q: "What if I'm not satisfied with the work?",
    a: "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team within 24 hours and we'll make it right — including a refund if necessary.",
  },
  {
    q: "How is pricing determined?",
    a: "Each professional sets their own hourly rate, which is displayed upfront on their profile. You'll see the exact cost before confirming your booking — no hidden fees.",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "Yes. You can cancel or request to reschedule up to 24 hours before the appointment. Cancellations within 24 hours may be subject to a small fee.",
  },
  {
    q: "How do I become a professional on TradePro?",
    a: "Register as a Pro, submit your license and credentials, complete our background check, and set up your profile. Our team reviews applications within 2-3 business days.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How TradePro Works</h1>
          <p className="text-lg text-gray-300">
            Getting professional help has never been easier. Follow these simple steps to book your first pro.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
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

      {/* Trust signals */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Trust TradePro?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "Verified Pros", desc: "Every professional is background checked and license verified before joining." },
              { icon: "💰", title: "Transparent Pricing", desc: "No hidden fees. See exact rates upfront before you book." },
              { icon: "🌟", title: "Satisfaction Guarantee", desc: "Not happy? We'll make it right or give you a full refund." },
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
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-blue-100 mb-7">Join thousands of homeowners who trust TradePro.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-white text-blue-600 font-semibold px-7 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
              Create Free Account
            </Link>
            <Link href="/trades" className="border-2 border-white/50 text-white font-semibold px-7 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Browse Trades
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

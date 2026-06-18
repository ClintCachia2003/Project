import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Verifix</h1>
          <p className="text-blue-200 text-lg">
            We built Verifix because finding a reliable tradesperson in Malta shouldn&apos;t require posting on a Facebook group and hoping for the best.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The problem we&apos;re solving</h2>
          <p className="text-gray-600 leading-relaxed">
            Anyone who has owned a home in Malta knows the drill. Pipe bursts on a Saturday morning. You post on a Facebook group. You get fifteen different names from fifteen different people, none of them verifiable. You call three numbers — two don&apos;t answer, one gives you a price over the phone with no written commitment. A stranger shows up, and you have no idea if they&apos;re licensed, insured, or if the price they quoted will match what they charge at the end.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            That&apos;s not good enough for a service that involves letting people into your home, trusting them with your property, and paying them for skilled work.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What we do differently</h2>
          <p className="text-gray-600 leading-relaxed">
            Every tradesperson on Verifix has been personally vetted before they appear in search results. Not algorithmically. Not through a form. Our team personally checks their identity, validates their trade licence with the relevant Maltese authority, confirms their public liability insurance is active, and contacts their professional references directly.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Pricing is agreed upfront before a tradesperson arrives. Reviews come only from verified completed jobs on the platform. There is full accountability on both sides — customers and tradespeople are rated after every booking.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Who we built this for</h2>
          <p className="text-gray-600 leading-relaxed">
            Verifix is built for the Maltese homeowner — whether you&apos;re in Sliema, Naxxar, Żebbuġ, or Gozo — who just wants a reliable person to show up, do the job properly, and charge a fair price. And for the skilled tradesperson who is fed up competing with unlicensed workers undercutting them, and wants a platform that rewards quality and professionalism.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <p className="text-blue-900 font-semibold mb-2">Want to join the platform?</p>
          <p className="text-sm text-blue-700 mb-4">Whether you need a tradesperson or you are one, we&apos;d love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/trades" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm text-center">
              Find a Tradesperson
            </Link>
            <Link href="/apply" className="border border-blue-300 text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-sm text-center">
              Apply as a Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

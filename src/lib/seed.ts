import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const trades = [
  { name: "Carpentry", slug: "carpentry", description: "Expert woodworking, furniture assembly, framing, and custom cabinetry services", icon: "🔨", color: "#D97706" },
  { name: "Electrical", slug: "electrical", description: "Licensed electricians for wiring, panel upgrades, outlets, and lighting installations", icon: "⚡", color: "#EAB308" },
  { name: "Plumbing", slug: "plumbing", description: "Pipe repairs, drain cleaning, water heater installation, and fixture replacement", icon: "🔧", color: "#3B82F6" },
  { name: "HVAC", slug: "hvac", description: "Heating, ventilation, and air conditioning installation, repair, and maintenance", icon: "❄️", color: "#06B6D4" },
  { name: "Painting", slug: "painting", description: "Interior and exterior painting, drywall repair, and surface preparation", icon: "🎨", color: "#8B5CF6" },
  { name: "Roofing", slug: "roofing", description: "Roof installation, repair, inspection, and gutter services", icon: "🏠", color: "#6B7280" },
  { name: "Landscaping", slug: "landscaping", description: "Lawn care, tree trimming, garden design, and irrigation systems", icon: "🌿", color: "#22C55E" },
  { name: "Masonry", slug: "masonry", description: "Brick laying, concrete work, stone installation, and retaining walls", icon: "🧱", color: "#F97316" },
  { name: "Flooring", slug: "flooring", description: "Hardwood, tile, laminate, and carpet installation and refinishing", icon: "🪵", color: "#A16207" },
  { name: "Mechanics", slug: "mechanics", description: "Vehicle repair, maintenance, diagnostics, and mobile mechanic services", icon: "🚗", color: "#DC2626" },
  { name: "Pest Control", slug: "pest-control", description: "Inspection, extermination, and prevention for all types of pests", icon: "🐛", color: "#7C3AED" },
  { name: "Cleaning", slug: "cleaning", description: "Deep cleaning, move-in/out cleaning, and recurring home cleaning services", icon: "✨", color: "#0891B2" },
];

const workerData = [
  {
    name: "Mike Thompson",
    email: "mike.t@tradepro.com",
    trade: "carpentry",
    bio: "Master carpenter with over 15 years of experience in custom woodworking and home renovations. Specializing in kitchen cabinets, decks, and structural framing.",
    hourlyRate: 75,
    yearsExperience: 15,
    licenseNumber: "CARP-2024-001",
    isVerified: true,
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 234,
    skills: ["Custom Cabinets", "Deck Building", "Framing", "Furniture Assembly", "Trim Work"],
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@tradepro.com",
    trade: "electrical",
    bio: "Licensed electrician with expertise in residential and commercial wiring. Safety-focused with a perfect track record.",
    hourlyRate: 90,
    yearsExperience: 12,
    licenseNumber: "ELEC-2024-082",
    isVerified: true,
    rating: 4.8,
    reviewCount: 98,
    completedJobs: 189,
    skills: ["Panel Upgrades", "EV Charger Installation", "Smart Home Wiring", "Outlet Repair", "Lighting"],
  },
  {
    name: "Carlos Rivera",
    email: "carlos.r@tradepro.com",
    trade: "plumbing",
    bio: "Certified master plumber offering same-day service for emergencies. From leaky faucets to full bathroom remodels.",
    hourlyRate: 85,
    yearsExperience: 18,
    licenseNumber: "PLMB-2024-045",
    isVerified: true,
    rating: 4.7,
    reviewCount: 156,
    completedJobs: 312,
    skills: ["Emergency Repairs", "Drain Cleaning", "Water Heater", "Bathroom Remodel", "Gas Lines"],
  },
  {
    name: "David Kim",
    email: "david.k@tradepro.com",
    trade: "hvac",
    bio: "HVAC technician certified for all major brands. Energy efficiency expert helping you save on utility bills.",
    hourlyRate: 95,
    yearsExperience: 10,
    licenseNumber: "HVAC-2024-119",
    isVerified: true,
    rating: 4.9,
    reviewCount: 84,
    completedJobs: 145,
    skills: ["AC Installation", "Furnace Repair", "Duct Cleaning", "Heat Pumps", "Smart Thermostats"],
  },
  {
    name: "Emma Wilson",
    email: "emma.w@tradepro.com",
    trade: "painting",
    bio: "Professional painter with an eye for detail. Interior and exterior expert using eco-friendly, premium paints.",
    hourlyRate: 60,
    yearsExperience: 8,
    licenseNumber: null,
    isVerified: true,
    rating: 4.8,
    reviewCount: 201,
    completedJobs: 278,
    skills: ["Interior Painting", "Exterior Painting", "Wallpaper Removal", "Color Consulting", "Cabinet Painting"],
  },
  {
    name: "James Martinez",
    email: "james.m@tradepro.com",
    trade: "roofing",
    bio: "Licensed roofing contractor specializing in asphalt shingles, metal roofing, and flat roofs. Free inspections.",
    hourlyRate: 80,
    yearsExperience: 20,
    licenseNumber: "ROOF-2024-033",
    isVerified: true,
    rating: 4.6,
    reviewCount: 73,
    completedJobs: 156,
    skills: ["Shingle Replacement", "Metal Roofing", "Flat Roof", "Gutter Installation", "Leak Repair"],
  },
  {
    name: "Lisa Green",
    email: "lisa.g@tradepro.com",
    trade: "landscaping",
    bio: "Certified landscape designer transforming ordinary yards into stunning outdoor living spaces.",
    hourlyRate: 65,
    yearsExperience: 9,
    licenseNumber: "LAND-2024-067",
    isVerified: true,
    rating: 4.9,
    reviewCount: 118,
    completedJobs: 203,
    skills: ["Lawn Care", "Garden Design", "Irrigation", "Tree Trimming", "Hardscaping"],
  },
  {
    name: "Tony Russo",
    email: "tony.r@tradepro.com",
    trade: "mechanics",
    bio: "ASE-certified master mechanic offering mobile repair services. I come to you — no tow truck needed.",
    hourlyRate: 85,
    yearsExperience: 16,
    licenseNumber: "MECH-2024-091",
    isVerified: true,
    rating: 4.7,
    reviewCount: 89,
    completedJobs: 167,
    skills: ["Engine Repair", "Brake Service", "Oil Changes", "Diagnostics", "Transmission"],
  },
];

export async function seedDatabase() {
  // Check if already seeded
  const existingTrades = await prisma.trade.count();
  if (existingTrades > 0) return;

  // Create trades
  const createdTrades: Record<string, string> = {};
  for (const trade of trades) {
    const created = await prisma.trade.create({ data: trade });
    createdTrades[trade.slug] = created.id;
  }

  // Create workers
  const password = await bcrypt.hash("Password123!", 10);

  for (const worker of workerData) {
    const user = await prisma.user.create({
      data: {
        name: worker.name,
        email: worker.email,
        password,
        role: "worker",
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });

    const workerRecord = await prisma.worker.create({
      data: {
        userId: user.id,
        tradeId: createdTrades[worker.trade],
        bio: worker.bio,
        hourlyRate: worker.hourlyRate,
        yearsExperience: worker.yearsExperience,
        licenseNumber: worker.licenseNumber,
        isVerified: worker.isVerified,
        isAvailable: true,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        completedJobs: worker.completedJobs,
        skills: JSON.stringify(worker.skills),
      },
    });

    // Add availability Mon-Fri 8am-6pm, Sat 9am-3pm
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.create({
        data: {
          workerId: workerRecord.id,
          dayOfWeek: day,
          startTime: "08:00",
          endTime: "18:00",
          isActive: true,
        },
      });
    }
    await prisma.availability.create({
      data: {
        workerId: workerRecord.id,
        dayOfWeek: 6,
        startTime: "09:00",
        endTime: "15:00",
        isActive: true,
      },
    });
  }

  // Create a demo customer
  await prisma.user.create({
    data: {
      name: "Alex Demo",
      email: "demo@tradepro.com",
      password: await bcrypt.hash("demo1234", 10),
      role: "customer",
      phone: "+1 (555) 000-1234",
    },
  });
}

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
  // Carpentry
  {
    name: "Mike Thompson", email: "mike.t@tradepro.com", trade: "carpentry",
    bio: "Master carpenter with 15+ years in custom woodworking and home renovations. Specializing in kitchen cabinets, decks, and structural framing.",
    hourlyRate: 75, yearsExperience: 15, licenseNumber: "CARP-2024-001", isVerified: true,
    rating: 4.9, reviewCount: 127, completedJobs: 234,
    skills: ["Custom Cabinets", "Deck Building", "Framing", "Furniture Assembly", "Trim Work"],
  },
  {
    name: "Brian Cole", email: "brian.c@tradepro.com", trade: "carpentry",
    bio: "Skilled finish carpenter focused on bespoke cabinetry and detailed woodwork. Every project is treated like it's for my own home.",
    hourlyRate: 65, yearsExperience: 9, licenseNumber: "CARP-2024-022", isVerified: true,
    rating: 4.7, reviewCount: 54, completedJobs: 98,
    skills: ["Finish Carpentry", "Crown Molding", "Baseboards", "Door Hanging", "Shelving"],
  },
  // Electrical
  {
    name: "Sarah Johnson", email: "sarah.j@tradepro.com", trade: "electrical",
    bio: "Licensed electrician with expertise in residential and commercial wiring. Safety-focused with a perfect track record.",
    hourlyRate: 90, yearsExperience: 12, licenseNumber: "ELEC-2024-082", isVerified: true,
    rating: 4.8, reviewCount: 98, completedJobs: 189,
    skills: ["Panel Upgrades", "EV Charger Installation", "Smart Home Wiring", "Outlet Repair", "Lighting"],
  },
  {
    name: "Derek Watts", email: "derek.w@tradepro.com", trade: "electrical",
    bio: "Experienced residential electrician specializing in troubleshooting and smart home automation. Available for same-day emergencies.",
    hourlyRate: 85, yearsExperience: 8, licenseNumber: "ELEC-2024-091", isVerified: true,
    rating: 4.6, reviewCount: 61, completedJobs: 112,
    skills: ["Fault Finding", "Smart Home", "Rewiring", "Security Lighting", "Generator Hookup"],
  },
  // Plumbing
  {
    name: "Carlos Rivera", email: "carlos.r@tradepro.com", trade: "plumbing",
    bio: "Certified master plumber offering same-day service for emergencies. From leaky faucets to full bathroom remodels.",
    hourlyRate: 85, yearsExperience: 18, licenseNumber: "PLMB-2024-045", isVerified: true,
    rating: 4.7, reviewCount: 156, completedJobs: 312,
    skills: ["Emergency Repairs", "Drain Cleaning", "Water Heater", "Bathroom Remodel", "Gas Lines"],
  },
  {
    name: "Nina Patel", email: "nina.p@tradepro.com", trade: "plumbing",
    bio: "Fully licensed plumber with a specialty in eco-friendly fixtures and water-saving solutions. Residential and light commercial.",
    hourlyRate: 80, yearsExperience: 7, licenseNumber: "PLMB-2024-077", isVerified: true,
    rating: 4.8, reviewCount: 43, completedJobs: 76,
    skills: ["Eco Fixtures", "Leak Detection", "Pipe Relining", "Bathroom Install", "Backflow Prevention"],
  },
  // HVAC
  {
    name: "David Kim", email: "david.k@tradepro.com", trade: "hvac",
    bio: "HVAC technician certified for all major brands. Energy efficiency expert helping you save on utility bills.",
    hourlyRate: 95, yearsExperience: 10, licenseNumber: "HVAC-2024-119", isVerified: true,
    rating: 4.9, reviewCount: 84, completedJobs: 145,
    skills: ["AC Installation", "Furnace Repair", "Duct Cleaning", "Heat Pumps", "Smart Thermostats"],
  },
  {
    name: "Gina Morales", email: "gina.m@tradepro.com", trade: "hvac",
    bio: "HVAC specialist with a focus on commercial refrigeration and HVAC system design. Clean, efficient, and always on time.",
    hourlyRate: 90, yearsExperience: 6, licenseNumber: "HVAC-2024-203", isVerified: false,
    rating: 4.5, reviewCount: 29, completedJobs: 58,
    skills: ["Commercial HVAC", "Refrigeration", "System Design", "Preventive Maintenance", "Ductless Mini-Split"],
  },
  // Painting
  {
    name: "Emma Wilson", email: "emma.w@tradepro.com", trade: "painting",
    bio: "Professional painter with an eye for detail. Interior and exterior expert using eco-friendly, premium paints.",
    hourlyRate: 60, yearsExperience: 8, licenseNumber: null, isVerified: true,
    rating: 4.8, reviewCount: 201, completedJobs: 278,
    skills: ["Interior Painting", "Exterior Painting", "Wallpaper Removal", "Color Consulting", "Cabinet Painting"],
  },
  {
    name: "Leo Nguyen", email: "leo.n@tradepro.com", trade: "painting",
    bio: "Faux finish and decorative paint specialist. I bring artistic flair to every room — from simple accent walls to full murals.",
    hourlyRate: 70, yearsExperience: 11, licenseNumber: null, isVerified: true,
    rating: 4.9, reviewCount: 88, completedJobs: 134,
    skills: ["Faux Finish", "Decorative Painting", "Murals", "Venetian Plaster", "Stenciling"],
  },
  // Roofing
  {
    name: "James Martinez", email: "james.m@tradepro.com", trade: "roofing",
    bio: "Licensed roofing contractor specializing in asphalt shingles, metal roofing, and flat roofs. Free inspections included.",
    hourlyRate: 80, yearsExperience: 20, licenseNumber: "ROOF-2024-033", isVerified: true,
    rating: 4.6, reviewCount: 73, completedJobs: 156,
    skills: ["Shingle Replacement", "Metal Roofing", "Flat Roof", "Gutter Installation", "Leak Repair"],
  },
  {
    name: "Rachel Stone", email: "rachel.s@tradepro.com", trade: "roofing",
    bio: "Certified roofing specialist focusing on storm damage repairs and insurance claims assistance. Fast, reliable, and honest.",
    hourlyRate: 75, yearsExperience: 7, licenseNumber: "ROOF-2024-088", isVerified: true,
    rating: 4.7, reviewCount: 38, completedJobs: 67,
    skills: ["Storm Damage", "Insurance Claims", "Ridge Vents", "Soffit & Fascia", "Skylights"],
  },
  // Landscaping
  {
    name: "Lisa Green", email: "lisa.g@tradepro.com", trade: "landscaping",
    bio: "Certified landscape designer transforming ordinary yards into stunning outdoor living spaces.",
    hourlyRate: 65, yearsExperience: 9, licenseNumber: "LAND-2024-067", isVerified: true,
    rating: 4.9, reviewCount: 118, completedJobs: 203,
    skills: ["Lawn Care", "Garden Design", "Irrigation", "Tree Trimming", "Hardscaping"],
  },
  {
    name: "Sam Brooks", email: "sam.b@tradepro.com", trade: "landscaping",
    bio: "Passionate about sustainable landscaping. I design and maintain gardens that are beautiful and environmentally friendly.",
    hourlyRate: 60, yearsExperience: 5, licenseNumber: null, isVerified: false,
    rating: 4.5, reviewCount: 22, completedJobs: 41,
    skills: ["Native Plants", "Xeriscaping", "Composting", "Lawn Aeration", "Mulching"],
  },
  // Masonry
  {
    name: "Frank DiNapoli", email: "frank.d@tradepro.com", trade: "masonry",
    bio: "Third-generation mason with unmatched skill in brick, block, and stone work. From retaining walls to full chimneys.",
    hourlyRate: 85, yearsExperience: 22, licenseNumber: "MASO-2024-011", isVerified: true,
    rating: 4.8, reviewCount: 64, completedJobs: 138,
    skills: ["Brickwork", "Concrete Block", "Stone Walls", "Chimney Repair", "Patio Pavers"],
  },
  {
    name: "Carla Espinoza", email: "carla.e@tradepro.com", trade: "masonry",
    bio: "Specializing in decorative concrete and modern stone finishes. Perfect for driveways, walkways, and outdoor kitchens.",
    hourlyRate: 75, yearsExperience: 8, licenseNumber: "MASO-2024-055", isVerified: true,
    rating: 4.6, reviewCount: 31, completedJobs: 59,
    skills: ["Decorative Concrete", "Stamped Concrete", "Stone Veneer", "Outdoor Kitchens", "Retaining Walls"],
  },
  // Flooring
  {
    name: "Tim Hargrove", email: "tim.h@tradepro.com", trade: "flooring",
    bio: "Flooring expert with 14 years in hardwood, tile, and LVP installation. Precision cuts, clean installs, zero mess left behind.",
    hourlyRate: 70, yearsExperience: 14, licenseNumber: null, isVerified: true,
    rating: 4.8, reviewCount: 92, completedJobs: 174,
    skills: ["Hardwood", "LVP", "Tile", "Carpet", "Subfloor Repair"],
  },
  {
    name: "Yuki Tanaka", email: "yuki.t@tradepro.com", trade: "flooring",
    bio: "Specializing in heated flooring systems and luxury tile installations. Your floors are the foundation of your home — let me make them stunning.",
    hourlyRate: 80, yearsExperience: 6, licenseNumber: null, isVerified: true,
    rating: 4.7, reviewCount: 47, completedJobs: 83,
    skills: ["Radiant Heat", "Porcelain Tile", "Mosaic", "Epoxy Floors", "Hardwood Refinishing"],
  },
  // Mechanics
  {
    name: "Tony Russo", email: "tony.r@tradepro.com", trade: "mechanics",
    bio: "ASE-certified master mechanic offering mobile repair services. I come to you — no tow truck needed.",
    hourlyRate: 85, yearsExperience: 16, licenseNumber: "MECH-2024-091", isVerified: true,
    rating: 4.7, reviewCount: 89, completedJobs: 167,
    skills: ["Engine Repair", "Brake Service", "Oil Changes", "Diagnostics", "Transmission"],
  },
  {
    name: "Amara Osei", email: "amara.o@tradepro.com", trade: "mechanics",
    bio: "Specialist in European and hybrid vehicles. Full diagnostic capabilities and same-day minor repairs available.",
    hourlyRate: 90, yearsExperience: 10, licenseNumber: "MECH-2024-104", isVerified: true,
    rating: 4.8, reviewCount: 52, completedJobs: 96,
    skills: ["European Cars", "Hybrid Systems", "EV Maintenance", "AC Recharge", "Suspension"],
  },
  // Pest Control
  {
    name: "Victor Cruz", email: "victor.c@tradepro.com", trade: "pest-control",
    bio: "Licensed pest control specialist with expertise in residential and commercial extermination. Eco-safe treatments always offered.",
    hourlyRate: 65, yearsExperience: 11, licenseNumber: "PEST-2024-036", isVerified: true,
    rating: 4.7, reviewCount: 74, completedJobs: 149,
    skills: ["Termite Treatment", "Rodent Control", "Bed Bugs", "Ant Extermination", "Mosquito Control"],
  },
  {
    name: "Holly Bennett", email: "holly.b@tradepro.com", trade: "pest-control",
    bio: "Integrated pest management professional focusing on prevention-first solutions. Child and pet safe methods available.",
    hourlyRate: 60, yearsExperience: 5, licenseNumber: "PEST-2024-072", isVerified: true,
    rating: 4.8, reviewCount: 33, completedJobs: 61,
    skills: ["IPM Methods", "Bee Removal", "Wildlife Exclusion", "Cockroach Control", "Preventive Sealing"],
  },
  // Cleaning
  {
    name: "Maria Santos", email: "maria.s@tradepro.com", trade: "cleaning",
    bio: "Professional cleaner providing detailed home cleaning services for over 10 years. Trusted, reliable, and thorough every time.",
    hourlyRate: 45, yearsExperience: 10, licenseNumber: null, isVerified: true,
    rating: 4.9, reviewCount: 231, completedJobs: 412,
    skills: ["Deep Cleaning", "Move-In/Out", "Kitchen Detail", "Bathroom Sanitizing", "Window Cleaning"],
  },
  {
    name: "Jordan Fields", email: "jordan.f@tradepro.com", trade: "cleaning",
    bio: "Commercial and residential cleaning professional. I use only non-toxic, green-certified products — safe for kids, pets, and the planet.",
    hourlyRate: 50, yearsExperience: 6, licenseNumber: null, isVerified: false,
    rating: 4.6, reviewCount: 58, completedJobs: 107,
    skills: ["Green Cleaning", "Post-Construction", "Carpet Shampooing", "Office Cleaning", "Hoarder Cleanup"],
  },
];

export async function seedDatabase() {
  const existingTrades = await prisma.trade.count();
  if (existingTrades > 0) return;

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@TradePro1", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@tradepro.com",
      password: adminPassword,
      role: "admin",
      phone: "+1 (555) 000-0000",
    },
  });

  // Create demo customer
  await prisma.user.create({
    data: {
      name: "Alex Demo",
      email: "demo@tradepro.com",
      password: await bcrypt.hash("demo1234", 10),
      role: "customer",
      phone: "+1 (555) 000-1234",
    },
  });

  // Create trades
  const tradeMap: Record<string, string> = {};
  for (const trade of trades) {
    const created = await prisma.trade.create({ data: trade });
    tradeMap[trade.slug] = created.id;
  }

  const workerPassword = await bcrypt.hash("Worker@123", 10);

  for (const w of workerData) {
    const user = await prisma.user.create({
      data: {
        name: w.name,
        email: w.email,
        password: workerPassword,
        role: "worker",
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    });

    const workerRecord = await prisma.worker.create({
      data: {
        userId: user.id,
        tradeId: tradeMap[w.trade],
        bio: w.bio,
        hourlyRate: w.hourlyRate,
        yearsExperience: w.yearsExperience,
        licenseNumber: w.licenseNumber ?? null,
        isVerified: w.isVerified,
        isAvailable: true,
        rating: w.rating,
        reviewCount: w.reviewCount,
        completedJobs: w.completedJobs,
        skills: JSON.stringify(w.skills),
      },
    });

    // Mon–Fri 8am–6pm
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.create({
        data: { workerId: workerRecord.id, dayOfWeek: day, startTime: "08:00", endTime: "18:00", isActive: true },
      });
    }
    // Saturday 9am–3pm
    await prisma.availability.create({
      data: { workerId: workerRecord.id, dayOfWeek: 6, startTime: "09:00", endTime: "15:00", isActive: true },
    });
  }
}

import { ClientProfile, CandidateProfile } from "../types";

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: "client-1",
    name: "Priya Sharma",
    age: 28,
    city: "Mumbai",
    profession: "Senior Product Manager",
    education: "IIT Bombay",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    dealBreakers: {
      smoking: "NON_SMOKER", // absolute hard block
      drinking: "NO_REGULAR",
      children: "MUST_WANT_CHILDREN", // absolute hard block
      ageRange: [27, 31],
      allowedCities: ["Mumbai"],
      dietPreference: "VEGETARIAN",
      mustBeVegetarian: false,
    },
    softPreferences: {
      heightPreference: "5'8\"+",
      interests: ["Trekking", "Startup Strategy", "Contemporary Art", "Filter Coffee"],
      communicationStyle: "Direct, thoughtful, ambitious",
    },
    bioSummary: "Building high-impact consumer products. Values emotional intelligence, grounded ambition, and quiet weekends in Bandra.",
    assignedMatchmaker: "Matchmaker B",
  },
  {
    id: "client-2",
    name: "Rohan Mehta",
    age: 31,
    city: "Bangalore",
    profession: "Fintech Co-Founder",
    education: "BITS Pilani",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    dealBreakers: {
      smoking: "NON_SMOKER",
      drinking: "NON_DRINKER", // strict non-drinker
      children: "MUST_WANT_CHILDREN",
      ageRange: [26, 31],
      allowedCities: ["Bangalore", "Mumbai"],
      dietPreference: "ANY",
      mustBeVegetarian: false,
    },
    softPreferences: {
      interests: ["Marathon Running", "Early Stage Investing", "Podcasts", "Philosophy"],
      communicationStyle: "Calm, intellectual, values clarity",
    },
    bioSummary: "Second-time founder. Lives a disciplined, healthy lifestyle. Looking for an equal partner with intellectual curiosity and personal warmth.",
    assignedMatchmaker: "Matchmaker A",
  },
  {
    id: "client-3",
    name: "Ananya Iyer",
    age: 27,
    city: "Delhi NCR",
    profession: "Corporate Lawyer",
    education: "NLSIU Bangalore",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    dealBreakers: {
      smoking: "NON_SMOKER",
      drinking: "NO_REGULAR",
      children: "OPEN",
      ageRange: [27, 33],
      allowedCities: ["Delhi NCR"],
      dietPreference: "VEGETARIAN",
      mustBeVegetarian: true, // strict vegetarian
    },
    softPreferences: {
      interests: ["Classical Music", "Lit Fests", "Culinary Exploration", "Travel"],
      communicationStyle: "Witty, articulate, values depth",
    },
    bioSummary: "Litigation specialist at a tier-1 firm. Passionate about arts, literature, and good conversation over dinner.",
    assignedMatchmaker: "Matchmaker B",
  },
];

export const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    id: "cand-1",
    name: "Kabir Sen",
    age: 29,
    city: "Mumbai",
    profession: "Architect & Urban Designer",
    company: "Studio Mumbai",
    education: "CEPT University",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    habits: {
      smoking: "OCCASIONAL", // Will HARD FAIL Priya Sharma (Non-smoker deal breaker)
      drinking: "OCCASIONAL",
      children: "WANTS_CHILDREN",
      diet: "NON_VEGETARIAN",
    },
    interests: ["Urban Heritage", "Indie Cinema", "Vinyl Records", "Trekking"],
    bio: "Restoring heritage spaces across South Mumbai. Appreciates aesthetic craft, good filter coffee, and weekend treks in Sahyadris.",
    valuesPitch: "Matches Priya's passion for design and Mumbai heritage, but smokes socially on weekends with friends.",
  },
  {
    id: "cand-2",
    name: "Arjun Nair",
    age: 30,
    city: "Mumbai",
    profession: "VP of Engineering",
    company: "SaaS Unicorn",
    education: "IIT Delhi",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    habits: {
      smoking: "NON_SMOKER",
      drinking: "OCCASIONAL",
      children: "DOES_NOT_WANT", // Will HARD FAIL Priya Sharma (Must Want Children deal breaker)
      diet: "EGGETARIAN",
    },
    interests: ["Rock Climbing", "Open Source", "Sci-Fi Books", "Cycling"],
    bio: "Deep tech enthusiast, passionate about systems architecture. Believes in living light and travel flexibility; decided on a child-free life.",
    valuesPitch: "Outstanding career and lifestyle alignment, but child-free stance directly violates Priya's stated family vision.",
  },
  {
    id: "cand-3",
    name: "Vikram Malhotra",
    age: 34, // Outside Priya's range (27-31)
    city: "Mumbai",
    profession: "Investment Banker",
    company: "Global Bulge Bracket",
    education: "IIM Ahmedabad",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    habits: {
      smoking: "NON_SMOKER",
      drinking: "OCCASIONAL",
      children: "WANTS_CHILDREN",
      diet: "NON_VEGETARIAN",
    },
    interests: ["Squash", "Art Collecting", "Wine Tasting", "Economics"],
    bio: "Senior Director in M&A advisory. Travels frequently between Mumbai and London. Enjoys squash on Sunday mornings.",
    valuesPitch: "Mature and accomplished, but 34 exceeds Priya's preferred upper age bound of 31.",
  },
  {
    id: "cand-4",
    name: "Aditya Verma",
    age: 29, // Perfect fit for Priya (27-31)
    city: "Mumbai",
    profession: "Founder & CEO",
    company: "CleanTech Venture",
    education: "IIT Bombay",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    habits: {
      smoking: "NON_SMOKER", // PASS
      drinking: "OCCASIONAL", // PASS
      children: "WANTS_CHILDREN", // PASS
      diet: "VEGETARIAN", // PASS
    },
    interests: ["Trekking", "Sustainability", "Classical History", "Contemporary Art"],
    bio: "IIT Bombay alumnus building energy-efficient battery systems. Loves morning trail runs in Sanjay Gandhi National Park, reading historical fiction, and experimenting with South Indian cooking.",
    valuesPitch: "100% deal-breaker alignment. Shared IIT alumni community, shared love for trekking and Mumbai lifestyle. High long-term compatibility.",
  },
  {
    id: "cand-5",
    name: "Dev Patel",
    age: 29,
    city: "Bangalore",
    profession: "Data Science Director",
    company: "AI HealthTech",
    education: "IISc Bangalore",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    habits: {
      smoking: "NON_SMOKER",
      drinking: "OCCASIONAL", // Warns Rohan Mehta (strictly non-drinker)
      children: "WANTS_CHILDREN",
      diet: "VEGAN",
    },
    interests: ["Chess", "Bouldering", "Open Source AI", "Specialty Coffee"],
    bio: "AI researcher turned healthtech leader. Calm temperament, avid weekend chess player, loves exploring Bangalore's cafe roasters.",
    valuesPitch: "Strong intellectual profile, though occasional drinking requires confirmation against strict non-drinker preferences.",
  },
];

export const MOCK_REJECTION_PRESETS = [
  {
    id: "preset-dealbreaker",
    label: "Scenario 1: Missed Deal-Breaker (Operational Error)",
    sampleText: "Hi Matchmaker B, thanks for sharing Kabir's profile. He looks well-spoken and talented, but in his lifestyle section he mentions smoking when out with friends on weekends. I explicitly specified during our intake call that smoking is a complete, non-negotiable deal-breaker for me. Please do not send profiles who smoke, it feels like my checklist isn't being reviewed.",
    hint: "This accounts for the 35% preventable rejections in the 30-day assessment data.",
  },
  {
    id: "preset-revealed",
    label: "Scenario 2: Revealed Preference (Client Learning)",
    sampleText: "Hi team, I reviewed Vikram's profile. On paper he has everything I asked for—great education and non-smoker. But looking at his bio, he mentions traveling 3 weeks a month for M&A deals between London and Mumbai. I realized after reading this that I cannot do long-distance or a partner who is barely in town. I need someone who is physically in Mumbai on weekdays and weekends.",
    hint: "Reveals unstated lifestyle constraint. The tool automatically updates client preferences.",
  },
  {
    id: "preset-aesthetic",
    label: "Scenario 3: Aesthetic / Vibe Friction",
    sampleText: "Thanks for the profile. He seems accomplished and hits all my checklist items, but honestly I just didn't feel the spark or romantic vibe from his pictures. His photos feel a bit stiff and corporate. I'd prefer someone with warmer, more candid outdoor photos.",
    hint: "Soft aesthetic feedback that helps matchmakers calibrate visual presentation without narrowing filters.",
  },
];

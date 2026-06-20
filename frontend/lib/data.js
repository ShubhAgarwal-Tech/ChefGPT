import { Camera, BookOpen, ChefHat, Search } from "lucide-react";

export const SITE_STATS = [
  { label: "Free Scans", val: "10/mo" },
  { label: "Recipes Generated", val: "1M+" },
  { label: "Cost to Start", val: "$0" },
  { label: "App Store Rating", val: "4.9" },
];

export const FEATURES = [
  {
    title: "Scan Your Pantry",
    description:
      "Photo recognition that actually works. Know what you have instantly.",
    icon: Camera,
    limit: "10 scans/mo free",
  },
  {
    title: "AI Chef Suggestions",
    description:
      "Turn random ingredients into a gourmet meal. Zero food waste.",
    icon: ChefHat,
    limit: "5 meals/mo free",
  },
  {
    title: "Search Any Dish",
    description:
      "Find any recipe instantly. Filter by cuisine, time, or dietary needs.",
    icon: Search,
    limit: "Unlimited searches",
  },
  {
    title: "Digital Cookbook",
    description: "Save your favorites. Export as PDF. Share with family.",
    icon: BookOpen,
    limit: "3 saves/mo free",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Scan",
    desc: "Point camera at fridge. AI identifies ingredients.",
  },
  {
    step: "02",
    title: "Select",
    desc: "Choose a generated recipe based on your mood.",
  },
  {
    step: "03",
    title: "Savor",
    desc: "Follow simple steps. Eat delicious food.",
  },
];

// Helper function for category emojis
export function getCategoryEmoji(category) {
  const emojiMap = {
    Beef: "\u{1F969}",
    Chicken: "\u{1F357}",
    Dessert: "\u{1F370}",
    Lamb: "\u{1F356}",
    Miscellaneous: "\u{1F374}",
    Pasta: "\u{1F35D}",
    Pork: "\u{1F953}",
    Seafood: "\u{1F990}",
    Side: "\u{1F957}",
    Starter: "\u{1F95F}",
    Vegan: "\u{1F96C}",
    Vegetarian: "\u{1F955}",
    Breakfast: "\u{1F373}",
    Goat: "\u{1F410}",
  };
  return emojiMap[category] || "\u{1F37D}\uFE0F";
}

const CUISINE_COUNTRIES = {
  Afghan: "Afghanistan",
  Albanian: "Albania",
  Algerian: "Algeria",
  Andorran: "Andorra",
  Angolan: "Angola",
  "Antiguan, Barbudan": "Antigua and Barbuda",
  Argentine: "Argentina",
  Armenian: "Armenia",
  Aruban: "Aruba",
  Australian: "Australia",
  Austrian: "Austria",
  Azerbaijani: "Azerbaijan",
  Bahamian: "Bahamas",
  Bangladeshi: "Bangladesh",
  Barbadian: "Barbados",
  Cambodian: "Cambodia",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Egyptian: "Egypt",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Laotian: "Laos",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Dutch: "Netherlands",
  Norwegian: "Norway",
  Filipino: "Philippines",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  "Saudi Arabian": "Saudi Arabia",
  Slovak: "Slovakia",
  Slovakian: "Slovakia",
  Spanish: "Spain",
  Syrian: "Syria",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Turkey",
  Ukrainian: "Ukraine",
  British: "United Kingdom",
  American: "United States",
  Uruguayan: "Uruguay",
  Venezuelan: "Venezuela",
  Vietnamese: "Vietnam",
};

const COUNTRY_CODES = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  "Antigua and Barbuda": "AG",
  Argentina: "AR",
  Armenia: "AM",
  Aruba: "AW",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bangladesh: "BD",
  Barbados: "BB",
  Cambodia: "KH",
  Canada: "CA",
  China: "CN",
  Croatia: "HR",
  Egypt: "EG",
  France: "FR",
  Greece: "GR",
  India: "IN",
  Ireland: "IE",
  Italy: "IT",
  Jamaica: "JM",
  Japan: "JP",
  Kenya: "KE",
  Laos: "LA",
  Malaysia: "MY",
  Mexico: "MX",
  Morocco: "MA",
  Netherlands: "NL",
  Norway: "NO",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Russia: "RU",
  "Saudi Arabia": "SA",
  Slovakia: "SK",
  Spain: "ES",
  Syria: "SY",
  Thailand: "TH",
  Tunisia: "TN",
  Turkey: "TR",
  Ukraine: "UA",
  "United Kingdom": "GB",
  "United States": "US",
  Uruguay: "UY",
  Venezuela: "VE",
  Vietnam: "VN",
};

const codeToFlag = (code) =>
  code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );

const codeToTwemojiPath = (code) =>
  code
    .toUpperCase()
    .split("")
    .map((char) => (127397 + char.charCodeAt()).toString(16))
    .join("-");

// Helper function for country flags
export function getCountryFlag(country, countryName) {
  const resolvedCountry = countryName || CUISINE_COUNTRIES[country] || country;
  const code = COUNTRY_CODES[resolvedCountry];

  return code ? codeToFlag(code) : "\u{1F310}";
}

export function getCountryFlagEmojiUrl(country, countryName) {
  const resolvedCountry = countryName || CUISINE_COUNTRIES[country] || country;
  const code = COUNTRY_CODES[resolvedCountry];

  return code
    ? `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${codeToTwemojiPath(
        code
      )}.png`
    : null;
}

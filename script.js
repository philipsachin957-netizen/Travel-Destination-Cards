/* ==========================================================================
   TripMate — Interactive Frontend Application Logic
   Features:
   1. 5-Image Full-Page Hero Background Slider (5s interval, crossfade, pause/resume)
   2. Destination-Based Background Changes with Image Preloading & Fallback
   3. Case-Insensitive Destination Search, Category Filtering & Discovery Cards
   4. Live Weather Indication (OpenWeatherMap API + optional Open-Meteo live fallback)
   5. Weather-Based Travel Planner with Editable Day-by-Day Itinerary & Safety Notes
   6. Validated Passenger Count Input (+ / - Stepper, minimum 1)
   7. Passenger-Based Budget Estimator (INR ₹, fixed vs per-passenger cost breakdown)
   ========================================================================== */

// ===== 1. DEFAULT HERO BACKGROUND SLIDER (MAXIMUM 5 IMAGES) =====
const DEFAULT_HERO_SLIDES = [
  {
    id: "slide-mountains",
    photoId: "photo-1464822759023-fed622ff2c3b",
    caption: "THE GREAT OUTDOORS · ALPINE PEAKS & HIGHLANDS",
    fallbackGradient: "linear-gradient(135deg, #0f2e2a 0%, #1d4e47 50%, #2a635a 100%)"
  },
  {
    id: "slide-beach",
    photoId: "photo-1507525428034-b723cf961d3e",
    caption: "COASTAL HORIZONS · SUN-KISSED SHORES & BEACHES",
    fallbackGradient: "linear-gradient(135deg, #0d3b49 0%, #16697a 55%, #489fb5 100%)"
  },
  {
    id: "slide-forest",
    photoId: "photo-1511497584788-876760111969",
    caption: "EMERALD TRAILS · MISTY FORESTS & PLANTATIONS",
    fallbackGradient: "linear-gradient(135deg, #102a20 0%, #1e4d3b 55%, #2d6a4f 100%)"
  },
  {
    id: "slide-city",
    photoId: "photo-1502602898657-3e91760cbb34",
    caption: "TIMELESS CITIES · ICONIC ARCHITECTURE & CULTURE",
    fallbackGradient: "linear-gradient(135deg, #1d263b 0%, #2c3e5a 55%, #4a5d7c 100%)"
  },
  {
    id: "slide-backwaters",
    photoId: "photo-1602216056096-3b40cc0c9944",
    caption: "SERENE BACKWATERS · TROPICAL LAGOONS & PALMS",
    fallbackGradient: "linear-gradient(135deg, #0e382f 0%, #14594a 55%, #237a67 100%)"
  }
].slice(0, 5); // Strictly enforce maximum of 5 images

// ===== 2. DESTINATION CATALOG & MAPPING =====
const destinations = {
  manali: {
    key: "manali",
    name: "Manali",
    country: "Himachal Pradesh, India",
    regionGroup: "mountains",
    category: "MOUNTAIN ESCAPE",
    rating: "4.9",
    price: "₹5,000",
    basePerPerson: 5000,
    coords: { lat: 32.2432, lon: 77.1892 },
    description: "Snow-draped Himalayan peaks, cedar forests, winding mountain passes and crisp alpine air.",
    attractions: ["Solang Valley", "Hidimba Devi Temple", "Old Manali Cafés", "Rohtang Pass Viewpoints"],
    hero: "photo-1626621341517-bbf3d9990a23",
    image: "photo-1626621341517-bbf3d9990a23",
    costs: { stayNight: 2400, foodDay: 900, transportDay: 800, activityDay: 700, fixedFee: 500 }
  },
  kerala: {
    key: "kerala",
    name: "Kerala",
    country: "Kerala, India",
    regionGroup: "nature",
    category: "NATURE & CULTURE",
    rating: "4.9",
    price: "₹4,000",
    basePerPerson: 4000,
    coords: { lat: 9.4981, lon: 76.3388 },
    description: "Quiet palm-fringed backwaters, spice-scented hills, houseboats and tranquil coastal charm.",
    attractions: ["Alleppey Backwaters", "Munnar Tea Gardens", "Fort Kochi Heritage", "Kumarakom Bird Sanctuary"],
    hero: "photo-1602216056096-3b40cc0c9944",
    image: "photo-1602216056096-3b40cc0c9944",
    costs: { stayNight: 2200, foodDay: 850, transportDay: 700, activityDay: 650, fixedFee: 500 }
  },
  bali: {
    key: "bali",
    name: "Bali",
    country: "Indonesia",
    regionGroup: "beaches",
    category: "TROPICAL PARADISE",
    rating: "4.9",
    price: "₹25,000",
    basePerPerson: 25000,
    coords: { lat: -8.4095, lon: 115.1889 },
    description: "Emerald rice terraces, clifftop ocean temples, surf breaks and golden island sunsets.",
    attractions: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Ubud Sacred Monkey Forest", "Nusa Penida Coast"],
    hero: "photo-1537996194471-e657df975ab4",
    image: "photo-1537996194471-e657df975ab4",
    costs: { stayNight: 5500, foodDay: 1800, transportDay: 1400, activityDay: 1600, fixedFee: 1200 }
  },
  goa: {
    key: "goa",
    name: "Goa",
    country: "Goa, India",
    regionGroup: "beaches",
    category: "BEACH ESCAPE",
    rating: "4.8",
    price: "₹6,000",
    basePerPerson: 6000,
    coords: { lat: 15.2993, lon: 74.1240 },
    description: "Sun-drenched beaches, Portuguese heritage quarters, coastal cafés and Arabian Sea sunsets.",
    attractions: ["Palolem & Agonda Beaches", "Fontainhas Latin Quarter", "Chapora Fort Sunset", "Old Goa Basilicas"],
    hero: "photo-1512343879784-a960bf40e7f2",
    image: "photo-1512343879784-a960bf40e7f2",
    costs: { stayNight: 2800, foodDay: 1100, transportDay: 750, activityDay: 800, fixedFee: 500 }
  },
  coorg: {
    key: "coorg",
    name: "Coorg",
    country: "Karnataka, India",
    regionGroup: "nature",
    category: "GREEN GETAWAY",
    rating: "4.8",
    price: "₹3,500",
    basePerPerson: 3500,
    coords: { lat: 12.4244, lon: 75.7382 },
    description: "Aromatic coffee estates, misty Western Ghats ridges, waterfalls and quiet forest trails.",
    attractions: ["Abbey Falls", "Raja's Seat Viewpoint", "Dubare Elephant Camp", "Madikeri Coffee Estates"],
    hero: "photo-1511497584788-876760111969",
    image: "photo-1511497584788-876760111969",
    costs: { stayNight: 2000, foodDay: 750, transportDay: 650, activityDay: 550, fixedFee: 450 }
  },
  jaipur: {
    key: "jaipur",
    name: "Jaipur",
    country: "Rajasthan, India",
    regionGroup: "heritage",
    category: "ROYAL HERITAGE",
    rating: "4.9",
    price: "₹5,500",
    basePerPerson: 5500,
    coords: { lat: 26.9124, lon: 75.7873 },
    description: "Grand Rajput hilltop forts, rose-pink sandstone palaces, astronomical wonders and artisan bazaars.",
    attractions: ["Amber Fort", "Hawa Mahal", "City Palace & Jantar Mantar", "Johari & Bapu Bazaars"],
    hero: "photo-1599661046827-dacff0c0f09a",
    image: "photo-1599661046827-dacff0c0f09a",
    costs: { stayNight: 2500, foodDay: 900, transportDay: 700, activityDay: 850, fixedFee: 500 }
  },
  ladakh: {
    key: "ladakh",
    name: "Ladakh",
    country: "Ladakh, India",
    regionGroup: "mountains",
    category: "HIGH-ALTITUDE ADVENTURE",
    rating: "4.9",
    price: "₹12,000",
    basePerPerson: 12000,
    coords: { lat: 34.1526, lon: 77.5771 },
    description: "Dramatic high-altitude mountain passes, cobalt alpine lakes and centuries-old monasteries.",
    attractions: ["Pangong Tso Lake", "Nubra Valley Dunes", "Thiksey Monastery", "Shanti Stupa Leh"],
    hero: "photo-1566740933430-b5e70b06d2d5",
    image: "photo-1566740933430-b5e70b06d2d5",
    costs: { stayNight: 3200, foodDay: 1100, transportDay: 1600, activityDay: 1000, fixedFee: 800 }
  },
  paris: {
    key: "paris",
    name: "Paris",
    country: "France",
    regionGroup: "heritage",
    category: "CITY & CULTURE",
    rating: "4.9",
    price: "₹65,000",
    basePerPerson: 65000,
    coords: { lat: 48.8566, lon: 2.3522 },
    description: "Eiffel Tower panoramas, world-renowned art museums, Seine riverbanks and timeless Parisian cafés.",
    attractions: ["Eiffel Tower & Champ de Mars", "Louvre Museum", "Montmartre & Sacré-Cœur", "Seine River Promenade"],
    hero: "photo-1502602898657-3e91760cbb34",
    image: "photo-1502602898657-3e91760cbb34",
    costs: { stayNight: 14500, foodDay: 4800, transportDay: 2200, activityDay: 3500, fixedFee: 2500 }
  },
  ooty: {
    key: "ooty",
    name: "Ooty",
    country: "Tamil Nadu, India",
    regionGroup: "mountains",
    category: "HILLS & TEA GARDENS",
    rating: "4.8",
    price: "₹4,200",
    basePerPerson: 4200,
    coords: { lat: 11.4102, lon: 76.6950 },
    description: "Rolling Nilgiri hills, emerald tea plantations, botanical gardens and heritage mountain railways.",
    attractions: ["Nilgiri Mountain Toy Train", "Ooty Botanical Gardens", "Doddabetta Peak", " Coonoor Tea Estates"],
    hero: "photo-1544735716-392fe2489ffa",
    image: "photo-1544735716-392fe2489ffa",
    costs: { stayNight: 2100, foodDay: 800, transportDay: 700, activityDay: 600, fixedFee: 450 }
  },
  chennai: {
    key: "chennai",
    name: "Chennai",
    country: "Tamil Nadu, India",
    regionGroup: "beaches",
    category: "COASTAL HERITAGE CITY",
    rating: "4.7",
    price: "₹3,800",
    basePerPerson: 3800,
    coords: { lat: 13.0827, lon: 80.2707 },
    description: "Sweeping Marina Beach promenades, Dravidian temple architecture, classical arts and filter coffee culture.",
    attractions: ["Marina Beach Promenade", "Kapaleeshwarar Temple", "San Thome Basilica", "DakshinaChitra Heritage Museum"],
    hero: "photo-1582510003544-4d00b7f74220",
    image: "photo-1582510003544-4d00b7f74220",
    costs: { stayNight: 2200, foodDay: 800, transportDay: 600, activityDay: 550, fixedFee: 450 }
  },
  bengaluru: {
    key: "bengaluru",
    name: "Bengaluru",
    country: "Karnataka, India",
    regionGroup: "heritage",
    category: "GARDENS & METRO LIFE",
    rating: "4.8",
    price: "₹4,000",
    basePerPerson: 4000,
    coords: { lat: 12.9716, lon: 77.5946 },
    description: "Lush century-old botanical gardens, royal palace architecture, craft cafés and vibrant cultural neighborhoods.",
    attractions: ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "Visvesvaraya Science Museum"],
    hero: "photo-1596176530529-78163a4f7af2",
    image: "photo-1596176530529-78163a4f7af2",
    costs: { stayNight: 2400, foodDay: 950, transportDay: 650, activityDay: 650, fixedFee: 450 }
  }
};

// Weather-conditioned activity templates combined with destination landmarks
const WEATHER_ITINERARY_TEMPLATES = {
  sunny: {
    label: "Sunny / Clear",
    icon: "☀️",
    summary: "Ideal for outdoor sightseeing, nature walks, parks, beaches and golden-hour photography.",
    activities: (place) => [
      { day: "Day 1 · Morning", title: `Guided outdoor sightseeing at ${place.attractions[0] || place.name}`, note: "Sunny weather: carry sunglasses, sunscreen & water." },
      { day: "Day 1 · Afternoon", title: `Parks, gardens & scenic walking tour around ${place.attractions[1] || place.name}`, note: "Great natural light for outdoor photography." },
      { day: "Day 2 · Morning", title: `Waterfront / open-air exploration at ${place.attractions[2] || place.name}`, note: "Check local midday heat and shade stops." },
      { day: "Day 2 · Evening", title: `Golden-hour viewpoint & open-air dining near ${place.attractions[3] || place.name}`, note: "Subject to local access and closing hours." }
    ]
  },
  rainy: {
    label: "Rainy / Showers",
    icon: "🌧️",
    summary: "Focused on indoor cultural attractions, museums, covered arcades and cozy local cafés.",
    activities: (place) => [
      { day: "Day 1 · Morning", title: `Indoor museum, gallery or heritage hall near ${place.attractions[2] || place.name}`, note: "Rainy weather: sheltered cultural discovery." },
      { day: "Day 1 · Afternoon", title: `Regional culinary tasting & specialty café experience in ${place.name}`, note: "Warm local delicacies and indoor seating." },
      { day: "Day 2 · Morning", title: `Covered craft markets, shopping arcades & artisan studios in ${place.name}`, note: "Keep waterproof footwear and umbrella handy." },
      { day: "Day 2 · Afternoon", title: `Covered architectural sightseeing at ${place.attractions[1] || place.name}`, note: "Avoid slippery trails or flood-prone coastal zones." }
    ]
  },
  cloudy: {
    label: "Cloudy / Overcast",
    icon: "⛅",
    summary: "Comfortable overcast conditions for city exploration, heritage walks and vibrant local markets.",
    activities: (place) => [
      { day: "Day 1 · Morning", title: `Heritage walk & architectural exploration at ${place.attractions[0] || place.name}`, note: "Pleasant overcast skies; carry a light layer." },
      { day: "Day 1 · Afternoon", title: `Local bazaar & street culture stroll near ${place.attractions[1] || place.name}`, note: "Mild temperatures ideal for walking." },
      { day: "Day 2 · Morning", title: `City & neighborhood discovery around ${place.attractions[2] || place.name}`, note: "Flexible indoor/outdoor pacing." },
      { day: "Day 2 · Evening", title: `Scenic viewpoint visit at ${place.attractions[3] || place.name} (subject to visibility)`, note: "Verify local cloud cover and visibility before ascending." }
    ]
  },
  snowy: {
    label: "Cold / Snowy",
    icon: "❄️",
    summary: "Tailored for crisp mountain sightseeing, safe winter vistas, thermal layers and warm indoor retreats.",
    activities: (place) => [
      { day: "Day 1 · Morning", title: `Scenic mountain / winter sightseeing at ${place.attractions[0] || place.name}`, note: "Wear thermal layers, insulated boots & check road advisories." },
      { day: "Day 1 · Afternoon", title: `Warm indoor heritage attraction & local tea house near ${place.attractions[1] || place.name}`, note: "Midday warm-up break indoors." },
      { day: "Day 2 · Morning", title: `Safe winter valley vistas or supervised winter activity at ${place.attractions[2] || place.name}`, note: "Only proceed if local authorities confirm safe conditions." },
      { day: "Day 2 · Evening", title: `Fireside dining & pre-booked local transport around ${place.attractions[3] || place.name}`, note: "Use verified local drivers experienced with cold/snowy roads." }
    ]
  },
  unverified: {
    label: "Weather Unverified",
    icon: "🧭",
    summary: "General destination highlights (live weather not yet verified—check local forecast before outdoor plans).",
    activities: (place) => [
      { day: "Day 1 · Morning", title: `Signature landmark visit: ${place.attractions[0] || place.name}`, note: "Weather unverified — confirm local forecast before departure." },
      { day: "Day 1 · Afternoon", title: `Cultural & scenic exploration at ${place.attractions[1] || place.name}`, note: "Keep an indoor backup option ready." },
      { day: "Day 2 · Morning", title: `Local neighborhood & market discovery at ${place.attractions[2] || place.name}`, note: "Check local opening hours and weather." },
      { day: "Day 2 · Evening", title: `Relaxed evening experience near ${place.attractions[3] || place.name}`, note: "Verify local safety and transport availability." }
    ]
  }
};

// ===== APPLICATION STATE =====
const state = {
  currentSlideIndex: 0,
  sliderIntervalId: null,
  isDestinationBgActive: false,
  selectedDestinationKey: "manali",
  activeCategoryFilter: "all",
  passengerCount: 1,
  tripDays: 3,
  stayTierMultiplier: 1,
  customCosts: null,
  favorites: new Set(["manali"]),
  weather: {
    status: "unconfigured", // "live" | "unconfigured" | "error" | "simulated"
    category: "unverified", // "sunny" | "rainy" | "cloudy" | "snowy" | "unverified"
    tempC: null,
    humidity: null,
    windKmh: null,
    conditionText: "Live weather not connected",
    description: "Configure an OpenWeather API key or click 'Fetch Live Weather (Open-Meteo)' to load real-time conditions.",
    sourceLabel: "Weather Unverified",
    cache: {}
  },
  itineraryItems: []
};

// ===== DOM REFERENCES =====
const heroBg = document.getElementById("heroBg");
const heroLocationText = document.getElementById("heroLocationText");
const heroCount = document.getElementById("heroCount");
const sliderDotsContainer = document.getElementById("sliderDots");
const restoreSliderBtn = document.getElementById("restoreSliderBtn");

const searchForm = document.getElementById("searchForm");
const destinationInput = document.getElementById("destinationInput");
const departureInput = document.getElementById("departureInput");
const passengerCountInput = document.getElementById("passengerCountInput");
const passengerDecBtn = document.getElementById("passengerDecBtn");
const passengerIncBtn = document.getElementById("passengerIncBtn");
const passengerUnitLabel = document.getElementById("passengerUnitLabel");
const searchMessage = document.getElementById("searchMessage");

const destinationGrid = document.getElementById("destinationGrid");
const destinationHeading = document.getElementById("destinationHeading");
const destinationSubtitle = document.getElementById("destinationSubtitle");
const resultsCounter = document.getElementById("resultsCounter");
const resetDestinationsBtn = document.getElementById("resetDestinationsBtn");

// Weather DOM
const weatherStatusBadge = document.getElementById("weatherStatusBadge");
const weatherDestName = document.getElementById("weatherDestName");
const weatherDestCountry = document.getElementById("weatherDestCountry");
const weatherSummaryText = document.getElementById("weatherSummaryText");
const weatherIconLarge = document.getElementById("weatherIconLarge");
const weatherTempValue = document.getElementById("weatherTempValue");
const weatherConditionPill = document.getElementById("weatherConditionPill");
const weatherHumidityVal = document.getElementById("weatherHumidityVal");
const weatherWindVal = document.getElementById("weatherWindVal");
const weatherCategoryVal = document.getElementById("weatherCategoryVal");
const weatherNoticeBox = document.getElementById("weatherNoticeBox");
const fetchOpenMeteoBtn = document.getElementById("fetchOpenMeteoBtn");
const openWeatherKeyInput = document.getElementById("openWeatherKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

// Itinerary DOM
const itineraryWeatherBadge = document.getElementById("itineraryWeatherBadge");
const itinerarySafetyText = document.getElementById("itinerarySafetyText");
const itineraryList = document.getElementById("itineraryList");
const resetItineraryBtn = document.getElementById("resetItineraryBtn");
const addActivityForm = document.getElementById("addActivityForm");
const newActivityDay = document.getElementById("newActivityDay");
const newActivityTitle = document.getElementById("newActivityTitle");

// Budget Estimator DOM
const budgetDestinationSelect = document.getElementById("budgetDestinationSelect");
const budgetPassengersInput = document.getElementById("budgetPassengersInput");
const budgetDaysInput = document.getElementById("budgetDaysInput");
const budgetStayTier = document.getElementById("budgetStayTier");
const budgetTotalDisplay = document.getElementById("budgetTotalDisplay");
const budgetPerPersonDisplay = document.getElementById("budgetPerPersonDisplay");
const budgetBreakdownList = document.getElementById("budgetBreakdownList");
const customStayRate = document.getElementById("customStayRate");
const customFoodRate = document.getElementById("customFoodRate");
const customTransportRate = document.getElementById("customTransportRate");
const customActivityRate = document.getElementById("customActivityRate");
const customFixedFee = document.getElementById("customFixedFee");

// ===== HELPER FUNCTIONS =====
function imageUrl(photoId, width = 1400) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;
}

function formatINR(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return "₹" + rounded.toLocaleString("en-IN");
}

function createFallbackSvgDataUri(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#103832"/>
        <stop offset="100%" stop-color="#1b6b5d"/>
      </linearGradient>
    </defs>
    <rect width="900" height="600" fill="url(#g)"/>
    <circle cx="720" cy="140" r="55" fill="#f4c48c" fill-opacity="0.35"/>
    <path d="M0 450 L240 260 L440 410 L650 220 L900 430 L900 600 L0 600 Z" fill="#0d2b26" fill-opacity="0.55"/>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="30" font-weight="700">${label}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// ===== 1 & 2. HERO BACKGROUND SLIDER & DESTINATION OVERRIDE =====
let slideElements = [];
let destinationLayerEl = null;

function initHeroSlider() {
  heroBg.innerHTML = "";
  slideElements = [];

  DEFAULT_HERO_SLIDES.forEach((slide, index) => {
    const el = document.createElement("div");
    el.className = "hero-slide" + (index === 0 ? " active" : "");
    el.style.backgroundImage = `url("${imageUrl(slide.photoId, 2000)}"), ${slide.fallbackGradient}`;
    heroBg.appendChild(el);
    slideElements.push(el);
  });

  destinationLayerEl = document.createElement("div");
  destinationLayerEl.className = "hero-destination-layer";
  heroBg.appendChild(destinationLayerEl);

  if (sliderDotsContainer) {
    sliderDotsContainer.innerHTML = "";
    DEFAULT_HERO_SLIDES.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Show hero background slide ${index + 1}`);
      dot.addEventListener("click", () => {
        restoreDefaultSlider(index);
      });
      sliderDotsContainer.appendChild(dot);
    });
  }

  updateSlideUI(0);
  startHeroSliderTimer();
}

function updateSlideUI(index) {
  state.currentSlideIndex = index;
  slideElements.forEach((el, idx) => {
    el.classList.toggle("active", idx === index);
  });

  if (sliderDotsContainer) {
    const dots = sliderDotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index && !state.isDestinationBgActive);
    });
  }

  if (!state.isDestinationBgActive) {
    const slide = DEFAULT_HERO_SLIDES[index];
    heroLocationText.textContent = slide.caption;
    if (heroCount) {
      const currentStr = String(index + 1).padStart(2, "0");
      const totalStr = String(DEFAULT_HERO_SLIDES.length).padStart(2, "0");
      heroCount.innerHTML = `${currentStr} <span>/</span> ${totalStr}`;
    }
  }
}

function startHeroSliderTimer() {
  stopHeroSliderTimer();
  state.sliderIntervalId = window.setInterval(() => {
    if (state.isDestinationBgActive || document.hidden) return;
    const nextIndex = (state.currentSlideIndex + 1) % DEFAULT_HERO_SLIDES.length;
    updateSlideUI(nextIndex);
  }, 5000);
}

function stopHeroSliderTimer() {
  if (state.sliderIntervalId !== null) {
    window.clearInterval(state.sliderIntervalId);
    state.sliderIntervalId = null;
  }
}

function setDestinationHeroBackground(place) {
  state.isDestinationBgActive = true;
  stopHeroSliderTimer();

  const targetUrl = imageUrl(place.hero, 2000);
  const preloader = new Image();

  preloader.onload = () => {
    if (!state.isDestinationBgActive) return;
    destinationLayerEl.style.backgroundImage =
      `url("${targetUrl}"), linear-gradient(135deg, #103630, #1f5c52)`;
    destinationLayerEl.classList.add("active");
  };

  preloader.onerror = () => {
    // Retain a graceful fallback background if remote image fails
    destinationLayerEl.style.backgroundImage =
      `linear-gradient(135deg, #103630 0%, #1c584e 55%, #2b7a6c 100%)`;
    destinationLayerEl.classList.add("active");
  };

  preloader.src = targetUrl;

  heroLocationText.textContent = `${place.name.toUpperCase()} · ${place.country.toUpperCase()} · ${place.category}`;
  if (heroCount) {
    heroCount.innerHTML = `DEST <span>·</span> ${place.name.toUpperCase()}`;
  }
  if (restoreSliderBtn) {
    restoreSliderBtn.classList.add("visible");
  }
}

function restoreDefaultSlider(targetSlideIndex = state.currentSlideIndex) {
  state.isDestinationBgActive = false;
  if (destinationLayerEl) {
    destinationLayerEl.classList.remove("active");
  }
  if (restoreSliderBtn) {
    restoreSliderBtn.classList.remove("visible");
  }
  updateSlideUI(targetSlideIndex);
  startHeroSliderTimer();
}

// Pause background transitions when tab is hidden to prevent timer drift
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopHeroSliderTimer();
  } else if (!state.isDestinationBgActive) {
    startHeroSliderTimer();
  }
});

// ===== 3 & 4. DESTINATION DISCOVERY CARDS & SEARCH =====
function createDestinationCard(place) {
  const card = document.createElement("article");
  card.className = "destination-card" + (state.selectedDestinationKey === place.key ? " selected-card" : "");
  card.dataset.key = place.key;

  const imageWrapper = document.createElement("a");
  imageWrapper.className = "destination-image";
  imageWrapper.href = "#planner";
  imageWrapper.setAttribute("aria-label", `Explore and plan a trip to ${place.name}`);
  imageWrapper.addEventListener("click", (e) => {
    e.preventDefault();
    selectDestination(place.key, { scrollToPlanner: true, updateHeroBg: true });
  });

  const img = document.createElement("img");
  img.src = imageUrl(place.image, 900);
  img.alt = `${place.name}, ${place.country}`;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.src = createFallbackSvgDataUri(place.name);
  });

  const tag = document.createElement("span");
  tag.className = "image-tag";
  tag.textContent = place.category;

  const favBtn = document.createElement("button");
  favBtn.type = "button";
  const isFav = state.favorites.has(place.key);
  favBtn.className = "favorite" + (isFav ? " is-fav" : "");
  favBtn.setAttribute("aria-label", `Toggle favorite for ${place.name}`);
  favBtn.textContent = isFav ? "♥" : "♡";
  favBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state.favorites.has(place.key)) {
      state.favorites.delete(place.key);
    } else {
      state.favorites.add(place.key);
    }
    favBtn.classList.toggle("is-fav", state.favorites.has(place.key));
    favBtn.textContent = state.favorites.has(place.key) ? "♥" : "♡";
  });

  imageWrapper.append(img, tag, favBtn);

  const info = document.createElement("div");
  info.className = "destination-info";

  const meta = document.createElement("div");
  meta.className = "destination-meta";
  const locationSpan = document.createElement("span");
  locationSpan.textContent = `⌖ ${place.country}`;
  const ratingSpan = document.createElement("span");
  ratingSpan.textContent = `✦ ${place.rating}`;
  meta.append(locationSpan, ratingSpan);

  const title = document.createElement("h3");
  title.textContent = `${place.name}, ${place.country.split(",")[0]}`;

  const desc = document.createElement("p");
  desc.textContent = place.description;

  const attractionsWrap = document.createElement("div");
  attractionsWrap.className = "attraction-pills";
  (place.attractions || []).slice(0, 3).forEach((attr) => {
    const pill = document.createElement("span");
    pill.className = "attraction-pill";
    pill.textContent = attr;
    attractionsWrap.appendChild(pill);
  });

  const bottom = document.createElement("div");
  bottom.className = "destination-bottom";

  const priceBlock = document.createElement("div");
  const label = document.createElement("small");
  label.textContent = "Illustrative estimate from";
  const price = document.createElement("strong");
  price.textContent = `${place.price} `;
  const perPerson = document.createElement("small");
  perPerson.textContent = "/ person";
  price.appendChild(perPerson);
  priceBlock.append(label, price);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "card-actions";

  const selectBtn = document.createElement("button");
  selectBtn.type = "button";
  selectBtn.className = "select-dest-btn";
  selectBtn.textContent = state.selectedDestinationKey === place.key ? "Selected ✓" : "Select & Plan";
  selectBtn.addEventListener("click", () => {
    selectDestination(place.key, { scrollToPlanner: true, updateHeroBg: true });
  });

  actionsDiv.appendChild(selectBtn);
  bottom.append(priceBlock, actionsDiv);
  info.append(meta, title, desc, attractionsWrap, bottom);
  card.append(imageWrapper, info);

  return card;
}

function renderDestinationGrid(placesList, searchQueryText = "") {
  destinationGrid.innerHTML = "";

  if (!placesList.length) {
    const emptyBox = document.createElement("div");
    emptyBox.className = "empty-search-state";
    emptyBox.innerHTML = `
      <h3>No matching destination found for "${searchQueryText}"</h3>
      <p>We couldn't find that location in our curated catalog yet. Try searching for Manali, Kerala, Goa, Jaipur, Ooty, Chennai, Bengaluru, Coorg, Ladakh, Bali, or Paris.</p>
    `;
    const showAllBtn = document.createElement("button");
    showAllBtn.type = "button";
    showAllBtn.className = "primary-btn";
    showAllBtn.textContent = "Show All Destinations";
    showAllBtn.addEventListener("click", () => {
      resetDestinationSearch();
    });
    emptyBox.appendChild(showAllBtn);
    destinationGrid.appendChild(emptyBox);
    if (resultsCounter) {
      resultsCounter.textContent = "0 destinations found";
    }
    return;
  }

  placesList.forEach((place) => {
    destinationGrid.appendChild(createDestinationCard(place));
  });

  if (resultsCounter) {
    resultsCounter.textContent = `Showing ${placesList.length} of ${Object.keys(destinations).length} curated destinations`;
  }
}

function findMatchingDestinations(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return Object.values(destinations);

  return Object.values(destinations).filter((place) => {
    const inName = place.name.toLowerCase().includes(query);
    const inCountry = place.country.toLowerCase().includes(query);
    const inCategory = place.category.toLowerCase().includes(query);
    const inAttractions = (place.attractions || []).some((a) => a.toLowerCase().includes(query));
    return inName || inCountry || inCategory || inAttractions;
  });
}

function selectDestination(destKey, options = { scrollToPlanner: false, updateHeroBg: true }) {
  const place = destinations[destKey];
  if (!place) return;

  const isChanged = state.selectedDestinationKey !== destKey;
  state.selectedDestinationKey = destKey;
  state.customCosts = { ...place.costs };

  // Sync custom rate inputs
  syncCustomRateInputsWithPlace(place);

  if (budgetDestinationSelect) {
    budgetDestinationSelect.value = destKey;
  }

  if (options.updateHeroBg) {
    setDestinationHeroBackground(place);
  }

  // Highlight active quick chip
  document.querySelectorAll(".quick-dest-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.dest === destKey);
  });

  // Update active state on cards without losing current list
  document.querySelectorAll(".destination-card").forEach((card) => {
    const isMatch = card.dataset.key === destKey;
    card.classList.toggle("selected-card", isMatch);
    const btn = card.querySelector(".select-dest-btn");
    if (btn) btn.textContent = isMatch ? "Selected ✓" : "Select & Plan";
  });

  // Update Weather & Weather-based Itinerary + Budget
  if (isChanged || state.itineraryItems.length === 0) {
    updateWeatherForDestination(place);
  } else {
    updateBudgetEstimate();
  }

  if (options.scrollToPlanner) {
    const plannerEl = document.getElementById("planner");
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function resetDestinationSearch() {
  destinationInput.value = "";
  state.activeCategoryFilter = "all";
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === "all");
  });
  document.querySelectorAll(".quick-dest-chip").forEach((chip) => {
    chip.classList.remove("active");
  });

  restoreDefaultSlider(0);
  renderDestinationGrid(Object.values(destinations));

  destinationHeading.innerHTML = `Places worth <span>the journey.</span>`;
  destinationSubtitle.textContent =
    "From mountain hideaways to sun-kissed shores, find your kind of escape.";
  searchMessage.classList.remove("error");
  searchMessage.innerHTML = `<span>✦</span> Discover places that match your travel mood.`;
}

// ===== 5. WEATHER INDICATION (OPENWEATHER + OPEN-METEO LIVE FETCH + SAFE FALLBACK) =====
function classifyWeatherCode(tempC, conditionMain = "", weatherCode = null) {
  const mainLower = String(conditionMain).toLowerCase();
  if (weatherCode !== null) {
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode) || tempC <= 8) return "snowy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) return "rainy";
    if ([1, 2, 3, 45, 48].includes(weatherCode)) return "cloudy";
    if (weatherCode === 0) return tempC <= 10 ? "snowy" : "sunny";
  }
  if (mainLower.includes("snow") || tempC <= 8) return "snowy";
  if (mainLower.includes("rain") || mainLower.includes("drizzle") || mainLower.includes("thunder")) return "rainy";
  if (mainLower.includes("cloud") || mainLower.includes("mist") || mainLower.includes("fog")) return "cloudy";
  return "sunny";
}

function getWeatherIcon(category) {
  const map = {
    sunny: "☀️",
    rainy: "🌧️",
    cloudy: "⛅",
    snowy: "❄️",
    unverified: "🧭"
  };
  return map[category] || "🧭";
}

function getStoredOpenWeatherKey() {
  try {
    return sessionStorage.getItem("tripmate_owm_key") || "";
  } catch (e) {
    return "";
  }
}

async function updateWeatherForDestination(place, forceLiveProvider = null) {
  // Check cache first (valid for 10 minutes) to prevent redundant API calls
  const cached = state.weather.cache[place.key];
  const now = Date.now();
  if (cached && !forceLiveProvider && now - cached.timestamp < 600000) {
    applyWeatherState(place, cached.data);
    return;
  }

  const apiKey = getStoredOpenWeatherKey().trim();

  if (apiKey && forceLiveProvider !== "openmeteo") {
    try {
      weatherNoticeBox.textContent = `Fetching live weather for ${place.name} from OpenWeatherMap...`;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${place.coords.lat}&lon=${place.coords.lon}&units=metric&appid=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenWeather API returned status ${response.status}`);
      }
      const json = await response.json();
      const tempC = Math.round(json.main.temp);
      const humidity = json.main.humidity;
      const windKmh = Math.round((json.wind?.speed || 0) * 3.6);
      const rawCond = json.weather?.[0]?.main || "Clear";
      const rawDesc = json.weather?.[0]?.description || "Live conditions";
      const category = classifyWeatherCode(tempC, rawCond, null);

      const weatherData = {
        status: "live",
        category,
        tempC,
        humidity,
        windKmh,
        conditionText: rawCond,
        description: `Live OpenWeather report: ${rawDesc}.`,
        sourceLabel: "Live · OpenWeather"
      };
      state.weather.cache[place.key] = { timestamp: now, data: weatherData };
      applyWeatherState(place, weatherData);
      return;
    } catch (err) {
      applyWeatherState(place, {
        status: "error",
        category: "unverified",
        tempC: null,
        humidity: null,
        windKmh: null,
        conditionText: "Live Weather Unavailable",
        description: `Could not retrieve live OpenWeather data (${err.message}). Showing general unverified recommendations.`,
        sourceLabel: "API Error · Unverified"
      });
      return;
    }
  }

  if (forceLiveProvider === "openmeteo") {
    try {
      weatherNoticeBox.textContent = `Connecting to live meteorological feed for ${place.name}...`;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.coords.lat}&longitude=${place.coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const json = await response.json();
      const current = json.current;
      const tempC = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const windKmh = Math.round(current.wind_speed_10m || 0);
      const category = classifyWeatherCode(tempC, "", current.weather_code);
      const labelMap = {
        sunny: "Sunny / Clear Sky",
        cloudy: "Partly Cloudy / Overcast",
        rainy: "Rain / Showers",
        snowy: "Cold / Alpine Conditions"
      };

      const weatherData = {
        status: "live",
        category,
        tempC,
        humidity,
        windKmh,
        conditionText: labelMap[category] || "Live Conditions",
        description: `Live satellite & station observation for ${place.name}.`,
        sourceLabel: "Live · Open-Meteo"
      };
      state.weather.cache[place.key] = { timestamp: now, data: weatherData };
      applyWeatherState(place, weatherData);
      return;
    } catch (err) {
      applyWeatherState(place, {
        status: "error",
        category: "unverified",
        tempC: null,
        humidity: null,
        windKmh: null,
        conditionText: "Network / API Offline",
        description: "Live weather feed could not be reached in this browser environment. Use the Planning Weather Mode buttons below to preview weather-specific itineraries.",
        sourceLabel: "Offline · Unverified"
      });
      return;
    }
  }

  // Default honest state when no API key is configured yet
  applyWeatherState(place, {
    status: "unconfigured",
    category: "unverified",
    tempC: null,
    humidity: null,
    windKmh: null,
    conditionText: "Live Weather Not Configured",
    description: "No OpenWeather API key configured. Click 'Fetch Live Weather' or select a Planning Weather Mode below to preview weather-tailored activities.",
    sourceLabel: "Unverified · General Mode"
  });
}

function applyWeatherState(place, weatherData) {
  Object.assign(state.weather, weatherData);

  weatherDestName.textContent = place.name;
  weatherDestCountry.textContent = `${place.country} · ${place.category}`;
  weatherIconLarge.textContent = getWeatherIcon(weatherData.category);
  weatherTempValue.textContent = weatherData.tempC !== null ? `${weatherData.tempC}°C` : "— °C";
  weatherConditionPill.textContent = weatherData.conditionText;
  weatherSummaryText.textContent = weatherData.description;

  weatherHumidityVal.textContent = weatherData.humidity !== null ? `${weatherData.humidity}%` : "Unavailable";
  weatherWindVal.textContent = weatherData.windKmh !== null ? `${weatherData.windKmh} km/h` : "Unavailable";
  weatherCategoryVal.textContent = WEATHER_ITINERARY_TEMPLATES[weatherData.category]?.label || "Unverified";

  weatherStatusBadge.className = "status-badge " + (weatherData.status === "live" ? "live" : weatherData.status === "error" ? "error" : "unverified");
  weatherStatusBadge.textContent = weatherData.sourceLabel;

  if (weatherData.status === "live") {
    weatherNoticeBox.textContent = `Live weather verified for ${place.name}. The itinerary planner has been tailored for ${WEATHER_ITINERARY_TEMPLATES[weatherData.category].label.toLowerCase()} conditions.`;
  } else if (weatherData.status === "simulated") {
    weatherNoticeBox.textContent = `Planning Simulation Active: Previewing how TripMate adapts ${place.name}'s itinerary for ${WEATHER_ITINERARY_TEMPLATES[weatherData.category].label} conditions (illustrative planning mode, not live meteorological data).`;
  } else {
    weatherNoticeBox.textContent = `Live weather is not currently active for ${place.name}. Recommendations below are general destination highlights and are not weather-verified.`;
  }

  document.querySelectorAll(".weather-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.weatherMode === weatherData.category);
  });

  generateRecommendedItinerary(place, weatherData.category, weatherData.status === "live");
  updateBudgetEstimate();
}

// ===== 6. WEATHER-BASED TRAVEL PLANNER =====
function generateRecommendedItinerary(place, weatherCategory, isLiveVerified) {
  const template = WEATHER_ITINERARY_TEMPLATES[weatherCategory] || WEATHER_ITINERARY_TEMPLATES.unverified;
  state.itineraryItems = template.activities(place).map((item, idx) => ({
    id: `act-${Date.now()}-${idx}`,
    day: item.day,
    title: item.title,
    note: item.note
  }));

  if (itineraryWeatherBadge) {
    itineraryWeatherBadge.className = "status-badge " + (isLiveVerified ? "live" : "unverified");
    itineraryWeatherBadge.textContent = isLiveVerified
      ? `${template.icon} Weather-Verified · ${template.label}`
      : `${template.icon} ${weatherCategory === "unverified" ? "General (Not Weather-Verified)" : "Planning Mode · " + template.label}`;
  }

  if (itinerarySafetyText) {
    itinerarySafetyText.textContent = `${template.summary} Always verify real-time local safety advisories, terrain conditions, and official weather warnings before starting outdoor activities.`;
  }

  renderItineraryList();
}

function renderItineraryList() {
  if (!itineraryList) return;
  itineraryList.innerHTML = "";

  state.itineraryItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "itinerary-item";

    const badge = document.createElement("span");
    badge.className = "itinerary-day-badge";
    badge.textContent = item.day;

    const content = document.createElement("div");
    content.className = "itinerary-item-content";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = item.title;
    titleInput.setAttribute("aria-label", `Edit activity for ${item.day}`);
    titleInput.addEventListener("input", () => {
      item.title = titleInput.value;
    });

    const meta = document.createElement("div");
    meta.className = "itinerary-item-meta";
    meta.textContent = item.note;

    content.append(titleInput, meta);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-activity-btn";
    removeBtn.setAttribute("aria-label", `Remove ${item.title}`);
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      state.itineraryItems = state.itineraryItems.filter((i) => i.id !== item.id);
      renderItineraryList();
    });

    row.append(badge, content, removeBtn);
    itineraryList.appendChild(row);
  });
}

// ===== 7. PASSENGER COUNT VALIDATION & SYNCHRONIZATION =====
function setPassengerCount(rawValue, showWarningOnInvalid = false) {
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
    if (showWarningOnInvalid) {
      searchMessage.classList.add("error");
      searchMessage.textContent = "Please enter a valid whole number of passengers (minimum 1).";
    }
    const safeCount = Math.max(1, Math.round(Number(state.passengerCount) || 1));
    state.passengerCount = safeCount;
  } else {
    state.passengerCount = Math.min(50, parsed);
    if (showWarningOnInvalid) {
      searchMessage.classList.remove("error");
    }
  }

  if (passengerCountInput) {
    passengerCountInput.value = String(state.passengerCount);
  }
  if (budgetPassengersInput) {
    budgetPassengersInput.value = String(state.passengerCount);
  }
  if (passengerUnitLabel) {
    passengerUnitLabel.textContent = state.passengerCount === 1 ? "Passenger" : "Passengers";
  }

  updateBudgetEstimate();
}

// ===== 8. PASSENGER-BASED BUDGET ESTIMATOR (INR ₹) =====
function syncCustomRateInputsWithPlace(place) {
  if (!place || !place.costs) return;
  if (customStayRate) customStayRate.value = String(place.costs.stayNight);
  if (customFoodRate) customFoodRate.value = String(place.costs.foodDay);
  if (customTransportRate) customTransportRate.value = String(place.costs.transportDay);
  if (customActivityRate) customActivityRate.value = String(place.costs.activityDay);
  if (customFixedFee) customFixedFee.value = String(place.costs.fixedFee);
}

function updateBudgetEstimate() {
  const place = destinations[state.selectedDestinationKey] || destinations.manali;
  const passengers = Math.max(1, parseInt(state.passengerCount, 10) || 1);
  const days = Math.max(1, Math.min(30, parseInt(budgetDaysInput?.value, 10) || state.tripDays || 3));
  state.tripDays = days;
  if (budgetDaysInput) budgetDaysInput.value = String(days);

  const tierMultiplier = parseFloat(budgetStayTier?.value) || 1;

  const stayPerRoomNight = Math.max(0, Number(customStayRate?.value) || place.costs.stayNight);
  const foodPerPersonDay = Math.max(0, Number(customFoodRate?.value) || place.costs.foodDay);
  const transportPerPersonDay = Math.max(0, Number(customTransportRate?.value) || place.costs.transportDay);
  const activityPerPersonDay = Math.max(0, Number(customActivityRate?.value) || place.costs.activityDay);
  const flatBookingFee = Math.max(0, Number(customFixedFee?.value) || place.costs.fixedFee);

  // Rooms scale realistically by double occupancy (ceil(passengers / 2))
  const roomsNeeded = Math.ceil(passengers / 2);
  const accommodationTotal = Math.round(roomsNeeded * stayPerRoomNight * days * tierMultiplier);
  const foodTotal = Math.round(passengers * foodPerPersonDay * days);
  const transportTotal = Math.round(passengers * transportPerPersonDay * days);
  const activityTotal = Math.round(passengers * activityPerPersonDay * days);

  // Fixed fee is NOT multiplied by passenger count
  const grandTotal = accommodationTotal + foodTotal + transportTotal + activityTotal + flatBookingFee;
  const perPassenger = Math.round(grandTotal / passengers);

  if (budgetTotalDisplay) {
    budgetTotalDisplay.textContent = formatINR(grandTotal);
  }
  if (budgetPerPersonDisplay) {
    budgetPerPersonDisplay.textContent = `${formatINR(perPassenger)} / passenger`;
  }

  if (budgetBreakdownList) {
    budgetBreakdownList.innerHTML = `
      <div class="breakdown-row">
        <span>Accommodation (${roomsNeeded} room${roomsNeeded > 1 ? "s" : ""} × ${days} night${days > 1 ? "s" : ""})</span>
        <strong>${formatINR(accommodationTotal)}</strong>
      </div>
      <div class="breakdown-row">
        <span>Food & Dining (${passengers} pax × ${days} days)</span>
        <strong>${formatINR(foodTotal)}</strong>
      </div>
      <div class="breakdown-row">
        <span>Local Transport (${passengers} pax × ${days} days)</span>
        <strong>${formatINR(transportTotal)}</strong>
      </div>
      <div class="breakdown-row">
        <span>Activities & Attractions (${passengers} pax × ${days} days)</span>
        <strong>${formatINR(activityTotal)}</strong>
      </div>
      <div class="breakdown-row">
        <span>Fixed Booking & Permit Reserve (Flat group fee — not multiplied by pax)</span>
        <strong>${formatINR(flatBookingFee)}</strong>
      </div>
    `;
  }
}

// ===== EVENT LISTENERS & INITIALIZATION =====
function wireEvents() {
  // Search form submission
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setPassengerCount(passengerCountInput.value, true);

    const query = destinationInput.value.trim();
    if (!query) {
      searchMessage.classList.add("error");
      searchMessage.textContent =
        "Please enter a destination (e.g., Manali, Kerala, Goa, Jaipur, Ooty, Chennai, Bengaluru, or Paris).";
      destinationInput.focus();
      return;
    }

    const matches = findMatchingDestinations(query);
    if (matches.length === 0) {
      searchMessage.classList.add("error");
      searchMessage.textContent =
        `No matches found for "${query}". Try Manali, Kerala, Bali, Goa, Coorg, Jaipur, Ladakh, Ooty, Chennai, Bengaluru or Paris.`;
      renderDestinationGrid([], query);
      return;
    }

    const primaryMatch = matches[0];
    searchMessage.classList.remove("error");
    searchMessage.innerHTML =
      `<span>✦</span> Showing ${matches.length} destination match${matches.length > 1 ? "es" : ""} for "${query}" (${state.passengerCount} ${state.passengerCount === 1 ? "passenger" : "passengers"}).`;

    renderDestinationGrid(matches, query);
    selectDestination(primaryMatch.key, { scrollToPlanner: false, updateHeroBg: true });

    destinationHeading.innerHTML = `Discover <span>${primaryMatch.name}.</span>`;
    destinationSubtitle.textContent =
      `Explore ${primaryMatch.name}, check destination weather, and customize your itinerary & budget for ${state.passengerCount} ${state.passengerCount === 1 ? "passenger" : "passengers"}.`;

    document.getElementById("destinations").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Restore slider & full catalog when input is cleared
  destinationInput.addEventListener("input", () => {
    if (destinationInput.value.trim() === "" && state.isDestinationBgActive) {
      resetDestinationSearch();
    }
  });

  // Quick destination chips
  document.querySelectorAll(".quick-dest-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.dest;
      const place = destinations[key];
      if (!place) return;
      destinationInput.value = place.name;
      renderDestinationGrid([place], place.name);
      destinationHeading.innerHTML = `Discover <span>${place.name}.</span>`;
      destinationSubtitle.textContent = place.description;
      selectDestination(key, { scrollToPlanner: false, updateHeroBg: true });
    });
  });

  // Category filter pills
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter;
      state.activeCategoryFilter = filter;
      document.querySelectorAll(".category-pill").forEach((p) => p.classList.toggle("active", p === pill));
      if (filter === "all") {
        renderDestinationGrid(Object.values(destinations));
      } else {
        const filtered = Object.values(destinations).filter((d) => d.regionGroup === filter);
        renderDestinationGrid(filtered);
      }
    });
  });

  if (resetDestinationsBtn) {
    resetDestinationsBtn.addEventListener("click", resetDestinationSearch);
  }
  if (restoreSliderBtn) {
    restoreSliderBtn.addEventListener("click", () => resetDestinationSearch());
  }

  // Passenger stepper controls
  if (passengerDecBtn) {
    passengerDecBtn.addEventListener("click", () => {
      setPassengerCount(Math.max(1, state.passengerCount - 1));
    });
  }
  if (passengerIncBtn) {
    passengerIncBtn.addEventListener("click", () => {
      setPassengerCount(Math.min(50, state.passengerCount + 1));
    });
  }
  if (passengerCountInput) {
    passengerCountInput.addEventListener("change", () => {
      setPassengerCount(passengerCountInput.value, true);
    });
  }

  // Weather simulation / mode buttons
  document.querySelectorAll(".weather-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.weatherMode;
      const place = destinations[state.selectedDestinationKey] || destinations.manali;
      const template = WEATHER_ITINERARY_TEMPLATES[mode] || WEATHER_ITINERARY_TEMPLATES.unverified;
      applyWeatherState(place, {
        status: mode === "unverified" ? "unconfigured" : "simulated",
        category: mode,
        tempC: state.weather.status === "live" ? state.weather.tempC : null,
        humidity: state.weather.status === "live" ? state.weather.humidity : null,
        windKmh: state.weather.status === "live" ? state.weather.windKmh : null,
        conditionText: mode === "unverified" ? "General / Unverified" : `${template.label} (Planning Mode)`,
        description: template.summary,
        sourceLabel: mode === "unverified" ? "Unverified Mode" : "Planning Simulation · Not Live"
      });
    });
  });

  if (fetchOpenMeteoBtn) {
    fetchOpenMeteoBtn.addEventListener("click", () => {
      const place = destinations[state.selectedDestinationKey] || destinations.manali;
      updateWeatherForDestination(place, "openmeteo");
    });
  }

  if (saveApiKeyBtn && openWeatherKeyInput) {
    saveApiKeyBtn.addEventListener("click", () => {
      const key = openWeatherKeyInput.value.trim();
      try {
        if (key) {
          sessionStorage.setItem("tripmate_owm_key", key);
        } else {
          sessionStorage.removeItem("tripmate_owm_key");
        }
      } catch (e) {
        // Ignore sessionStorage restrictions in sandboxed iframes
      }
      const place = destinations[state.selectedDestinationKey] || destinations.manali;
      delete state.weather.cache[place.key];
      updateWeatherForDestination(place);
    });
  }

  // Itinerary modification events
  if (resetItineraryBtn) {
    resetItineraryBtn.addEventListener("click", () => {
      const place = destinations[state.selectedDestinationKey] || destinations.manali;
      generateRecommendedItinerary(place, state.weather.category, state.weather.status === "live");
    });
  }

  if (addActivityForm) {
    addActivityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = newActivityTitle.value.trim();
      if (!title) return;
      state.itineraryItems.push({
        id: `act-${Date.now()}`,
        day: newActivityDay.value,
        title,
        note: "Custom traveler activity added to plan."
      });
      newActivityTitle.value = "";
      renderItineraryList();
    });
  }

  // Budget controls
  if (budgetDestinationSelect) {
    budgetDestinationSelect.addEventListener("change", () => {
      selectDestination(budgetDestinationSelect.value, { scrollToPlanner: false, updateHeroBg: true });
    });
  }
  if (budgetPassengersInput) {
    budgetPassengersInput.addEventListener("change", () => {
      setPassengerCount(budgetPassengersInput.value, true);
    });
  }
  [budgetDaysInput, budgetStayTier, customStayRate, customFoodRate, customTransportRate, customActivityRate, customFixedFee].forEach((inputEl) => {
    if (inputEl) {
      inputEl.addEventListener("input", updateBudgetEstimate);
    }
  });

  // Experience list items scroll to planner
  document.querySelectorAll(".experience-list article").forEach((article) => {
    article.addEventListener("click", () => {
      document.getElementById("planner").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Responsive mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Prevent selecting a past departure date
  if (departureInput) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
    departureInput.min = localToday;
    departureInput.value = localToday;
  }
}

// Initialize TripMate
function initApp() {
  initHeroSlider();
  renderDestinationGrid(Object.values(destinations));
  wireEvents();
  setPassengerCount(1);
  selectDestination("manali", { scrollToPlanner: false, updateHeroBg: false });
}

initApp();

// ════════════════════════════════════════════════════════════════
// CONTENT GENERATION (Claude generates JSON, not HTML)
// ════════════════════════════════════════════════════════════════

const CONTENT_SYSTEM_PROMPT = `You are a world-class copywriter for premium business websites. Generate compelling, specific content.

OUTPUT: Return ONLY a valid JSON object. No markdown fences. No explanation.

JSON STRUCTURE:
{
  "heroHeadline": "Bold 4-7 word headline. Use line breaks wisely, e.g. 'Learn AI.\\nBuild Smarter.'",
  "heroSubtitle": "1-2 sentence value proposition that speaks directly to the customer",
  "ctaPrimaryText": "Action button (3 words max, e.g. 'Get Started')",
  "ctaSecondaryText": "Secondary button (3 words max, e.g. 'Our Programs')",
  "businessCategory": "one of: food, fitness, education, tech, retail, beauty, realestate, health, creative, general",
  "heroImageKeywords": "2-3 word description for hero image (e.g. 'professional office', 'modern kitchen')",
  "heroStats": [
    { "number": "10,000+", "label": "Students Trained" },
    { "number": "50+", "label": "Locations" },
    { "number": "35", "label": "Years Experience" }
  ],
  "aboutHeading": "Compelling about heading (not just 'About Us')",
  "aboutText": "2-3 SHORT sentences max. Punchy, confident, no fluff. Think tagline energy, not essay.",
  "aboutStats": [
    { "number": "e.g. 500+", "label": "e.g. Clients Served" },
    { "number": "e.g. 15", "label": "e.g. Years Experience" },
    { "number": "e.g. 98%", "label": "e.g. Client Satisfaction" },
    { "number": "e.g. 24/7", "label": "e.g. Support Available" }
  ],
  "aboutHighlightNumber": "Impressive stat (e.g. '50+' or '35 Years')",
  "aboutHighlightLabel": "Label for stat",
  "serviceCards": [
    { "icon": "lucide-icon-name", "name": "Service Name", "description": "1-2 sentences", "featured": false }
  ],
  "whyCards": [
    { "icon": "lucide-icon-name", "title": "Reason", "description": "Short explanation" }
  ],
  "testimonials": [
    { "quote": "Specific, authentic feedback", "name": "Full Name", "role": "Role/Relationship" }
  ],
  "contactInfo": [
    { "icon": "lucide-icon-name", "label": "Type", "value": "Detail" }
  ],
  "footerTagline": "Brief brand statement"
}

RULES:
- Use EVERY business detail provided — nothing generic
- businessCategory: Infer from the business type. If unsure, use 'general'
- heroImageKeywords: 2-3 words describing what visual would best represent this business
- heroStats: exactly 3 impressive numbers derived from the business info
- aboutStats: exactly 4 stats (MUST be even number) — impressive business metrics
- serviceCards: exactly 4 cards (MUST be even number). Mark the FIRST one as "featured": true (it gets a special style)
- whyCards: exactly 4 reasons
- testimonials: exactly 4, written as if by the target customer type described (MUST be even number)
- contactInfo: include all provided contact details (phone, email, location)
- No newlines inside string values except heroHeadline where \\n creates a line break

ICONS: Use Lucide icon names (lowercase, hyphenated) instead of emojis. Examples:
- Services: "graduation-cap", "trophy", "sun", "target", "baby", "dumbbell", "utensils", "store", "truck", "palette", "wrench", "heart", "book-open", "camera", "music", "code", "briefcase", "shopping-cart"
- Why us: "shield-check", "clipboard-list", "map-pin", "star", "clock", "users", "award", "thumbs-up", "zap", "check-circle"
- Contact: "phone", "mail", "map-pin"
Choose icons that semantically match each item. Use ONLY valid Lucide icon names.`;

function buildContentPrompt(p) {
  const serviceList = p.services.split(/[,\n]+/).map(s => s.trim()).filter(s => s).slice(0, 6).join(', ');
  return `Generate website content for this business. Use ALL the details provided.

BUSINESS PROFILE:
- Name: ${p.name}
- Tagline: ${p.tagline || 'N/A'}
- About: ${p.about}
- Services/Products: ${serviceList}
- Customer Type: ${p.customers}
- Contact: ${p.contact || 'N/A'}
- Location: ${p.location || 'N/A'}
- Website Style: ${p.style}

Generate compelling, specific content that uses every detail above. Create exactly 4 service cards (based on Services list), exactly 4 "Why Choose Us" reasons, and exactly 4 testimonials that sound authentic for this business type. All counts MUST be even numbers.`;
}

// ════════════════════════════════════════════════════════════════
// FILL TEMPLATE WITH GENERATED CONTENT
// ════════════════════════════════════════════════════════════════

// Inline SVG icon map — no CDN dependency, works in sandboxed iframes
const SVG_ICONS = {
  'waves': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
  'trophy': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  'sun': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  'target': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  'baby': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>',
  'shield-check': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
  'clipboard-list': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
  'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  'phone': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  'mail': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  'graduation-cap': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  'heart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  'users': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'award': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  'zap': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  'clock': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  'thumbs-up': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
  'briefcase': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  'store': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>',
  'truck': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>',
  'wrench': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  'book-open': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  'camera': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
  'palette': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  'shopping-cart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  'music': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  'code': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  'dumbbell': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
  'utensils': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
};

function getIcon(name) {
  if (SVG_ICONS[name]) return SVG_ICONS[name];
  // Fallback: render a generic circle-dot icon
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>';
}

// ════════════════════════════════════════════════════════════════
// BRAND LOGOS — base64 embedded for premium branded demos
// ════════════════════════════════════════════════════════════════
const BRAND_LOGOS = {
  'Edge Academy': {
    dark: 'data:image/png;base64,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',
    light: 'data:image/png;base64,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'
  },
  'MyRepublic': {
    dark: 'data:image/png;base64,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',
    light: 'data:image/png;base64,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'
  }
};


// ════════════════════════════════════════════════════════════════
// STYLE VARIATIONS — different fonts, colors, layouts per style
// ════════════════════════════════════════════════════════════════
const STYLE_DEFS = {
  modern: {
    fonts: '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    css: `
/* ═══ MODERN — Soft gradient hero, centered text, Apple-clean, generous whitespace ═══ */
body { background: #ffffff; }
h1,h2,h3,h4 { font-family: 'DM Sans', sans-serif; }

/* LAYOUT: Soft gradient hero with subtle orbs, centred text, refined */
.hero { background: linear-gradient(170deg, #f0f4ff 0%, #ffffff 35%, #f8f6ff 65%, #f0faf7 100%); min-height: 92vh; padding-top: 160px; }
.hero-content { max-width: 750px; }
.hero h1 { color: var(--secondary); font-weight: 700; letter-spacing: -3px; font-size: clamp(3.2rem, 7vw, 5.5rem); line-height: 1.05; }
.hero h1 .accent { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 100% 100%; animation: none; }
.hero .subtitle { color: var(--text-light); font-size: clamp(1.05rem, 1.8vw, 1.2rem); }
.hero-stats { border-top: 1px solid rgba(0,0,0,0.06); }
.hero-stat .num { color: var(--secondary); font-size: 2rem; }
.hero-stat .lbl { color: var(--text-light); }
/* Very subtle background effects */
.hero-bg .orb { opacity: 0.08; filter: blur(140px); }
.hero-bg .orb-1 { background: var(--primary); }
.hero-bg .orb-2 { background: var(--accent); opacity: 0.06; }
.hero-mesh { opacity: 0; }
.hero-grid { background-image: none; }
.hero-shapes .hero-shape { border-color: rgba(0,0,0,0.03); }
.hero-noise { display: none; }
.hero-glow-line { display: none; }
.hero-badge { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); color: var(--primary); }
.hero-badge .dot { background: var(--primary); }

/* Buttons: soft rounded */
.btn-fill { background: var(--primary); color: white; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-radius: 12px; }
.btn-fill::after { display: none; }
.btn-fill:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.12); transform: translateY(-2px); }
.btn-ghost { border-color: rgba(0,0,0,0.12); color: var(--secondary); border-radius: 12px; }
.btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: transparent; }
.btn-hero { border-radius: 12px; }

/* Nav: light frosted glass */
.nav { background: rgba(255,255,255,0.85); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(0,0,0,0.04); }
.nav.scrolled { background: rgba(255,255,255,0.98); box-shadow: 0 1px 30px rgba(0,0,0,0.04); }
.nav-logo { color: var(--secondary); }
.nav-links a { color: var(--text); }
.nav-cta { background: var(--primary); color: white; border-radius: 10px; text-transform: none; letter-spacing: 0; }

/* About: standard 2-col with clean stat cards */
.about-section { background: #ffffff; padding: 100px 48px; }
.about-inner h2 { color: var(--secondary); font-size: 2.4rem; }
.about-stat-card { background: var(--light); border: none; box-shadow: none; border-radius: 14px; }
.about-stat-card .stat-num { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.about-stat-card .stat-lbl { color: var(--text-light); }

/* Services: clean 2x2 grid, no featured span */
.services-section { background: var(--light); padding: 100px 48px; }
.section-header h2 { color: var(--secondary); }
.bento { grid-template-columns: repeat(2, 1fr); gap: 24px; }
.bento-card { border: 1px solid rgba(0,0,0,0.04); box-shadow: none; background: white; border-radius: 16px; padding: 40px 36px; }
.bento-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.04); transform: translateY(-4px); }
.bento-card::before { display: none; }
.bento-card .icon { background: linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.05)); border-radius: 12px; }
.bento-card.featured { grid-column: span 1; background: var(--secondary); }

/* Why: 2x2 grid, left-aligned text in cards */
.why-section { background: var(--secondary); }
.why-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
.why-card { background: rgba(255,255,255,0.06); border-radius: 16px; text-align: left; padding: 36px 32px; }
.why-card .icon { margin: 0 0 20px; }
.why-card:hover { background: rgba(255,255,255,0.1); transform: none; }

/* Testimonials: clean 2x2 grid */
.testi-section { background: #ffffff; }
.testi-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
.testi-card { border: 1px solid rgba(0,0,0,0.04); border-radius: 16px; }

/* Contact / Footer */
.contact-section { background: var(--secondary); }
.contact-form { border-radius: 16px; }
.form-field input, .form-field textarea { border-radius: 10px; }
.form-btn { border-radius: 12px; text-transform: none; letter-spacing: 0; }
.wave-divider.dark-to-light svg { fill: #ffffff; }
.wave-divider.light-to-dark svg path { fill: var(--secondary); }
.footer { background: var(--secondary); }
.cursor-glow { display: none; }
`
  },
  bold: {
    fonts: '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    css: `
/* ═══ BOLD — Full dark neon, centered hero, glowing cards, visible grid, max energy ═══ */
body { background: #060b18; }

/* LAYOUT: Centered hero with all visual effects turned to max */
.hero { background: #060b18; min-height: 100vh; }
.hero h1 { font-size: clamp(3.5rem, 8vw, 5.5rem); font-weight: 700; text-shadow: 0 0 80px rgba(255,255,255,0.15); }
.hero h1 .accent { background: linear-gradient(135deg, var(--accent), var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% 100%; filter: drop-shadow(0 0 30px var(--accent)); }
/* All visual effects at full power */
.hero-bg .orb { opacity: 0.6; filter: blur(60px); }
.hero-bg .orb-1 { background: var(--primary); width: 700px; height: 700px; }
.hero-bg .orb-2 { background: var(--accent); opacity: 0.4; width: 500px; height: 500px; }
.hero-bg .orb-3 { background: var(--secondary); opacity: 0.35; }
.hero-mesh { opacity: 0.5; }
.hero-grid { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); }
.hero-shapes .hero-shape { border-color: rgba(255,255,255,0.08); border-width: 2px; }
.hero-glow-line { opacity: 0.9; height: 3px; box-shadow: 0 0 20px var(--accent), 0 0 60px var(--primary); }
.hero-noise { opacity: 0.035; }
.hero-stats { border-top: 1px solid rgba(255,255,255,0.08); }
.hero-stat .num { text-shadow: 0 0 30px rgba(255,255,255,0.15); }

/* Buttons: gradient glow */
.btn-fill { background: linear-gradient(135deg, var(--accent), var(--primary)); color: white; box-shadow: 0 0 40px rgba(255,215,0,0.25); border-radius: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
.btn-fill:hover { box-shadow: 0 0 70px rgba(255,215,0,0.4); transform: translateY(-3px) scale(1.02); }
.btn-ghost { border: 2px solid rgba(255,255,255,0.2); border-radius: 14px; text-transform: uppercase; letter-spacing: 1.5px; }
.btn-ghost:hover { border-color: var(--accent); background: rgba(255,255,255,0.05); box-shadow: 0 0 30px rgba(255,255,255,0.08); }
.nav-cta { background: linear-gradient(135deg, var(--accent), var(--primary)); box-shadow: 0 0 20px rgba(255,215,0,0.15); }

/* About: dark with glowing stat cards */
.about-section { background: #0a0f1f; }
.about-inner h2 { color: white; }
.about-inner p { color: rgba(255,255,255,0.65); }
.about-label { background: rgba(255,255,255,0.06); color: var(--accent); }
.about-stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s; }
.about-stat-card:hover { border-color: var(--accent); box-shadow: 0 0 30px rgba(255,215,0,0.08); }
.about-stat-card .stat-num { filter: drop-shadow(0 0 10px var(--accent)); }
.about-stat-card .stat-lbl { color: rgba(255,255,255,0.5); }
.about-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
.about-number-label { color: white; }
.wave-divider.dark-to-light svg { fill: #0a0f1f; }

/* Services: dark with glowing border cards, 3-column */
.services-section { background: #0a0f1f; }
.section-header h2 { color: white; }
.section-header .label { color: var(--accent); }
.section-header p { color: rgba(255,255,255,0.6); }
.bento-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
.bento-card h3 { color: white; }
.bento-card p { color: rgba(255,255,255,0.6); }
.bento-card:hover { background: rgba(255,255,255,0.06); border-color: var(--accent); box-shadow: 0 0 40px rgba(255,215,0,0.06), inset 0 0 30px rgba(255,255,255,0.02); transform: translateY(-8px); }
.bento-card .icon { background: rgba(255,255,255,0.05); }
.bento-card::before { background: linear-gradient(90deg, var(--accent), var(--primary)); height: 3px; }
.bento { grid-template-columns: repeat(2, 1fr); gap: 24px; }
.bento-card.featured { grid-column: span 1; background: linear-gradient(135deg, var(--secondary), var(--primary)); border: none; box-shadow: 0 0 60px rgba(0,0,0,0.4); }
.testi-grid { grid-template-columns: repeat(2, 1fr); }
/* HOVER-REVEAL: descriptions hidden until hover, glow on reveal */
.reveal-on-hover .bento-card { min-height: 160px; transition: all 0.4s; }
.reveal-on-hover .bento-card:hover { box-shadow: 0 0 50px rgba(255,215,0,0.1), 0 0 100px rgba(0,0,0,0.3); }

/* Why: dark with accent-outlined cards */
.why-section { background: #060b18; }
.why-section::before { width: 1000px; height: 1000px; }
.why-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
.why-card:hover { border-color: var(--accent); box-shadow: 0 0 40px rgba(255,215,0,0.08), 0 0 80px rgba(0,0,0,0.3); transform: translateY(-6px); }

/* Testimonials: dark */
.testi-section { background: #0a0f1f; }
.testi-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
.testi-card:hover { border-color: rgba(255,255,255,0.15); box-shadow: 0 8px 40px rgba(0,0,0,0.3); }
.testi-text { color: rgba(255,255,255,0.75); }
.testi-info .name { color: white; }
.testi-info .role { color: rgba(255,255,255,0.5); }
.testi-stars { color: var(--accent); }
.testi-card .big-quote { color: var(--accent); }

/* Contact / Footer */
.contact-section { background: #060b18; }
.footer { background: #030610; border-top: 1px solid rgba(255,255,255,0.04); }
.cursor-glow { background: radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%); }
`
  },
  elegant: {
    fonts: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    css: `
/* ═══ ELEGANT — Warm editorial, serif, large whitespace, single-col services, horizontal dividers ═══ */
body { background: #faf8f5; color: #2c2420; }
h1,h2,h3,h4 { font-family: 'Playfair Display', Georgia, serif; }

/* LAYOUT: Tall hero, text centred with massive spacing, editorial feel */
.hero { background: linear-gradient(170deg, #1a1210 0%, #2a1f18 40%, #1f1815 100%); min-height: 100vh; padding-top: 180px; padding-bottom: 100px; }
.hero-content { max-width: 700px; }
.hero h1 { letter-spacing: -2px; font-weight: 400; font-size: clamp(3.5rem, 8vw, 6.5rem); line-height: 1.02; margin-bottom: 32px; }
.hero h1 .accent { background: linear-gradient(135deg, var(--accent), #e8c570); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 100%; animation: none; }
.hero .subtitle { font-family: 'Lora', Georgia, serif; font-style: italic; color: rgba(255,255,255,0.5); font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.8; }
.hero-badge { border-color: rgba(255,255,255,0.08); letter-spacing: 5px; font-family: 'Inter', sans-serif; font-size: 0.6rem; background: transparent; }
.hero-badge .dot { display: none; }
/* Minimal decorations */
.hero-bg .orb { opacity: 0.06; filter: blur(160px); }
.hero-grid { display: none; }
.hero-mesh { opacity: 0.08; }
.hero-shapes { display: none; }
.hero-noise { opacity: 0.05; }
.hero-glow-line { background: linear-gradient(90deg, transparent 30%, var(--accent), transparent 70%); opacity: 0.25; height: 1px; }
.hero-stats { border-top: 1px solid rgba(255,255,255,0.06); margin-top: 80px; padding-top: 40px; }
.hero-stat .num { font-family: 'Playfair Display', serif; font-weight: 400; font-size: 2.5rem; }
.hero-stat .lbl { letter-spacing: 3px; font-size: 0.68rem; text-transform: uppercase; }

/* Buttons: sharp, refined */
.btn-fill { border-radius: 0; text-transform: uppercase; letter-spacing: 4px; font-family: 'Inter', sans-serif; font-size: 0.72rem; padding: 20px 48px; background: var(--accent); color: #1a1210; font-weight: 600; }
.btn-fill::after { display: none; }
.btn-fill:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.15); transform: translateY(-2px); }
.btn-ghost { border-radius: 0; text-transform: uppercase; letter-spacing: 4px; font-family: 'Inter', sans-serif; font-size: 0.72rem; border-width: 1px; border-color: rgba(255,255,255,0.2); }
.btn-hero { border-radius: 0; }

/* Nav: transparent, minimal */
.nav { background: transparent; padding: 28px 48px; }
.nav.scrolled { background: rgba(26,18,16,0.95); padding: 16px 48px; }
.nav-logo { font-family: 'Playfair Display', serif; letter-spacing: 3px; font-weight: 400; font-size: 1.15rem; }
.nav-links a { letter-spacing: 2px; font-size: 0.75rem; text-transform: uppercase; font-family: 'Inter', sans-serif; }
.nav-cta { border-radius: 0; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 3px; font-size: 0.7rem; background: transparent; border: 1px solid rgba(255,255,255,0.25); }
.nav-cta:hover { background: var(--accent); color: #1a1210; border-color: var(--accent); }

/* About: single-column, centred, editorial */
.about-section { background: #faf8f5; padding: 120px 48px; }
.about-inner { grid-template-columns: 1fr; gap: 48px; max-width: 750px; text-align: center; }
.about-inner h2 { font-style: italic; font-weight: 400; color: #2c2420; letter-spacing: -1px; font-size: 3rem; }
.about-inner p { font-family: 'Lora', Georgia, serif; color: #7a6e64; line-height: 2; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
.about-visual { display: none; }
.about-label { letter-spacing: 5px; font-size: 0.65rem; background: transparent; color: var(--primary); border-bottom: 1px solid var(--primary); border-radius: 0; padding: 0 0 6px; display: inline-block; }
.about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 600px; margin: 0 auto; }
.about-stat-card { background: transparent; border: none; border-top: 1px solid rgba(0,0,0,0.1); border-radius: 0; padding: 24px 0; }
.about-stat-card .stat-num { font-family: 'Playfair Display', serif; font-weight: 400; font-size: 2.8rem; }
.about-stat-card .stat-lbl { font-family: 'Lora', serif; font-style: italic; color: #7a6e64; }

/* Services: single-column stacked cards, editorial feel */
.services-section { background: #f4f0ea; padding: 120px 48px; }
.section-header h2 { font-style: italic; font-weight: 400; color: #2c2420; letter-spacing: -1px; font-size: 2.8rem; }
.section-header .label { letter-spacing: 5px; color: var(--primary); font-size: 0.65rem; }
.section-header p { font-family: 'Lora', Georgia, serif; color: #7a6e64; }
.bento { grid-template-columns: 1fr 1fr; gap: 16px; max-width: 900px; }
.bento-card { border-radius: 0; border: none; border-bottom: 1px solid rgba(0,0,0,0.08); background: transparent; padding: 40px 24px; box-shadow: none; }
.bento-card::before { display: none; }
.bento-card h3 { font-family: 'Playfair Display', serif; font-weight: 500; color: #2c2420; font-size: 1.25rem; }
.bento-card p { font-family: 'Lora', serif; color: #7a6e64; }
.bento-card .icon { border-radius: 0; background: transparent; border: 1px solid rgba(0,0,0,0.1); }
.bento-card:hover { box-shadow: none; transform: none; background: rgba(0,0,0,0.02); }
.bento-card.featured { grid-column: span 1; background: #2c2420; border: none; border-radius: 0; color: white; }
.bento-card.featured h3 { color: white; }

/* Why: warm dark, wider cards */
.why-section { background: #2c2420; padding: 100px 48px; }
.why-section::before { background: radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%); }
.why-section::after { background: linear-gradient(90deg, transparent, var(--accent), transparent); }
.why-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
.why-card { border-radius: 0; background: rgba(255,255,255,0.03); border: none; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 40px 32px; text-align: left; }
.why-card .icon { border-radius: 0; margin: 0 0 20px; }
.why-card h3 { font-family: 'Playfair Display', serif; font-style: italic; }
.why-card p { font-family: 'Lora', serif; }
.why-card:hover { background: rgba(255,255,255,0.05); transform: none; border-color: var(--accent); }

/* Testimonials: marquee — horizontal infinite scroll */
.testi-section { background: #faf8f5; padding: 120px 48px; }
.testi-marquee .testi-grid { display: flex; overflow: hidden; max-width: 100%; }
.testi-marquee .testi-track { display: flex; gap: 28px; animation: marqueeScroll 40s linear infinite; width: max-content; }
.testi-marquee .testi-track:hover { animation-play-state: paused; }
.testi-marquee .testi-card { min-width: 380px; max-width: 380px; flex-shrink: 0; border-radius: 0; border: none; border-top: 1px solid rgba(0,0,0,0.08); padding: 48px 32px; background: transparent; }
.testi-marquee .testi-card:hover { box-shadow: none; transform: none; }
.testi-card .big-quote { font-family: 'Playfair Display', serif; font-size: 10rem; opacity: 0.04; top: 0; right: 16px; }
.testi-text { font-family: 'Lora', Georgia, serif; font-style: italic; color: #4a413a; font-size: 1.15rem; line-height: 2; }
.testi-info .name { color: #2c2420; }
.testi-card:hover { box-shadow: none; }

/* Contact / Footer */
.contact-section { background: #2c2420; }
.contact-form { border-radius: 0; }
.form-field input, .form-field textarea { border-radius: 0; }
.form-btn { border-radius: 0; text-transform: uppercase; letter-spacing: 4px; font-family: 'Inter', sans-serif; font-size: 0.78rem; background: var(--accent); color: #1a1210; }
.footer { background: #1a1210; }
.footer-brand { font-family: 'Playfair Display', serif; font-weight: 400; letter-spacing: 3px; }
.cursor-glow { display: none; }
`
  },
  playful: {
    fonts: '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    css: `
/* ═══ PLAYFUL — Pastel gradient sections, tilted cards, huge icons, bouncy everything ═══ */
body { background: #fffdf8; }
h1,h2,h3,h4 { font-family: 'Nunito', sans-serif; }

/* LAYOUT: Pastel gradient hero, big bouncy text */
.hero { background: linear-gradient(135deg, #fef3e2 0%, #fce4ec 25%, #e8eaf6 50%, #e0f7fa 75%, #f1f8e9 100%); min-height: 92vh; }
.hero h1 { font-weight: 900; letter-spacing: -1px; color: var(--secondary); font-size: clamp(3.2rem, 7vw, 5rem); }
.hero h1 .accent { filter: none; }
.hero .subtitle { color: var(--text-light); font-weight: 600; }
.hero-badge { background: white; border: 2px solid rgba(0,0,0,0.05); color: var(--primary); font-weight: 800; border-radius: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); padding: 10px 24px; }
.hero-badge .dot { background: var(--primary); width: 10px; height: 10px; }
/* Fun visible orbs, big and bouncy */
.hero-bg .orb { opacity: 0.2; filter: blur(60px); }
.hero-bg .orb-1 { background: #ff9a9e; animation-duration: 4s; width: 500px; height: 500px; }
.hero-bg .orb-2 { background: #a18cd1; animation-duration: 3.5s; opacity: 0.2; width: 400px; height: 400px; }
.hero-bg .orb-3 { background: #fad0c4; animation-duration: 5s; opacity: 0.2; }
.hero-grid { display: none; }
.hero-mesh { opacity: 0; }
.hero-shapes .hero-shape { border-color: rgba(0,0,0,0.06); border-width: 3px; border-style: dashed; }
.hero-noise { display: none; }
.hero-glow-line { display: none; }
.hero-stats { border-top: 3px dashed rgba(0,0,0,0.06); }
.hero-stat .num { color: var(--primary); font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2.5rem; }
.hero-stat .lbl { color: var(--text-light); font-weight: 700; text-transform: none; letter-spacing: 0; }

/* Buttons: big pill, shadow */
.btn-fill { border-radius: 50px; font-weight: 800; background: var(--primary); color: white; box-shadow: 0 6px 25px rgba(0,0,0,0.12); padding: 18px 44px; font-size: 1rem; }
.btn-fill::after { display: none; }
.btn-fill:hover { transform: translateY(-5px) scale(1.03) rotate(-1deg); box-shadow: 0 12px 35px rgba(0,0,0,0.15); }
.btn-ghost { border-radius: 50px; font-weight: 800; border: 3px solid rgba(0,0,0,0.1); color: var(--secondary); padding: 18px 44px; font-size: 1rem; }
.btn-ghost:hover { transform: translateY(-3px) rotate(1deg); }
.btn-hero { border-radius: 50px; }

/* Nav: white, bubbly */
.nav { background: rgba(255,255,255,0.9); border-bottom: 3px solid rgba(0,0,0,0.03); }
.nav.scrolled { background: rgba(255,255,255,0.98); box-shadow: 0 4px 24px rgba(0,0,0,0.05); }
.nav-logo { color: var(--primary); font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.5rem; }
.nav-links a { color: var(--text); font-weight: 700; font-size: 0.92rem; }
.nav-cta { font-weight: 900; border-radius: 50px; background: var(--primary); color: white; font-size: 0.88rem; padding: 12px 28px; }

/* About: pastel green bg, tilted stat cards */
.about-section { background: #e8f5e9; padding: 80px 48px; }
.about-inner h2 { color: var(--secondary); }
.about-label { border-radius: 50px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.04); padding: 8px 20px; }
.about-stat-card { background: white; border: 3px solid rgba(0,0,0,0.04); box-shadow: 0 6px 24px rgba(0,0,0,0.05); border-radius: 24px; transition: all 0.3s; }
.about-stat-card:hover { transform: rotate(-2deg) scale(1.03); }
.about-stat-card .stat-lbl { color: var(--text-light); font-weight: 700; }
.about-card { border-radius: 24px; }

/* Services: pastel peach, staggered cards */
.wave-divider.dark-to-light svg { fill: #e8f5e9; }
.services-section { background: #fff3e0; padding: 80px 48px; }
.section-header h2 { color: var(--secondary); }
.bento { gap: 24px; }
.bento-card { border-radius: 28px; border: 3px solid rgba(0,0,0,0.04); background: white; box-shadow: 0 6px 24px rgba(0,0,0,0.05); }
.bento-card:nth-child(even) { transform: translateY(20px); }
.bento-card .icon { border-radius: 22px; width: 72px; height: 72px; background: linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05)); }
.bento-card .icon svg { width: 36px; height: 36px; }
.bento-card:hover { transform: translateY(-12px) rotate(-2deg); box-shadow: 0 24px 60px rgba(0,0,0,0.1); }
.bento-card:nth-child(even):hover { transform: translateY(8px) rotate(2deg); }
.bento-card.featured { grid-column: span 1; border-radius: 28px; border: none; }
.bento-card::before { height: 4px; border-radius: 2px; }
.testi-grid { grid-template-columns: repeat(2, 1fr); }

/* Why: secondary bg, bubbly cards */
.why-section { background: var(--secondary); padding: 80px 48px; }
.why-card { border-radius: 28px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.08); }
.why-card:hover { transform: translateY(-10px) rotate(1.5deg); background: rgba(255,255,255,0.16); }
.why-card .icon { border-radius: 22px; width: 64px; height: 64px; }

/* Testimonials: pastel blue */
.testi-section { background: #e3f2fd; padding: 80px 48px; }
.testi-card { border-radius: 28px; border: 3px solid rgba(0,0,0,0.04); background: white; box-shadow: 0 6px 24px rgba(0,0,0,0.05); }
.testi-card:hover { transform: translateY(-8px) rotate(-1deg); }
.testi-card:nth-child(2):hover { transform: translateY(-8px) rotate(1.5deg); }
.testi-avatar { border-radius: 22px; }

/* Contact / Footer */
.contact-section { background: var(--secondary); }
.contact-form { border-radius: 28px; }
.contact-info-item { border-radius: 22px; }
.form-field input, .form-field textarea { border-radius: 16px; border-width: 3px; }
.form-btn { border-radius: 50px; font-weight: 900; font-size: 1rem; }
.footer { background: var(--secondary); }
.cursor-glow { display: none; }
`
  },
  corporate: {
    fonts: '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    css: `
/* ═══ CORPORATE — Split hero, tight spacing, data grid cards, horizontal stat bar, boardroom feel ═══ */
body { background: #f0f4f8; }
h1,h2,h3,h4 { font-family: 'IBM Plex Sans', sans-serif; }

/* LAYOUT: Left-aligned hero with stats as horizontal bar below */
.hero { background: linear-gradient(160deg, #0c1222 0%, #162240 40%, #1a2a4a 100%); min-height: 80vh; padding-top: 140px; padding-bottom: 40px; }
.hero-content { text-align: left; max-width: 680px; margin-left: 8%; padding: 0; }
.hero h1 { font-weight: 600; letter-spacing: -1px; font-size: clamp(2.6rem, 5.5vw, 3.8rem); line-height: 1.15; margin-bottom: 20px; }
.hero h1 .accent { background: linear-gradient(90deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 100%; animation: none; }
.hero .subtitle { font-size: clamp(0.95rem, 1.6vw, 1.1rem); color: rgba(255,255,255,0.55); max-width: 480px; margin-left: 0; margin-right: auto; line-height: 1.7; }
.hero-btns { justify-content: flex-start; }
.hero-badge { border-radius: 4px; letter-spacing: 2.5px; background: rgba(255,255,255,0.06); font-size: 0.68rem; }
/* Minimal visual effects */
.hero-bg .orb { opacity: 0.06; filter: blur(140px); }
.hero-grid { background-image: none; }
.hero-mesh { opacity: 0.08; }
.hero-shapes { display: none; }
.hero-noise { display: none; }
.hero-glow-line { display: none; }
/* Stats as full-width bar */
.hero-stats { justify-content: flex-start; gap: 48px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 32px; margin-top: 48px; }
.hero-stat .num { font-size: 1.6rem; font-weight: 700; }
.hero-stat .lbl { letter-spacing: 2px; font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.4); }

/* Buttons: tight, no-nonsense */
.btn-fill { border-radius: 6px; text-transform: none; letter-spacing: 0.2px; font-size: 0.88rem; font-weight: 600; background: var(--primary); color: white; padding: 13px 28px; }
.btn-fill::after { display: none; }
.btn-fill:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-1px); }
.btn-ghost { border-radius: 6px; text-transform: none; font-weight: 600; border-width: 1.5px; }
.btn-hero { border-radius: 6px; }

/* Nav: dark, sharp */
.nav { background: rgba(12,18,34,0.6); padding: 16px 48px; }
.nav.scrolled { background: rgba(12,18,34,0.98); box-shadow: 0 1px 0 rgba(255,255,255,0.04); padding: 12px 48px; }
.nav-logo { font-family: 'IBM Plex Sans', sans-serif; font-weight: 700; letter-spacing: 0; font-size: 1.2rem; }
.nav-links a { font-size: 0.82rem; font-weight: 500; }
.nav-cta { border-radius: 6px; text-transform: none; font-size: 0.82rem; font-weight: 600; padding: 9px 20px; }

/* About: white, structured, 4-col stat bar */
.about-section { background: #ffffff; padding: 80px 48px; border-bottom: 1px solid rgba(0,0,0,0.06); }
.about-inner h2 { color: #0c1222; font-size: 2rem; font-weight: 600; }
.about-inner p { color: #64748b; font-size: 1rem; }
.about-label { border-radius: 4px; font-size: 0.7rem; letter-spacing: 2px; }
.about-stats-grid { grid-template-columns: repeat(4, 1fr); }
.about-stat-card { background: #f0f4f8; border: 1px solid rgba(0,0,0,0.06); box-shadow: none; border-radius: 8px; padding: 24px 20px; }
.about-stat-card .stat-num { font-size: 2rem; }
.about-stat-card .stat-lbl { color: #64748b; font-size: 0.78rem; }
.about-card { border-radius: 8px; }

/* Services: alternating white/grey, 4-column tight grid */
.services-section { background: #f0f4f8; padding: 70px 48px; }
.section-header h2 { color: #0c1222; font-size: 2rem; font-weight: 600; }
.section-header p { color: #64748b; }
.bento { grid-template-columns: repeat(4, 1fr); gap: 16px; }
.bento-card { border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); background: white; padding: 28px 24px; }
.bento-card .icon { border-radius: 8px; width: 44px; height: 44px; }
.bento-card .icon svg { width: 22px; height: 22px; }
.bento-card h3 { font-size: 1rem; }
.bento-card p { font-size: 0.85rem; }
.bento-card::before { height: 2px; }
.bento-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
.bento-card.featured { grid-column: span 1; background: linear-gradient(135deg, #0c1222, #1a2a4a); }

/* Why: navy, tight grid */
.why-section { background: #0c1222; padding: 70px 48px; }
.why-section::before { display: none; }
.why-section::after { opacity: 0.06; }
.why-grid { gap: 16px; }
.why-card { border-radius: 8px; background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); padding: 28px 24px; text-align: left; }
.why-card .icon { margin: 0 0 16px; border-radius: 8px; width: 44px; height: 44px; }
.why-card .icon svg { width: 22px; height: 22px; }
.why-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.05); }

/* Testimonials: horizontal scrolling marquee */
.testi-section { background: #ffffff; padding: 70px 48px; border-top: 1px solid rgba(0,0,0,0.06); overflow: hidden; }
.testi-marquee .testi-grid { display: flex; overflow: hidden; max-width: 100%; }
.testi-marquee .testi-track { display: flex; gap: 20px; animation: marqueeScroll 35s linear infinite; width: max-content; }
.testi-marquee .testi-track:hover { animation-play-state: paused; }
.testi-card { border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); padding: 28px; }
.testi-marquee .testi-card { min-width: 360px; max-width: 360px; flex-shrink: 0; }
.testi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.04); }
.testi-card .big-quote { font-size: 4rem; }

/* Contact / Footer */
.contact-section { background: #0c1222; padding: 60px 48px; }
.contact-form { border-radius: 8px; }
.contact-info-item { border-radius: 8px; }
.form-field input, .form-field textarea { border-radius: 6px; }
.form-btn { border-radius: 6px; text-transform: none; font-weight: 600; }
.footer { background: #080e1a; }
.cursor-glow { display: none; }
`
  }
};

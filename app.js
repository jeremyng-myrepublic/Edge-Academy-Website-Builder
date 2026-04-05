// ╔════════════════════════════════════════════════════════════════╗
// ║  WORKSHOP CONFIG — Paste your Anthropic API key below.       ║
// ║  When set, attendees skip the API key modal entirely.        ║
// ║  Leave empty to show the modal (for testing / dev).          ║
// ╚════════════════════════════════════════════════════════════════╝
const WORKSHOP_API_KEY = '';

// ── State (persisted in sessionStorage) ──
let apiKey = WORKSHOP_API_KEY || sessionStorage.getItem('bbb_apiKey') || '';
let generatedHTML = sessionStorage.getItem('bbb_html') || '';
let businessName = sessionStorage.getItem('bbb_name') || '';
let apiCallCount = parseInt(sessionStorage.getItem('bbb_calls') || '0');
let businessProfile = JSON.parse(sessionStorage.getItem('bbb_profile') || '{}');
let currentScreen = sessionStorage.getItem('bbb_screen') || 'modal';
const MODEL = 'claude-sonnet-4-20250514';

function saveState() {
  sessionStorage.setItem('bbb_apiKey', apiKey);
  sessionStorage.setItem('bbb_html', generatedHTML);
  sessionStorage.setItem('bbb_name', businessName);
  sessionStorage.setItem('bbb_calls', apiCallCount.toString());
  sessionStorage.setItem('bbb_profile', JSON.stringify(businessProfile));
  sessionStorage.setItem('bbb_screen', currentScreen);
}

// Restore state on load
(function restoreState() {
  // If workshop key is embedded, always skip the modal
  if (WORKSHOP_API_KEY) {
    apiKey = WORKSHOP_API_KEY;
    document.getElementById('apiModal').classList.add('hidden');
    if (currentScreen === 'modal') currentScreen = 'screen1';
  }
  if (apiKey && currentScreen !== 'modal') {
    document.getElementById('apiModal').classList.add('hidden');
    if (currentScreen === 'screen2' && generatedHTML) {
      lastContentJson = JSON.parse(sessionStorage.getItem('bbb_contentJson') || 'null');
      document.getElementById('screen2').classList.remove('hidden');
      document.getElementById('previewFrame').srcdoc = generatedHTML;
      if (lastContentJson) initQuickEditPanel();
    } else if (currentScreen === 'screen3' && generatedHTML) {
      document.getElementById('screen3').classList.remove('hidden');
      document.getElementById('s3Title').textContent = `${businessName} — Built with AI Today`;
      document.getElementById('presentFrame').srcdoc = generatedHTML;
      document.getElementById('qrCode').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://community.edgeacademy.ai';
    } else {
      document.getElementById('screen1').classList.remove('hidden');
    }
  }
})();

// Modal
function submitApiKey() {
  const k = document.getElementById('apiKeyInput').value.trim();
  if (!k) { showToast('Please enter your API key.','#e74c3c'); return; }
  apiKey = k;
  currentScreen = 'screen1';
  saveState();
  document.getElementById('apiModal').classList.add('hidden');
  document.getElementById('screen1').classList.remove('hidden');
}
document.getElementById('apiKeyInput').addEventListener('keydown', e => { if (e.key==='Enter') submitApiKey(); });
function changeApiKey() { const k = prompt('Enter new API key:',''); if (k?.trim()) { apiKey = k.trim(); saveState(); showToast('API key updated.','#22c55e'); } }


// PREFILL DEMOS
function prefillDemo(type) {
  const demos = {
    hawker: {
      name: 'Uncle Lim Char Kway Teow',
      tagline: 'Toa Payoh\'s Best Since 1987',
      about: 'We run a hawker stall in Toa Payoh serving the best char kway teow in Singapore. Our customers are lunchtime office workers and families. Biggest time drain is taking orders and managing ingredient supplies. We also sell fried oyster omelette, carrot cake, and drinks. Want help with social media and responding to online reviews.',
      contact: '9123 4567',
      location: 'Toa Payoh Lorong 8 Hawker Centre, Stall #02-15',
      color1: '#d4380d', color2: '#1a1a1a', color3: '#faad14',
      style: 'bold'
    },
    engineering: {
      name: 'Chertsey Engineering',
      tagline: 'Precision Engineering Solutions Since 1985',
      about: 'We are a precision engineering company providing CNC machining, fabrication, and assembly services for the aerospace, semiconductor, and oil & gas industries. Our customers are MNCs and Tier-1 manufacturers who need tight-tolerance components delivered on time. We offer CNC milling, turning, wire EDM, surface treatment, and full mechanical assembly.',
      contact: 'enquiry@chertsey.com.sg / 6862 3388',
      location: 'Tuas, Singapore',
      color1: '#0066cc', color2: '#1a2744', color3: '#ff8c00',
      style: 'corporate'
    },
    itservices: {
      name: 'TechServe Solutions',
      tagline: 'Your Trusted IT Partner in Asia',
      about: 'We provide managed IT services, cloud infrastructure, and cybersecurity solutions for SMEs across Southeast Asia. Our customers are businesses with 20-500 employees who need reliable IT support without a full in-house team. We offer 24/7 helpdesk, cloud migration, network security, data backup, and IT consultancy.',
      contact: 'hello@techserve.sg / 6500 1234',
      location: 'Singapore (serving SEA region)',
      color1: '#00b4d8', color2: '#0b1d3a', color3: '#00d4aa',
      style: 'modern'
    },
    consulting: {
      name: 'Innovare Group',
      tagline: 'Digital Transformation for Forward-Thinking Businesses',
      about: 'We are a management consulting firm that helps Singapore SMEs adopt AI, automation, and digital tools to improve operations and grow revenue. Our customers are business owners and C-suite leaders looking to modernise their companies. We offer digital strategy, process automation, AI implementation, and change management workshops.',
      contact: 'info@innovaregroup.sg / 8800 5566',
      location: 'Central Singapore',
      color1: '#6366f1', color2: '#1e1b4b', color3: '#f59e0b',
      style: 'elegant'
    },
    edgeacademy: {
      name: 'Edge Academy',
      tagline: 'Build Your Edge in a Global Market',
      about: 'Edge Academy is all about giving SMEs the power-up they need to stay ahead. We help businesses level up skills, explore AI and automation, and unlock tools that make work smarter, faster, and more exciting. Our customers are SME owners, corporate teams, and professionals who want practical, hands-on training — not theory. We offer bespoke corporate workshops, in-house AI & automation training, online courses, and an active learning community.',
      contact: 'hello@edgeacademy.ai',
      location: 'Singapore',
      color1: '#00b2b2', color2: '#0b275e', color3: '#184da0',
      style: 'bold',
      fontHeading: 'Orbitron',
      fontBody: 'Inter'
    },
    myrepublic: {
      name: 'MyRepublic',
      tagline: 'Internet That Keeps Up With You',
      about: 'We are a broadband and mobile provider delivering ultra-fast fibre internet, mobile plans, and managed connectivity solutions to homes and businesses across Singapore and the region. Our customers are households, gamers, and SMEs who demand reliable high-speed internet with transparent pricing. We offer fibre broadband (up to 10Gbps), mobile plans, voice solutions, and enterprise connectivity.',
      contact: 'hello@myrepublic.net / 6717 1919',
      location: 'Singapore',
      color1: '#b34fb8', color2: '#ffffff', color3: '#FF6B35',
      style: 'modern',
      fontHeading: 'Poppins',
      fontBody: 'Inter'
    },
    datacenter: {
      name: 'DayOne Data Centre',
      tagline: 'Reliable Colocation & Managed Hosting in Southeast Asia',
      about: 'We operate Tier-III data centres providing colocation, managed hosting, disaster recovery, and cloud connectivity services. Our customers are enterprises, financial institutions, and tech companies that need secure, always-on infrastructure with 99.99% uptime. We offer rack space, dedicated servers, DRaaS, network interconnects, and 24/7 NOC support.',
      contact: 'sales@dayonedc.sg / 6700 8800',
      location: 'Jurong, Singapore',
      color1: '#0ea5e9', color2: '#0c1a2e', color3: '#22d3ee',
      style: 'corporate'
    },
    renewables: {
      name: 'Cyan Renewables',
      tagline: 'Powering Asia\'s Clean Energy Transition',
      about: 'We provide offshore wind installation, marine renewable energy solutions, and green infrastructure consulting across the Asia-Pacific region. Our customers are energy developers, government agencies, and multinational utilities investing in clean energy. We offer wind turbine installation vessels, project management, marine logistics, and environmental impact consulting.',
      contact: 'info@cyanrenewables.com / 6500 3300',
      location: 'Singapore (projects across APAC)',
      color1: '#06b6d4', color2: '#0a2520', color3: '#34d399',
      style: 'modern'
    },
    logistics: {
      name: 'KBX Resources',
      tagline: 'End-to-End Supply Chain Solutions for Asia',
      about: 'We are a logistics and commodities trading company providing supply chain management, warehousing, freight forwarding, and raw materials procurement. Our customers are manufacturers, distributors, and trading companies who need reliable cross-border logistics and sourcing. We offer sea/air freight, customs brokerage, inventory management, and commodity sourcing across ASEAN.',
      contact: 'ops@kbxresources.sg / 6300 2200',
      location: 'Paya Lebar, Singapore',
      color1: '#f97316', color2: '#1c1207', color3: '#fbbf24',
      style: 'bold'
    },
    corporate: {
      name: 'DCC Corporate Services',
      tagline: 'Your Partner in Business Compliance & Corporate Governance',
      about: 'We provide corporate secretarial services, accounting, tax advisory, and business registration for SMEs and MNCs operating in Singapore. Our customers are company directors, CFOs, and business owners who need to stay compliant with ACRA, IRAS, and MAS regulations. We offer company incorporation, annual returns, bookkeeping, GST filing, and nominee director services.',
      contact: 'enquiry@dcccorp.sg / 6220 1188',
      location: 'Raffles Place, Singapore',
      color1: '#1e40af', color2: '#0f172a', color3: '#c084fc',
      style: 'elegant'
    },
    robotics: {
      name: 'RoboAct Technologies',
      tagline: 'Industrial Automation & Robotics Integration',
      about: 'We design and deploy robotic automation systems for manufacturing, warehouse logistics, and quality inspection. Our customers are factory owners, 3PL operators, and production managers looking to reduce labour dependency and improve throughput. We offer robotic arm integration, AGV/AMR deployment, vision inspection systems, PLC programming, and predictive maintenance solutions.',
      contact: 'hello@roboact.sg / 6788 9900',
      location: 'Changi Business Park, Singapore',
      color1: '#8b5cf6', color2: '#1a0f2e', color3: '#06b6d4',
      style: 'modern'
    },
    healthcare: {
      name: 'Leg & Foot Solutions',
      tagline: 'Specialist Podiatry & Orthopaedic Care',
      about: 'We provide podiatry, orthopaedic rehabilitation, and custom orthotics for patients with foot, ankle, and lower limb conditions. Our customers are individuals with sports injuries, diabetic foot conditions, and chronic pain, as well as corporate clients needing workplace ergonomic assessments. We offer gait analysis, custom insoles, shockwave therapy, and post-surgical rehabilitation.',
      contact: 'care@legfoot.sg / 6444 7766',
      location: 'Novena, Singapore',
      color1: '#14b8a6', color2: '#0f1d1b', color3: '#38bdf8',
      style: 'elegant'
    },
    fnb: {
      name: 'Incofood Management Services',
      tagline: 'Central Kitchen & Food Supply Solutions',
      about: 'We operate a central kitchen and food supply chain serving restaurants, hotels, caterers, and institutional clients across Singapore. Our customers are F&B operators who need consistent, cost-effective food preparation and ingredient sourcing. We offer ready-to-cook meal kits, bulk ingredient supply, menu R&D, HACCP-certified production, and last-mile delivery to commercial kitchens.',
      contact: 'orders@incofood.sg / 6555 2288',
      location: 'Senoko, Singapore',
      color1: '#dc2626', color2: '#1a0a0a', color3: '#fb923c',
      style: 'bold'
    }
  };

  const d = demos[type];
  if (!d) return;
  document.getElementById('fName').value = d.name;
  document.getElementById('fTagline').value = d.tagline;
  document.getElementById('fAbout').value = d.about;
  document.getElementById('fContact').value = d.contact;
  document.getElementById('fLocation').value = d.location;
  document.getElementById('fColor1').value = d.color1;
  document.getElementById('fColor2').value = d.color2;
  document.getElementById('fColor3').value = d.color3;
  document.getElementById('fStyle').value = d.style;
  if (d.fontHeading) document.getElementById('fFontHeading').value = d.fontHeading;
  if (d.fontBody) document.getElementById('fFontBody').value = d.fontBody;
  showToast('Demo loaded! Click Generate to create their website.', '#22c55e');
}

function toggleAdvanced() {
  const adv = document.getElementById('advancedOptions');
  const chk = document.getElementById('advToggle');
  adv.classList.toggle('hidden', !chk.checked);
}

  const c = contentJson;

  // Inject style-specific fonts and CSS
  const styleDef = STYLE_DEFS[profile.style] || STYLE_DEFS.bold;
  let fontsLink = styleDef.fonts;
  let extraCSS = '';

  // Custom font overrides
  const customHeading = profile.fontHeading || '';
  const customBody = profile.fontBody || '';
  if (customHeading || customBody) {
    const extraFamilies = [];
    if (customHeading && !fontsLink.includes(customHeading.replace(/ /g, '+'))) {
      extraFamilies.push(customHeading.replace(/ /g, '+') + ':wght@400;500;600;700;800');
    }
    if (customBody && customBody !== customHeading && !fontsLink.includes(customBody.replace(/ /g, '+'))) {
      extraFamilies.push(customBody.replace(/ /g, '+') + ':wght@400;500;600;700');
    }
    if (extraFamilies.length) {
      fontsLink += '\n<link href="https://fonts.googleapis.com/css2?family=' + extraFamilies.join('&family=') + '&display=swap" rel="stylesheet">';
    }
    if (customHeading) {
      extraCSS += "h1,h2,h3,h4,.nav-logo,.hero-stat .num,.about-number,.stat-num,.footer-brand { font-family: '" + customHeading + "', sans-serif !important; }\n";
    }
    if (customBody) {
      extraCSS += "body,.btn-fill,.btn-ghost,.hero-badge,.nav-links a,.nav-cta,.form-btn { font-family: '" + customBody + "', sans-serif !important; }\n";
    }
  }

  // ── Smart contrast fix: detect light/dark colours and auto-correct clashes ──
  function hexLuminance(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substr(0,2),16)/255;
    const g = parseInt(hex.substr(2,2),16)/255;
    const b = parseInt(hex.substr(4,2),16)/255;
    const toLinear = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
    return 0.2126*toLinear(r) + 0.7152*toLinear(g) + 0.0722*toLinear(b);
  }
  function isLight(hex) { return hexLuminance(hex) > 0.45; }
  function isDark(hex) { return hexLuminance(hex) < 0.15; }
  function darkenHex(hex, amount) {
    hex = hex.replace('#','');
    let r = Math.max(0, parseInt(hex.substr(0,2),16) - amount);
    let g = Math.max(0, parseInt(hex.substr(2,2),16) - amount);
    let b = Math.max(0, parseInt(hex.substr(4,2),16) - amount);
    return '#' + [r,g,b].map(c => c.toString(16).padStart(2,'0')).join('');
  }
  function lightenHex(hex, amount) {
    hex = hex.replace('#','');
    let r = Math.min(255, parseInt(hex.substr(0,2),16) + amount);
    let g = Math.min(255, parseInt(hex.substr(2,2),16) + amount);
    let b = Math.min(255, parseInt(hex.substr(4,2),16) + amount);
    return '#' + [r,g,b].map(c => c.toString(16).padStart(2,'0')).join('');
  }

  const c1 = profile.color1, c2 = profile.color2, c3 = profile.color3;
  const styleName = profile.style || 'bold';
  // Styles with light backgrounds: modern, elegant, playful, corporate (some sections)
  const lightBgStyles = ['modern', 'elegant', 'playful'];
  const hasLightBg = lightBgStyles.includes(styleName);
  // Styles with dark backgrounds: bold (and corporate hero/why/contact/footer)
  const hasDarkBg = (styleName === 'bold');

  let contrastCSS = '';
  const c1Light = isLight(c1), c2Light = isLight(c2), c3Light = isLight(c3);
  const c1Dark = isDark(c1), c2Dark = isDark(c2);

  if (hasLightBg) {
    // On light backgrounds, the "why" section uses --secondary as bg with white text
    // If secondary is light (white/pastel), the section needs a dark bg override
    if (c2Light) {
      const darkFallback = c1Dark || isDark(c1) ? c1 : (isDark(c3) ? c3 : darkenHex(c1, 140));
      contrastCSS += `.why-section { background: ${darkFallback} !important; }\n`;
      contrastCSS += `.contact-section { background: ${darkFallback} !important; }\n`;
      contrastCSS += `.footer { background: ${darkFallback} !important; }\n`;
    }
    // If primary is also very light, headings on white sections become invisible
    if (c1Light) {
      const darkPrimary = darkenHex(c1, 120);
      contrastCSS += `.about-inner h2, .section-header h2, .bento-card h3 { color: ${darkPrimary} !important; }\n`;
    }
  }

  if (hasDarkBg) {
    // On dark backgrounds, if primary is very dark, hero text and accents vanish
    if (c1Dark && c2Dark) {
      const lightFallback = c3Light ? c3 : lightenHex(c1, 140);
      contrastCSS += `.hero h1, .hero .subtitle { color: white !important; }\n`;
      contrastCSS += `.hero-badge { color: ${lightFallback} !important; border-color: ${lightFallback} !important; }\n`;
    }
    // If secondary is light/white on dark style, sections that use --secondary as bg get light bg — fix text
    if (c2Light) {
      contrastCSS += `.why-section h2, .why-section .section-header span, .why-card h3, .why-card p { color: #1a1f35 !important; }\n`;
      contrastCSS += `.why-card .icon { color: ${c1} !important; }\n`;
      contrastCSS += `.contact-section h2, .contact-section p, .contact-section .section-header span { color: #1a1f35 !important; }\n`;
      contrastCSS += `.contact-info-item h4, .contact-info-item p { color: #1a1f35 !important; }\n`;
      contrastCSS += `.contact-info-item .icon { color: ${c1} !important; }\n`;
      contrastCSS += `.footer { background: #0f172a !important; }\n`;
    }
  }

  // Corporate style: some sections dark, some light
  if (styleName === 'corporate') {
    if (c2Light) {
      contrastCSS += `.why-section { background: #0f172a !important; }\n`;
      contrastCSS += `.contact-section { background: #0f172a !important; }\n`;
      contrastCSS += `.footer { background: #0f172a !important; }\n`;
    }
    if (c1Light) {
      const darkPrimary = darkenHex(c1, 120);
      contrastCSS += `.about-inner h2, .section-header h2, .bento-card h3 { color: ${darkPrimary} !important; }\n`;
    }
  }

  extraCSS += contrastCSS;

  // ── Premium brand CSS enhancements (must be before STYLE_CSS replacement) ──
  const brandLogo = BRAND_LOGOS[profile.name];
  if (brandLogo) {
    // Premium brand-specific enhancements
    if (profile.name === 'Edge Academy') {
      extraCSS += `
        .hero { background: linear-gradient(155deg, #050d1f 0%, #0b275e 40%, #0e3a6e 60%, #071a3a 100%) !important; }
        .hero-bg .orb-1 { background: radial-gradient(circle, #00b2b2 0%, transparent 70%) !important; }
        .hero-bg .orb-2 { background: radial-gradient(circle, #184da0 0%, transparent 70%) !important; }
        .hero-bg .orb-3 { background: radial-gradient(circle, #00b2b2 0%, transparent 70%) !important; }
        .hero h1 { color: #ffffff !important; text-shadow: 0 2px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,178,178,0.2) !important; font-weight: 800 !important; }
        .hero .subtitle { color: rgba(255,255,255,0.85) !important; text-shadow: 0 1px 10px rgba(0,0,0,0.3) !important; }
        .hero-badge { background: rgba(0,178,178,0.15) !important; border-color: rgba(0,178,178,0.4) !important; color: #5eeaea !important; backdrop-filter: blur(12px) !important; }
        .hero-badge .dot { background: #00e5e5 !important; }
        .btn-fill { background: linear-gradient(135deg, #00b2b2, #00cfcf) !important; box-shadow: 0 4px 25px rgba(0,178,178,0.35) !important; }
        .btn-fill:hover { box-shadow: 0 6px 35px rgba(0,178,178,0.5) !important; }
        .bento-card.featured { background: linear-gradient(135deg, #0b275e, #184da0) !important; }
        .hero-stat .num { color: #ffffff !important; text-shadow: 0 0 20px rgba(0,178,178,0.3) !important; }
        .hero-stat .lbl { color: rgba(255,255,255,0.7) !important; }
        .nav { background: rgba(5,13,31,0.85) !important; backdrop-filter: blur(24px) !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
        .nav-links a { color: rgba(255,255,255,0.85) !important; }
        .nav-links a:hover { color: #5eeaea !important; }
        .nav-logo { color: white !important; }
        .nav.scrolled { background: rgba(11,39,94,0.97) !important; }
      `;
    }
    if (profile.name === 'MyRepublic') {
      extraCSS += `
        .hero h1 { color: #b34fb8 !important; }
        .hero .subtitle { color: #555 !important; }
        .hero-badge { background: rgba(179,79,184,0.08) !important; border-color: rgba(179,79,184,0.2) !important; color: #b34fb8 !important; }
        .hero-badge .dot { background: #b34fb8 !important; }
        .btn-fill { background: linear-gradient(135deg, #b34fb8, #c77dcc) !important; box-shadow: 0 4px 25px rgba(179,79,184,0.3) !important; }
        .btn-ghost { border-color: #b34fb8 !important; color: #b34fb8 !important; }
        .bento-card.featured { background: linear-gradient(135deg, #b34fb8, #c77dcc) !important; }
        .nav-cta { background: #b34fb8 !important; }
        .hero-stat .num { color: #b34fb8 !important; }
        .about-number { background: linear-gradient(135deg, #b34fb8, #FF6B35) !important; -webkit-background-clip: text !important; }
        .why-section { background: #b34fb8 !important; }
        .contact-section { background: #3a1540 !important; }
        .footer { background: #1f0a22 !important; }
      `;
    }
  }

  html = html.replace('{{STYLE_FONTS}}', fontsLink);
  html = html.replace('{{STYLE_CSS}}', styleDef.css + '\n' + extraCSS);

  // ── Style-specific layout mode classes ──
  const sn = profile.style || 'bold';
  // Testimonial modes: elegant=carousel, corporate=marquee, others=grid
  if (sn === 'elegant') {
    html = html.replace('class="testi-section"', 'class="testi-section testi-marquee"');
  }
  if (sn === 'corporate') {
    html = html.replace('class="testi-section"', 'class="testi-section testi-marquee"');
  }
  // Service card modes: elegant=numbered, bold=hover-reveal
  if (sn === 'elegant') {
    html = html.replace('class="services-section"', 'class="services-section numbered-cards"');
  }
  if (sn === 'bold') {
    html = html.replace('class="services-section"', 'class="services-section reveal-on-hover"');
  }
  // Stagger animation for playful
  if (sn === 'playful') {
    html = html.replace('class="services-section"', 'class="services-section stagger-cards"');
    html = html.replace('class="testi-section"', 'class="testi-section stagger-cards"');
    html = html.replace('class="why-section"', 'class="why-section stagger-cards"');
  }

  // No external images — premium CSS-only visuals
  let heroImageHTML = '';
  let aboutImageHTML = '';

  // Basic text replacements
  const r = (tag, val) => { html = html.replace(new RegExp('\\{\\{' + tag + '\\}\\}', 'g'), val); };
  r('BUSINESS_NAME', profile.name);
  r('PRIMARY_COLOR', profile.color1);
  r('SECONDARY_COLOR', profile.color2);
  r('ACCENT_COLOR', profile.color3);
  r('TAGLINE', profile.tagline || profile.name);
  r('HERO_HEADLINE', (c.heroHeadline || 'Welcome').replace(/\\n/g, '<br>'));
  r('HERO_SUBTITLE', c.heroSubtitle || 'Discover what we offer');
  r('CTA_PRIMARY_TEXT', c.ctaPrimaryText || 'Get Started');
  r('CTA_SECONDARY_TEXT', c.ctaSecondaryText || 'Learn More');
  r('ABOUT_HEADING', c.aboutHeading || 'Our Story');
  r('ABOUT_TEXT', c.aboutText || profile.about);
  // About stats grid
  let aboutStatsHTML = '';
  if (c.aboutStats && Array.isArray(c.aboutStats)) {
    c.aboutStats.forEach(function(s) {
      aboutStatsHTML += '<div class="about-stat-card"><div class="stat-num">' + s.number + '</div><div class="stat-lbl">' + s.label + '</div></div>';
    });
  }
  if (!aboutStatsHTML) {
    // Fallback to old single stat
    const num = c.aboutHighlightNumber || '100%';
    const lbl = c.aboutHighlightLabel || 'Satisfied Clients';
    aboutStatsHTML = '<div class="about-stat-card"><div class="stat-num">' + num + '</div><div class="stat-lbl">' + lbl + '</div></div>';
  }
  html = html.replace('{{ABOUT_STATS}}', aboutStatsHTML);
  r('FOOTER_TAGLINE', c.footerTagline || profile.tagline || '');

  // ── Brand logo injection (must run AFTER BUSINESS_NAME replacement) ──
  if (brandLogo) {
    const isDarkNav = ['bold'].includes(styleName);
    const logoSrc = isDarkNav ? brandLogo.light : brandLogo.dark;
    const footerLogoSrc = brandLogo.light;
    html = html.replace(
      '<div class="nav-logo">' + profile.name + '</div>',
      '<div class="nav-logo"><img src="' + logoSrc + '" alt="' + profile.name + '" style="height:36px;width:auto;display:block;"></div>'
    );
    html = html.replace(
      '<div class="footer-brand">' + profile.name + '</div>',
      '<div class="footer-brand"><img src="' + footerLogoSrc + '" alt="' + profile.name + '" style="height:30px;width:auto;margin-bottom:8px;"></div>'
    );
  }

  // Hero stats
  let statsHTML = '';
  if (c.heroStats && Array.isArray(c.heroStats)) {
    c.heroStats.forEach(function(s) {
      statsHTML += '<div class="hero-stat"><div class="num">' + s.number + '</div><div class="lbl">' + s.label + '</div></div>';
    });
  }
  html = html.replace('{{HERO_STATS}}', statsHTML);

  // Bento service cards (featured gets span-2)
  let svcHTML = '';
  if (c.serviceCards && Array.isArray(c.serviceCards)) {
    c.serviceCards.forEach(function(svc) {
      var feat = svc.featured ? ' featured' : '';
      svcHTML += '<div class="bento-card' + feat + '"><div class="icon">' + getIcon(svc.icon || 'star') + '</div><h3>' + svc.name + '</h3><p>' + svc.description + '</p></div>';
    });
  }
  html = html.replace('{{SERVICES_CARDS}}', svcHTML);

  // Why cards
  let whyHTML = '';
  if (c.whyCards && Array.isArray(c.whyCards)) {
    c.whyCards.forEach(function(w) {
      whyHTML += '<div class="why-card"><div class="icon">' + getIcon(w.icon || 'star') + '</div><h3>' + w.title + '</h3><p>' + w.description + '</p></div>';
    });
  }
  html = html.replace('{{WHY_CARDS}}', whyHTML);

  // Testimonial cards
  let testiCards = '';
  if (c.testimonials && Array.isArray(c.testimonials)) {
    c.testimonials.forEach(function(t) {
      var initial = (t.name || 'A').charAt(0).toUpperCase();
      testiCards += '<div class="testi-card"><div class="big-quote">&ldquo;</div><div class="testi-stars">★★★★★</div><p class="testi-text">' + t.quote + '</p><div class="testi-author"><div class="testi-avatar">' + initial + '</div><div class="testi-info"><div class="name">' + t.name + '</div><div class="role">' + t.role + '</div></div></div></div>';
    });
  }
  // For marquee mode (corporate): wrap in track div and duplicate cards for seamless loop
  let testiHTML = testiCards;
  if ((profile.style || 'bold') === 'corporate' || (profile.style || 'bold') === 'elegant') {
    testiHTML = '<div class="testi-track">' + testiCards + testiCards + '</div>';
  }
  html = html.replace('{{TESTIMONIAL_CARDS}}', testiHTML);

  // Contact info items
  let contactHTML = '';
  if (c.contactInfo && Array.isArray(c.contactInfo)) {
    c.contactInfo.forEach(function(ci) {
      contactHTML += '<div class="contact-info-item"><div class="ci-icon">' + getIcon(ci.icon || 'map-pin') + '</div><div><div class="ci-label">' + ci.label + '</div><div class="ci-value">' + ci.value + '</div></div></div>';
    });
  }
  html = html.replace('{{CONTACT_ITEMS}}', contactHTML);

  // ── Make all text elements directly editable ──
  const editableTags = ['h1','h2','h3','h4','p','.subtitle','.hero-badge span','.hero-stat .num','.hero-stat .lbl','.stat-num','.stat-lbl','.label','.testi-text','.name','.role','.ci-value','.ci-label','.footer-brand','.btn-fill','.btn-ghost'];
  let editScript = '<' + 'script>document.querySelectorAll("' + editableTags.join(',') + '").forEach(function(el){el.setAttribute("contenteditable","true");el.setAttribute("spellcheck","false");});</' + 'script>';
  html = html.replace('</body>', editScript + '</body>');

  return html;
}

// ════════════════════════════════════════════════════════════════
// SCREEN 1 - BUILD WEBSITE
// ════════════════════════════════════════════════════════════════

async function buildWebsite() {
  const name = document.getElementById('fName').value.trim();
  const about = document.getElementById('fAbout').value.trim();
  const services = document.getElementById('fServices').value.trim() || about;
  const customers = document.getElementById('fCustomers').value.trim() || about;
  if (!name || !about) { showToast('Please fill in all required fields (*).','#e74c3c'); return; }

  businessName = name;
  businessProfile = {
    name, about, services, customers,
    tagline: document.getElementById('fTagline').value.trim(),
    contact: document.getElementById('fContact').value.trim(),
    location: document.getElementById('fLocation').value.trim(),
    color1: document.getElementById('fColor1').value,
    color2: document.getElementById('fColor2').value,
    color3: document.getElementById('fColor3').value,
    style: document.getElementById('fStyle').value,
    fontHeading: document.getElementById('fFontHeading').value,
    fontBody: document.getElementById('fFontBody').value,
    url: document.getElementById('fUrl').value.trim()
  };

  showLoading('Generating your website...', 'AI is creating website content tailored to your business. This takes 10–15 seconds.');
  document.getElementById('buildBtn').disabled = true;

  try {
    let jsonResponse = await callClaude(CONTENT_SYSTEM_PROMPT, [{ role: 'user', content: buildContentPrompt(businessProfile) }], 2048);
    // Strip markdown fences if present
    jsonResponse = jsonResponse.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const contentJson = JSON.parse(jsonResponse);
    lastContentJson = contentJson;
    generatedHTML = fillTemplate(contentJson, businessProfile);
    apiCallCount++;
    currentScreen = 'screen2';
    saveState();
    // Also store content JSON for quick-edit re-rendering
    sessionStorage.setItem('bbb_contentJson', JSON.stringify(contentJson));
    hideLoading();
    document.getElementById('screen1').classList.add('hidden');
    document.getElementById('screen2').classList.remove('hidden');
    initQuickEditPanel();
    renderPreview();
  } catch(err) {
    hideLoading();
    document.getElementById('buildBtn').disabled = false;
    showToast('Error: ' + err.message, '#e74c3c');
  }
}

// ════════════════════════════════════════════════════════════════
// SCREEN 2 - QUICK EDIT CONTROLS (instant, no API calls)
// ════════════════════════════════════════════════════════════════

// Store the original generated content JSON so we can re-render the template
let lastContentJson = null;

function initQuickEditPanel() {
  // Sync quick-edit controls with the profile that was used to generate
  if (businessProfile.color1) document.getElementById('qeColor1').value = businessProfile.color1;
  if (businessProfile.color2) document.getElementById('qeColor2').value = businessProfile.color2;
  if (businessProfile.color3) document.getElementById('qeColor3').value = businessProfile.color3;

  // Set style button active state
  const styleBtns = document.querySelectorAll('.qe-style-btn');
  styleBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.style === (businessProfile.style || 'modern'));
  });

  // Set font dropdowns
  const fh = document.getElementById('qeFontHeading');
  const fb = document.getElementById('qeFontBody');
  if (businessProfile.fontHeading) fh.value = businessProfile.fontHeading;
  if (businessProfile.fontBody) fb.value = businessProfile.fontBody;

  // Reset all section toggles to checked
  ['Stats','About','Services','Why','Testi','Contact'].forEach(s => {
    document.getElementById('qeToggle' + s).checked = true;
  });
}

function setStyle(btn) {
  document.querySelectorAll('.qe-style-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyQuickEdits();
}

function applyQuickEdits() {
  if (!lastContentJson || !businessProfile.name) return;

  // Update profile with new values from quick-edit panel
  businessProfile.color1 = document.getElementById('qeColor1').value;
  businessProfile.color2 = document.getElementById('qeColor2').value;
  businessProfile.color3 = document.getElementById('qeColor3').value;
  businessProfile.fontHeading = document.getElementById('qeFontHeading').value;
  businessProfile.fontBody = document.getElementById('qeFontBody').value;

  const activeStyle = document.querySelector('.qe-style-btn.active');
  if (activeStyle) businessProfile.style = activeStyle.dataset.style;

  // Re-generate HTML from template with updated profile
  generatedHTML = fillTemplate(lastContentJson, businessProfile);

  // Apply section visibility toggles by injecting CSS
  let hideCSS = '';
  if (!document.getElementById('qeToggleStats').checked) hideCSS += '.hero-stats { display: none !important; }\n';
  if (!document.getElementById('qeToggleAbout').checked) hideCSS += '.about-section, .wave-divider.dark-to-light { display: none !important; }\n';
  if (!document.getElementById('qeToggleServices').checked) hideCSS += '.services-section { display: none !important; }\n';
  if (!document.getElementById('qeToggleWhy').checked) hideCSS += '.why-section { display: none !important; }\n';
  if (!document.getElementById('qeToggleTesti').checked) hideCSS += '.testi-section { display: none !important; }\n';
  if (!document.getElementById('qeToggleContact').checked) hideCSS += '.contact-section { display: none !important; }\n';

  if (hideCSS) {
    generatedHTML = generatedHTML.replace('</head>', '<style>' + hideCSS + '</style></head>');
  }

  saveState();
  renderPreview();
}

// ════════════════════════════════════════════════════════════════
// PREVIEW & DOWNLOAD
// ════════════════════════════════════════════════════════════════

function renderPreview() {
  const frame = document.getElementById('previewFrame');
  frame.srcdoc = generatedHTML;
}

// Listen for HTML responses from the iframe
let pendingHTMLCallback = null;
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'htmlResponse') {
    generatedHTML = e.data.html;
    saveState();
    if (pendingHTMLCallback) { pendingHTMLCallback(); pendingHTMLCallback = null; }
  }
});

function syncEditedHTML(cb) {
  const frame = document.getElementById('previewFrame');
  pendingHTMLCallback = cb || null;
  try {
    frame.contentWindow.postMessage({ type: 'getHTML' }, '*');
  } catch(e) { if (cb) cb(); }
  // Fallback timeout in case postMessage fails
  setTimeout(function() { if (pendingHTMLCallback) { pendingHTMLCallback(); pendingHTMLCallback = null; } }, 500);
}

function downloadSite() {
  syncEditedHTML(function() {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (businessName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'my-website') + '.html';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Website downloaded!', '#22c55e');
  });
}

// ════════════════════════════════════════════════════════════════
// SCREEN 3 - PRESENTATION
// ════════════════════════════════════════════════════════════════

function showScreen3() {
  syncEditedHTML(function() {
    // Turn off edit mode before presenting
    currentScreen = 'screen3';
    saveState();
    document.getElementById('screen2').classList.add('hidden');
    document.getElementById('screen3').classList.remove('hidden');
    document.getElementById('s3Title').textContent = `${businessName} — Built with AI Today`;
    document.getElementById('presentFrame').srcdoc = generatedHTML;
    document.getElementById('qrCode').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://community.edgeacademy.ai';
  });
}

function startOver() {
  generatedHTML = ''; apiCallCount = 0; businessName = ''; businessProfile = {}; lastContentJson = null;
  currentScreen = 'screen1';
  sessionStorage.clear();
  // Preserve workshop key if embedded
  if (WORKSHOP_API_KEY) apiKey = WORKSHOP_API_KEY;
  ['fName','fTagline','fAbout','fServices','fCustomers','fContact','fLocation','fUrl'].forEach(id => { const el = document.getElementById(id); if (el.tagName==='TEXTAREA'||el.tagName==='INPUT') el.value = ''; });
  document.getElementById('fColor1').value = '#00b2b2';
  document.getElementById('fColor2').value = '#0b275e';
  document.getElementById('fColor3').value = '#FFD700';
  document.getElementById('fStyle').selectedIndex = 0;
  document.getElementById('fFontHeading').selectedIndex = 0;
  document.getElementById('fFontBody').selectedIndex = 0;
  document.getElementById('buildBtn').disabled = false;
  document.getElementById('screen3').classList.add('hidden');
  document.getElementById('screen1').classList.remove('hidden');
}

// ════════════════════════════════════════════════════════════════
// API UTILITIES
// ════════════════════════════════════════════════════════════════

async function callClaude(system, messages, maxTokens = 4096) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
  });
  if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err.error?.message || `API error ${res.status}`); }
  const data = await res.json();
  return data.content[0].text;
}

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

function showLoading(t, s) { document.getElementById('loadingText').textContent = t; document.getElementById('loadingSub').textContent = s||''; document.getElementById('loadingOverlay').classList.remove('hidden'); }
function hideLoading() { document.getElementById('loadingOverlay').classList.add('hidden'); }
function togglePanel() {
  const panel = document.getElementById('s2Left');
  const label = document.getElementById('panelToggleLabel');
  const arrow = document.getElementById('panelToggleArrow');
  panel.classList.toggle('collapsed');
  const hidden = panel.classList.contains('collapsed');
  label.textContent = hidden ? 'Show Edit Panel' : 'Hide Edit Panel';
  arrow.classList.toggle('up', !hidden);
}

function showToast(m, c='#0b275e') { const t = document.getElementById('toast'); t.textContent = m; t.style.background = c; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 3000); }

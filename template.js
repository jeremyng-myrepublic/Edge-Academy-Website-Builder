const WEBSITE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{BUSINESS_NAME}}</title>
{{STYLE_FONTS}}
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --primary: {{PRIMARY_COLOR}};
  --secondary: {{SECONDARY_COLOR}};
  --accent: {{ACCENT_COLOR}};
  --dark: #060b18;
  --light: #f7f8fc;
  --text: #1a1f35;
  --text-light: #64748b;
  --radius: 20px;
}
html { scroll-behavior: smooth; }
body { font-family: 'Inter', system-ui, sans-serif; color: var(--text); background: var(--dark); line-height: 1.6; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }

/* ── NAV ── */
.nav { position: fixed; top: 0; width: 100%; z-index: 1000; padding: 20px 48px; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s; background: rgba(6, 11, 24, 0.3); backdrop-filter: blur(12px); }
.nav.scrolled { background: rgba(6, 11, 24, 0.95); backdrop-filter: blur(20px); padding: 14px 48px; box-shadow: 0 4px 30px rgba(0,0,0,0.3); }
.nav-logo { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: white; letter-spacing: -0.5px; }
.nav-links { display: flex; gap: 32px; }
.nav-links a { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.3s; letter-spacing: 0.3px; }
.nav-links a:hover { color: var(--accent); }
.nav-cta { padding: 10px 24px; background: var(--accent); color: white; font-weight: 700; font-size: 0.85rem; border: none; border-radius: 50px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; }
.nav-cta:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(255,255,255,0.15); }

/* ── HERO ── */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: var(--dark); padding-top: 120px; padding-bottom: 60px; }
.hero-bg { position: absolute; inset: 0; }
.hero-bg .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; animation: orbFloat 8s ease-in-out infinite; }
.hero-bg .orb-1 { width: 600px; height: 600px; background: var(--primary); top: -10%; right: -5%; animation-delay: 0s; }
.hero-bg .orb-2 { width: 400px; height: 400px; background: var(--accent); bottom: -10%; left: 10%; animation-delay: -3s; opacity: 0.3; }
.hero-bg .orb-3 { width: 300px; height: 300px; background: var(--secondary); top: 40%; left: 50%; animation-delay: -5s; opacity: 0.25; }
@keyframes orbFloat { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px) scale(1.05); } 66% { transform: translate(-20px, 15px) scale(0.95); } }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px; }
/* ── ANIMATED GRADIENT MESH ── */
.hero-mesh { position: absolute; inset: 0; opacity: 0.4; background: 
  radial-gradient(ellipse 80% 50% at 20% 40%, var(--primary), transparent),
  radial-gradient(ellipse 60% 80% at 80% 20%, var(--accent), transparent),
  radial-gradient(ellipse 50% 60% at 50% 80%, var(--secondary), transparent);
  animation: meshShift 12s ease-in-out infinite alternate; }
@keyframes meshShift { 0% { filter: hue-rotate(0deg) blur(0px); opacity: 0.4; } 50% { filter: hue-rotate(15deg) blur(10px); opacity: 0.5; } 100% { filter: hue-rotate(-10deg) blur(0px); opacity: 0.35; } }
/* ── FLOATING GEOMETRIC SHAPES ── */
.hero-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.hero-shape { position: absolute; border: 1.5px solid rgba(255,255,255,0.08); animation: shapeFloat 20s ease-in-out infinite; }
.hero-shape:nth-child(1) { width: 120px; height: 120px; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; top: 15%; left: 8%; animation-delay: 0s; }
.hero-shape:nth-child(2) { width: 80px; height: 80px; border-radius: 50%; top: 60%; right: 12%; animation-delay: -5s; border-color: rgba(255,255,255,0.05); }
.hero-shape:nth-child(3) { width: 60px; height: 60px; border-radius: 20%; top: 25%; right: 25%; animation-delay: -10s; transform: rotate(45deg); }
.hero-shape:nth-child(4) { width: 100px; height: 100px; border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%; bottom: 20%; left: 25%; animation-delay: -7s; }
@keyframes shapeFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-20px) rotate(5deg); } 50% { transform: translateY(10px) rotate(-3deg); } 75% { transform: translateY(-15px) rotate(8deg); } }
/* ── NOISE TEXTURE OVERLAY ── */
.hero-noise { position: absolute; inset: 0; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
/* ── GLOWING ACCENT LINE ── */
.hero-glow-line { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 0%, var(--accent) 20%, var(--primary) 50%, var(--accent) 80%, transparent 100%); opacity: 0.6; animation: glowPulse 3s ease-in-out infinite; }
@keyframes glowPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }

.hero-content { position: relative; z-index: 2; max-width: 800px; padding: 0 48px; text-align: center; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 50px; color: var(--accent); font-size: 0.75rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 28px; backdrop-filter: blur(10px); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hero-badge .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.hero h1 { font-size: clamp(3rem, 7vw, 5rem); font-weight: 700; color: white; line-height: 1.1; letter-spacing: -2px; margin-bottom: 24px; }
.hero h1 .accent { background: linear-gradient(135deg, var(--accent), var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% 100%; animation: shimmer 4s ease-in-out infinite; }
@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.hero .subtitle { font-size: clamp(1.05rem, 2.5vw, 1.3rem); color: rgba(255,255,255,0.7); max-width: 580px; line-height: 1.7; margin-bottom: 40px; margin-left: auto; margin-right: auto; }
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.btn-hero { padding: 16px 36px; border-radius: 14px; border: none; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; letter-spacing: 0.3px; }
.btn-fill { background: var(--accent); color: white; box-shadow: 0 0 40px rgba(255,215,0,0.2); position: relative; overflow: hidden; }
.btn-fill::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%); animation: btnSheen 3s ease-in-out infinite; }
@keyframes btnSheen { 0%, 100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }
.btn-fill:hover { transform: translateY(-3px); box-shadow: 0 0 60px rgba(255,215,0,0.35); }
.btn-ghost { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.25); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: rgba(255,255,255,0.05); }
.hero-stats { display: flex; gap: 48px; margin-top: 64px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); justify-content: center; }
.hero-stat .num { font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: white; }
.hero-stat .lbl { font-size: 0.82rem; color: rgba(255,255,255,0.5); margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

/* ── WAVE DIVIDER ── */
.wave-divider { width: 100%; line-height: 0; }
.wave-divider svg { width: 100%; height: 50px; display: block; }
.wave-divider.dark-to-light svg { fill: var(--light); }
.wave-divider.light-to-dark svg { fill: var(--dark); }

/* ── ABOUT ── */
.about-section { background: var(--light); padding: 70px 48px; }
.about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.about-label { display: inline-block; font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); margin-bottom: 16px; padding: 6px 16px; background: rgba(0,119,182,0.08); border-radius: 6px; }
.about-inner h2 { font-size: 2.8rem; font-weight: 700; color: var(--secondary); line-height: 1.15; letter-spacing: -1px; margin-bottom: 24px; }
.about-inner p { font-size: 1.1rem; color: var(--text-light); line-height: 1.85; margin-bottom: 16px; }
.about-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.about-stat-card { background: rgba(255,255,255,0.06); border-radius: 16px; padding: 28px 24px; text-align: center; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
.about-stat-card .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 2.6rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.2; margin-bottom: 6px; }
.about-stat-card .stat-lbl { font-size: 0.85rem; color: var(--text-light); font-weight: 500; }
.about-visual { position: relative; }
.about-card { background: white; border-radius: var(--radius); padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); }
.about-number { font-family: 'Space Grotesk', sans-serif; font-size: 4.5rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
.about-number-label { font-size: 1.1rem; font-weight: 600; color: var(--secondary); margin-top: 12px; }
.about-card-accent { position: absolute; top: -12px; right: -12px; width: 80px; height: 80px; background: var(--accent); border-radius: 16px; opacity: 0.15; transform: rotate(15deg); }



/* ── SERVICES ── */
.services-section { background: var(--light); padding: 60px 48px 70px; }
.section-header { text-align: center; max-width: 600px; margin: 0 auto 40px; }
.section-header .label { display: inline-block; font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }
.section-header h2 { font-size: 2.8rem; font-weight: 700; color: var(--secondary); letter-spacing: -1px; margin-bottom: 16px; }
.section-header p { color: var(--text-light); font-size: 1.05rem; }
.bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
.bento-card { background: white; border-radius: var(--radius); padding: 36px 32px; border: 1px solid rgba(0,0,0,0.06); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; overflow: hidden; }
.bento-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent)); transform: scaleX(0); transition: transform 0.4s; transform-origin: left; }
.bento-card:hover::before { transform: scaleX(1); }
.bento-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
.bento-card .icon { width: 56px; height: 56px; background: linear-gradient(135deg, rgba(0,119,182,0.1), rgba(0,178,178,0.1)); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--primary); }
.bento-card .icon svg { width: 28px; height: 28px; stroke-width: 1.5; }
.bento-card h3 { font-size: 1.15rem; font-weight: 700; color: var(--secondary); margin-bottom: 10px; }
.bento-card p { color: var(--text-light); font-size: 0.92rem; line-height: 1.7; }
.bento-card.featured { grid-column: span 1; background: linear-gradient(135deg, var(--secondary), var(--primary)); color: white; }
.bento-card.featured h3 { color: white; }
.bento-card.featured p { color: rgba(255,255,255,0.8); }
.bento-card.featured .icon { background: rgba(255,255,255,0.15); color: white; }
.bento-card.featured::before { background: var(--accent); }

/* ── WHY US ── */
.why-section { background: var(--dark); padding: 70px 48px; position: relative; overflow: hidden; }
.why-section::before { content: ''; position: absolute; top: 50%; left: 50%; width: 800px; height: 800px; background: radial-gradient(circle, rgba(0,119,182,0.1) 0%, transparent 70%); transform: translate(-50%, -50%); }
.why-section::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.3; }
.why-section .section-header h2 { color: white; }
.why-section .section-header p { color: rgba(255,255,255,0.6); }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }
.why-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 36px 28px; text-align: center; transition: all 0.4s; backdrop-filter: blur(10px); }
.why-card:hover { background: rgba(255,255,255,0.08); border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 0 30px rgba(255,215,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1); }
.why-card .icon { width: 56px; height: 56px; margin: 0 auto 20px; background: rgba(255,255,255,0.06); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
.why-card .icon svg { width: 28px; height: 28px; stroke-width: 1.5; }
.why-card h3 { color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
.why-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.6; }

/* ── TESTIMONIALS ── */
.testi-section { background: var(--light); padding: 70px 48px; }
.testi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 1200px; margin: 0 auto; }
.testi-card { background: white; border-radius: var(--radius); padding: 36px; border: 1px solid rgba(0,0,0,0.06); position: relative; transition: all 0.3s; }
.testi-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
.testi-card .big-quote { position: absolute; top: 20px; right: 28px; font-size: 5rem; font-family: Georgia, serif; color: var(--accent); opacity: 0.15; line-height: 1; }
.testi-stars { color: var(--accent); font-size: 1rem; letter-spacing: 2px; margin-bottom: 16px; }
.testi-text { font-size: 1.02rem; line-height: 1.8; color: var(--text); margin-bottom: 24px; font-style: italic; position: relative; z-index: 2; }
.testi-author { display: flex; align-items: center; gap: 12px; }
.testi-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem; }
.testi-info .name { font-weight: 700; color: var(--secondary); font-size: 0.95rem; }
.testi-info .role { font-size: 0.82rem; color: var(--text-light); }

/* ── CONTACT ── */
.contact-section { background: var(--dark); padding: 70px 48px; position: relative; }
.contact-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; position: relative; z-index: 2; }
.contact-section .section-header { text-align: left; margin: 0 0 40px; }
.contact-section .section-header h2 { color: white; text-align: left; }
.contact-section .section-header p { color: rgba(255,255,255,0.6); }
.contact-info-list { display: flex; flex-direction: column; gap: 24px; }
.contact-info-item { display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; transition: all 0.3s; }
.contact-info-item:hover { background: rgba(255,255,255,0.08); border-color: var(--accent); }
.contact-info-item .ci-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; }
.contact-info-item .ci-icon svg { width: 22px; height: 22px; stroke-width: 1.5; }
.contact-info-item .ci-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
.contact-info-item .ci-value { color: white; font-weight: 600; margin-top: 2px; }
.contact-form { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 40px; backdrop-filter: blur(10px); }
.contact-form h3 { color: white; font-size: 1.3rem; margin-bottom: 24px; }
.form-field { margin-bottom: 16px; }
.form-field input, .form-field textarea { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-family: inherit; font-size: 0.95rem; transition: all 0.3s; }
.form-field input::placeholder, .form-field textarea::placeholder { color: rgba(255,255,255,0.3); }
.form-field input:focus, .form-field textarea:focus { outline: none; border-color: var(--accent); background: rgba(255,255,255,0.08); }
.form-field textarea { resize: vertical; min-height: 100px; }
.form-btn { width: 100%; padding: 16px; background: var(--accent); color: var(--dark); border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
.form-btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,215,0,0.25); }

/* ── FOOTER ── */
.footer { background: var(--dark); border-top: 1px solid rgba(255,255,255,0.06); padding: 40px 48px; text-align: center; }
.footer-brand { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 8px; }
.footer p { color: rgba(255,255,255,0.4); font-size: 0.85rem; }

/* ── CURSOR GLOW ── */
.cursor-glow { position: fixed; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%); pointer-events: none; z-index: 1; transform: translate(-50%, -50%); transition: opacity 0.3s; opacity: 0; }
.cursor-glow.active { opacity: 1; }

/* ── STYLE-SPECIFIC LAYOUT MODES (activated per-style) ── */

/* CAROUSEL MODE: show one testimonial at a time, auto-rotate */
@keyframes carouselSlide { 0%,22% { opacity: 1; transform: translateX(0); } 25%,97% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
.testi-carousel .testi-grid { display: block; position: relative; min-height: 280px; }
.testi-carousel .testi-card { position: absolute; inset: 0; opacity: 0; animation: carouselSlide 16s infinite; }
.testi-carousel .testi-card:nth-child(1) { animation-delay: 0s; }
.testi-carousel .testi-card:nth-child(2) { animation-delay: 4s; }
.testi-carousel .testi-card:nth-child(3) { animation-delay: 8s; }
.testi-carousel .testi-card:nth-child(4) { animation-delay: 12s; }

/* MARQUEE MODE: horizontal infinite scroll */
@keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.testi-marquee .testi-grid { display: flex; gap: 24px; overflow: hidden; flex-wrap: nowrap; max-width: 100%; }
.testi-marquee .testi-grid .testi-card { min-width: 340px; max-width: 340px; flex-shrink: 0; }
.testi-marquee .testi-track { display: flex; gap: 24px; animation: marqueeScroll 30s linear infinite; width: max-content; }

/* STAGGER-IN MODE: cards animate in one by one */
@keyframes staggerIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.stagger-cards .bento-card, .stagger-cards .why-card, .stagger-cards .testi-card { opacity: 0; animation: staggerIn 0.6s ease-out forwards; }
.stagger-cards .bento-card:nth-child(1), .stagger-cards .why-card:nth-child(1), .stagger-cards .testi-card:nth-child(1) { animation-delay: 0.1s; }
.stagger-cards .bento-card:nth-child(2), .stagger-cards .why-card:nth-child(2), .stagger-cards .testi-card:nth-child(2) { animation-delay: 0.25s; }
.stagger-cards .bento-card:nth-child(3), .stagger-cards .why-card:nth-child(3), .stagger-cards .testi-card:nth-child(3) { animation-delay: 0.4s; }
.stagger-cards .bento-card:nth-child(4), .stagger-cards .why-card:nth-child(4), .stagger-cards .testi-card:nth-child(4) { animation-delay: 0.55s; }

/* NUMBER LABELS: show index numbers on service cards */
.numbered-cards .bento-card { counter-increment: svc; padding-left: 80px; position: relative; }
.numbered-cards .bento-card::after { content: counter(svc, decimal-leading-zero); position: absolute; top: 36px; left: 24px; font-size: 2.2rem; font-weight: 700; opacity: 0.1; font-family: 'Space Grotesk', 'IBM Plex Sans', sans-serif; }
.numbered-cards .bento { counter-reset: svc; }

/* HOVER REVEAL: hide descriptions until hover */
.reveal-on-hover .bento-card p { max-height: 0; overflow: hidden; opacity: 0; margin: 0; transition: all 0.4s ease; }
.reveal-on-hover .bento-card:hover p { max-height: 200px; opacity: 1; margin-top: 10px; }
.reveal-on-hover .bento-card { cursor: pointer; }

/* ── REVEAL ANIMATIONS ── */
.reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.35s; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .bento { grid-template-columns: repeat(2, 1fr); }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
  .testi-grid { grid-template-columns: 1fr; }
  .contact-inner { grid-template-columns: 1fr; }
  .hero-stats { gap: 32px; }
  .about-inner { gap: 48px; }
}
@media (max-width: 768px) {
  .nav { padding: 14px 20px; }
  .nav-logo { font-size: 1.15rem; }
  .nav-links { display: none; }
  .nav-cta { padding: 8px 18px; font-size: 0.75rem; }
  .hero { min-height: 100svh; padding-top: 110px; padding-bottom: 50px; }
  .hero-content { padding: 0 20px; }
  .hero h1 { font-size: 2.2rem; letter-spacing: -1px; }
  .hero .subtitle { font-size: 1rem; margin-bottom: 28px; }
  .hero-badge { font-size: 0.65rem; padding: 6px 14px; margin-bottom: 20px; }
  .hero-btns { flex-direction: column; gap: 12px; }
  .btn-hero { width: 100%; text-align: center; padding: 14px 24px; font-size: 0.95rem; }
  .hero-stats { flex-direction: column; gap: 20px; margin-top: 40px; padding-top: 28px; }
  .hero-stat .num { font-size: 1.8rem; }
  .hero-stat .lbl { font-size: 0.72rem; }
  .hero-bg .orb-1 { width: 300px; height: 300px; }
  .hero-bg .orb-2 { width: 200px; height: 200px; }
  .hero-bg .orb-3 { width: 150px; height: 150px; }
  .hero-shapes { display: none; }
  .about-section, .services-section, .testi-section, .why-section, .contact-section { padding: 48px 20px; }
  .about-inner { grid-template-columns: 1fr; gap: 32px; }
  .about-inner h2 { font-size: 1.8rem; }
  .about-inner p { font-size: 1rem; }
  .about-stats-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
  .about-stat-card { padding: 20px 16px; }
  .about-stat-card .stat-num { font-size: 2rem; }
  .section-header { margin-bottom: 28px; }
  .section-header h2 { font-size: 2rem; }
  .section-header p { font-size: 0.95rem; }
  .bento { grid-template-columns: 1fr; gap: 16px; }
  .bento-card { padding: 28px 24px; }
  .bento-card.featured { grid-column: span 1; }
  .bento-card .icon { width: 48px; height: 48px; }
  .why-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
  .why-card { padding: 24px 20px; }
  .why-card .icon { width: 44px; height: 44px; margin-bottom: 14px; }
  .why-card h3 { font-size: 1rem; }
  .why-card p { font-size: 0.82rem; }
  .testi-grid { grid-template-columns: 1fr; gap: 16px; }
  .testi-card { padding: 28px; }
  .testi-card .big-quote { font-size: 3.5rem; top: 14px; right: 18px; }
  .testi-text { font-size: 0.95rem; }
  .contact-inner { grid-template-columns: 1fr; gap: 32px; }
  .contact-section .section-header { text-align: center; }
  .contact-section .section-header h2 { text-align: center; }
  .contact-form { padding: 28px; }
  .footer { padding: 32px 20px; }
  .wave-divider svg { height: 30px; }
  .cursor-glow { display: none; }
  /* Responsive: reset style-specific layouts */
  .hero-content { margin-left: auto !important; text-align: center !important; }
  .hero-btns { justify-content: center !important; }
  .hero-stats { justify-content: center !important; }
  .about-inner { grid-template-columns: 1fr !important; text-align: center !important; }
  .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
  .about-visual { display: block !important; }
  .bento { grid-template-columns: 1fr !important; }
  .bento-card { padding-left: 28px !important; }
  .bento-card:nth-child(even) { transform: none !important; }
  .numbered-cards .bento-card::after { display: none; }
  .testi-carousel .testi-grid { min-height: 380px; }
  .testi-marquee .testi-card { min-width: 280px !important; max-width: 280px !important; }
}
@media (max-width: 420px) {
  .hero h1 { font-size: 1.85rem; }
  .hero .subtitle { font-size: 0.92rem; }
  .why-grid { grid-template-columns: 1fr; }
  .section-header h2 { font-size: 1.7rem; }
  .about-inner h2 { font-size: 1.6rem; }
}
{{STYLE_CSS}}

/* ── INLINE TEXT EDITING ── */
[contenteditable] { outline: none; cursor: text; border-radius: 4px; transition: box-shadow 0.2s; }
[contenteditable]:hover { box-shadow: inset 0 0 0 2px rgba(0,212,170,0.35); }
[contenteditable]:focus { box-shadow: inset 0 0 0 2px rgba(0,212,170,0.7); background: rgba(0,212,170,0.06); }

/* ── FLOATING FORMAT TOOLBAR ── */
#editToolbar { position: fixed; z-index: 99999; display: none; align-items: center; gap: 6px; background: #1a1f35; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 6px 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); font-family: 'Inter', sans-serif; }
#editToolbar.visible { display: flex; }
#editToolbar button { background: rgba(255,255,255,0.08); border: none; color: #e8ecf4; width: 30px; height: 30px; border-radius: 7px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
#editToolbar button:hover { background: rgba(0,212,170,0.25); color: #00d4aa; }
#editToolbar .tb-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.1); margin: 0 2px; }
#editToolbar .tb-size { font-size: 12px; color: #8b95a8; min-width: 36px; text-align: center; font-weight: 600; pointer-events: none; }
#editToolbar input[type="color"] { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.12); border-radius: 7px; padding: 0; cursor: pointer; background: none; -webkit-appearance: none; }
#editToolbar input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
#editToolbar input[type="color"]::-webkit-color-swatch { border: none; border-radius: 4px; }
#editToolbar .tb-bold { font-weight: 800; }

</style>
</head>
<body>

<!-- Floating format toolbar -->
<div id="editToolbar">
  <button onclick="tbSize(-1)" title="Decrease size">A−</button>
  <span class="tb-size" id="tbSizeLabel">16</span>
  <button onclick="tbSize(1)" title="Increase size">A+</button>
  <div class="tb-sep"></div>
  <button class="tb-bold" onclick="tbBold()" title="Bold">B</button>
  <div class="tb-sep"></div>
  <input type="color" id="tbColor" value="#ffffff" onchange="tbApplyColor(this.value)" title="Text colour">
</div>

<div class="cursor-glow" id="cursorGlow"></div>
<nav class="nav">
  <div class="nav-logo">{{BUSINESS_NAME}}</div>
  <div class="nav-links">
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#why">Why Us</a>
    <a href="#contact">Contact</a>
  </div>
  <button class="nav-cta">{{CTA_PRIMARY_TEXT}}</button>
</nav>

<section class="hero">
  <div class="hero-bg">
    <div class="hero-mesh"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  <div class="hero-grid"></div>
  <div class="hero-noise"></div>
  <div class="hero-shapes">
    <div class="hero-shape"></div>
    <div class="hero-shape"></div>
    <div class="hero-shape"></div>
    <div class="hero-shape"></div>
  </div>
  <div class="hero-glow-line"></div>
  <div class="hero-content">
    <!-- hero-badge removed -->
    <h1>{{HERO_HEADLINE}}</h1>
    <p class="subtitle">{{HERO_SUBTITLE}}</p>
    <div class="hero-btns">
      <button class="btn-hero btn-fill">{{CTA_PRIMARY_TEXT}}</button>
      <button class="btn-hero btn-ghost">{{CTA_SECONDARY_TEXT}}</button>
    </div>
    <div class="hero-stats">
      {{HERO_STATS}}
    </div>
  </div>
</section>

<div class="wave-divider dark-to-light"><svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"/></svg></div>

<section class="about-section" id="about">
  <div class="about-inner">
    <div class="reveal">
      <div class="about-label">About Us</div>
      <h2>{{ABOUT_HEADING}}</h2>
      <p>{{ABOUT_TEXT}}</p>
    </div>
    <div class="about-visual reveal reveal-delay-2">
      <div class="about-stats-grid">{{ABOUT_STATS}}</div>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <div class="section-header reveal">
    <div class="label">What We Offer</div>
    <h2>Our Services</h2>
  </div>
  <div class="bento">
    {{SERVICES_CARDS}}
  </div>
</section>

<div class="wave-divider light-to-dark"><svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z" fill="#060b18"/></svg></div>

<section class="why-section" id="why">
  <div class="section-header reveal">
    <div class="label" style="color: var(--accent);">Why Us</div>
    <h2>Why Choose Us</h2>
    <p>What sets us apart from the rest</p>
  </div>
  <div class="why-grid">
    {{WHY_CARDS}}
  </div>
</section>

<div class="wave-divider dark-to-light"><svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"/></svg></div>

<section class="testi-section">
  <div class="section-header reveal">
    <div class="label">Testimonials</div>
    <h2>What People Say</h2>
  </div>
  <div class="testi-grid">
    {{TESTIMONIAL_CARDS}}
  </div>
</section>

<div class="wave-divider light-to-dark"><svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z" fill="#060b18"/></svg></div>

<section class="contact-section" id="contact">
  <div class="contact-inner">
    <div>
      <div class="section-header reveal">
        <div class="label" style="color: var(--accent);">Contact</div>
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you</p>
      </div>
      <div class="contact-info-list">
        {{CONTACT_ITEMS}}
      </div>
    </div>
    <div class="contact-form reveal reveal-delay-2">
      <h3>Send us a message</h3>
      <div class="form-field"><input type="text" placeholder="Your name"></div>
      <div class="form-field"><input type="email" placeholder="your@email.com"></div>
      <div class="form-field"><textarea placeholder="How can we help?"></textarea></div>
      <button type="button" class="form-btn">Send Message</button>
    </div>
  </div>
</section>

<div class="footer">
  <div class="footer-brand">{{BUSINESS_NAME}}</div>
  <p>{{FOOTER_TAGLINE}}</p>
  <p style="margin-top: 12px; opacity: 0.4;">Built with AI by Edge Academy &copy; 2026</p>
</div>

<` + `script>
// Sticky nav
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });


// Nav link smooth scroll (works inside sandboxed iframes)
document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href') || '#contact';
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Scroll reveal
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// Stagger cards
const cards = document.querySelectorAll('.bento-card, .why-card, .testi-card');
const co = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; co.unobserve(e.target); }
  });
}, { threshold: 0.1 });
cards.forEach((c, i) => {
  c.style.opacity = '0'; c.style.transform = 'translateY(30px)';
  c.style.transition = 'all 0.6s cubic-bezier(0.25,0.8,0.25,1) ' + (i % 4 * 0.12) + 's';
  co.observe(c);
});

// ── NUMBER COUNTING ANIMATION ──
function animateCount(el) {
  const text = el.textContent.trim();
  const match = text.match(/^([\\d,]+)(\\+?)(.*)$/);
  if (!match) return;
  const target = parseInt(match[1].replace(/,/g, ''), 10);
  const plus = match[2];
  const suffix = match[3];
  const duration = 2000;
  const start = performance.now();
  el.textContent = '0' + plus + suffix;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + plus + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stat .num, .about-number').forEach(el => countObserver.observe(el));

// ── MOUSE PARALLAX ON HERO ORBS ──
const hero = document.querySelector('.hero');
const orbs = document.querySelectorAll('.orb');
if (hero && orbs.length) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 25;
      orb.style.transform = 'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
      orb.style.transition = 'transform 0.3s ease-out';
    });
  });
}

// ── CURSOR GLOW ──
const glow = document.getElementById('cursorGlow');
if (glow) {
  let glowActive = false;
  document.addEventListener('mousemove', (e) => {
    if (!glowActive) { glow.classList.add('active'); glowActive = true; }
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.classList.remove('active'); glowActive = false; });
}

// ── TILT ON CARDS ──
document.querySelectorAll('.bento-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'translateY(-6px) perspective(600px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)';
    card.style.transition = 'all 0.4s ease';
  });
});

// ── FLOATING FORMAT TOOLBAR ──
var activeEl = null;
var toolbar = document.getElementById('editToolbar');

function positionToolbar(el) {
  var rect = el.getBoundingClientRect();
  var tbW = 260;
  var left = rect.left + rect.width / 2 - tbW / 2;
  if (left < 8) left = 8;
  if (left + tbW > window.innerWidth - 8) left = window.innerWidth - tbW - 8;
  var top = rect.top - 48;
  if (top < 8) top = rect.bottom + 8;
  toolbar.style.left = left + 'px';
  toolbar.style.top = top + 'px';
}

function showToolbar(el) {
  activeEl = el;
  var cs = window.getComputedStyle(el);
  document.getElementById('tbSizeLabel').textContent = Math.round(parseFloat(cs.fontSize));
  document.getElementById('tbColor').value = rgbToHex(cs.color);
  positionToolbar(el);
  toolbar.classList.add('visible');
}

function hideToolbar() {
  toolbar.classList.remove('visible');
  activeEl = null;
}

function tbSize(dir) {
  if (!activeEl) return;
  var cs = parseFloat(window.getComputedStyle(activeEl).fontSize);
  var next = Math.max(10, Math.min(120, cs + dir * 2));
  activeEl.style.fontSize = next + 'px';
  document.getElementById('tbSizeLabel').textContent = Math.round(next);
  positionToolbar(activeEl);
}

function tbBold() {
  if (!activeEl) return;
  var cs = window.getComputedStyle(activeEl).fontWeight;
  activeEl.style.fontWeight = (parseInt(cs) >= 700) ? '400' : '700';
}

function tbApplyColor(hex) {
  if (!activeEl) return;
  activeEl.style.color = hex;
}

function rgbToHex(rgb) {
  if (rgb.startsWith('#')) return rgb;
  var m = rgb.match(/(\d+)/g);
  if (!m || m.length < 3) return '#ffffff';
  return '#' + m.slice(0,3).map(function(x){ return parseInt(x).toString(16).padStart(2,'0'); }).join('');
}

document.addEventListener('focusin', function(e) {
  if (e.target.hasAttribute('contenteditable')) showToolbar(e.target);
});
document.addEventListener('focusout', function(e) {
  setTimeout(function() {
    var act = document.activeElement;
    if (act && (act.id === 'tbColor' || act.closest('#editToolbar'))) return;
    hideToolbar();
  }, 150);
});
document.addEventListener('scroll', function() {
  if (activeEl && toolbar.classList.contains('visible')) positionToolbar(activeEl);
}, true);

// ── CLEAN EXPORT via postMessage ──
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'getHTML') {
    // Strip editing UI for clean download
    hideToolbar();
    var tbParent = toolbar.parentNode;
    var tbNext = toolbar.nextSibling;
    toolbar.remove();
    document.querySelectorAll('[contenteditable]').forEach(function(el) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });
    var html = '<!DOCTYPE html>' + document.documentElement.outerHTML;
    // Restore toolbar
    tbParent.insertBefore(toolbar, tbNext);
    window.parent.postMessage({ type: 'htmlResponse', html: html }, '*');
  }
});
</` + `script>
</body>
</html>`;

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

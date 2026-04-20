import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #080c10;
    --dark: #0d1117;
    --panel: #111820;
    --card: #141c26;
    --border: rgba(0,180,255,0.12);
    --blue: #00b4ff;
    --blue-dim: rgba(0,180,255,0.15);
    --blue-glow: rgba(0,180,255,0.35);
    --accent: #ff6b00;
    --white: #f0f6ff;
    --muted: #7a8fa8;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'Outfit', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

  /* ── NAVBAR ── */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 5%;
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(8,12,16,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transition: all 0.3s ease;
  }
  .navbar.scrolled {
    background: rgba(8,12,16,0.97);
    box-shadow: 0 4px 40px rgba(0,180,255,0.08);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
    cursor: pointer;
  }
  .nav-logo-icon {
    width: 38px; height: 38px;
    background: var(--blue);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .nav-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
  .nav-logo-text span:first-child {
    font-family: var(--font-display);
    font-size: 20px; letter-spacing: 1.5px;
    color: var(--blue);
  }
  .nav-logo-text span:last-child {
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--muted); font-weight: 500;
  }
  .nav-links { display: flex; align-items: center; gap: 8px; }
  .nav-link {
    background: none; border: none; cursor: pointer;
    padding: 8px 16px;
    font-family: var(--font-body); font-size: 13px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted);
    border-radius: 4px;
    transition: all 0.25s ease;
    position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 0; height: 1px; background: var(--blue);
    transition: width 0.25s ease;
  }
  .nav-link:hover { color: var(--white); }
  .nav-link:hover::after { width: 60%; }
  .nav-link.active { color: var(--blue); }
  .nav-link.active::after { width: 60%; }
  .nav-cta {
    background: var(--blue); color: var(--black);
    border: none; cursor: pointer;
    padding: 9px 20px; border-radius: 4px;
    font-family: var(--font-body); font-size: 12px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: all 0.25s ease; margin-left: 8px;
  }
  .nav-cta:hover { background: var(--white); transform: translateY(-1px); }
  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 4px;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px;
    background: var(--white); border-radius: 2px;
    transition: all 0.3s ease;
  }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }

  .mobile-menu {
    position: fixed; top: 70px; left: 0; right: 0; z-index: 999;
    background: rgba(8,12,16,0.98);
    border-bottom: 1px solid var(--border);
    padding: 20px 5%;
    display: flex; flex-direction: column; gap: 4px;
    transform: translateY(-110%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .mobile-menu.open { transform: translateY(0); }
  .mobile-link {
    background: none; border: none; cursor: pointer;
    text-align: left; padding: 14px 16px;
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted);
    border-left: 2px solid transparent;
    transition: all 0.2s ease;
  }
  .mobile-link:hover, .mobile-link.active { color: var(--blue); border-left-color: var(--blue); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    position: relative; overflow: hidden;
    padding: 120px 5% 80px;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,180,255,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,107,0,0.04) 0%, transparent 60%),
      var(--black);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, black 30%, transparent 80%);
  }
  .hero-circuit {
    position: absolute; right: 0; top: 0; bottom: 0; width: 50%;
    opacity: 0.4;
    background:
      radial-gradient(circle 2px at 30% 40%, var(--blue) 100%, transparent),
      radial-gradient(circle 2px at 70% 25%, var(--blue) 100%, transparent),
      radial-gradient(circle 2px at 55% 65%, var(--blue) 100%, transparent),
      radial-gradient(circle 2px at 80% 70%, var(--blue) 100%, transparent),
      radial-gradient(circle 2px at 45% 80%, var(--blue) 100%, transparent);
  }
  .hero-content { position: relative; z-index: 2; max-width: 700px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;
    color: var(--blue);
  }
  .hero-eyebrow::before {
    content: ''; display: block; width: 30px; height: 1px; background: var(--blue);
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(52px, 8vw, 110px);
    line-height: 0.92;
    letter-spacing: 2px;
    margin-bottom: 28px;
    color: var(--white);
  }
  .hero-title .highlight { color: var(--blue); }
  .hero-title .line2 { color: var(--muted); }
  .hero-desc {
    font-size: 16px; color: var(--muted); font-weight: 300;
    max-width: 520px; margin-bottom: 48px; line-height: 1.8;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 32px; background: var(--blue); color: var(--black);
    border: none; cursor: pointer; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(0,180,255,0.25);
  }
  .btn-primary:hover {
    background: var(--white); transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(0,180,255,0.3);
  }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 32px;
    background: transparent; color: var(--white);
    border: 1px solid rgba(240,246,255,0.2); cursor: pointer; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: all 0.3s ease;
  }
  .btn-secondary:hover {
    border-color: var(--blue); color: var(--blue);
    transform: translateY(-2px);
  }
  .hero-stats {
    display: flex; gap: 48px; margin-top: 72px; padding-top: 40px;
    border-top: 1px solid var(--border); flex-wrap: wrap;
  }
  .stat-num {
    font-family: var(--font-display); font-size: 42px;
    color: var(--blue); line-height: 1;
  }
  .stat-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 4px; }

  /* ── SECTIONS ── */
  section { padding: 100px 5%; }
  .section-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; letter-spacing: 4px; text-transform: uppercase; font-weight: 600;
    color: var(--blue); margin-bottom: 16px;
  }
  .section-label::before {
    content: ''; display: block; width: 20px; height: 1px; background: var(--blue);
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 64px);
    line-height: 1; letter-spacing: 1px;
    margin-bottom: 20px;
  }
  .section-sub { font-size: 15px; color: var(--muted); max-width: 560px; line-height: 1.8; }

  /* ── SERVICES ── */
  .services-section { background: var(--dark); }
  .services-header { text-align: center; margin-bottom: 64px; }
  .services-header .section-sub { margin: 0 auto; }
  .services-header .section-label { justify-content: center; }
  .services-header .section-label::before { display: none; }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2px;
  }
  .service-card {
    background: var(--card);
    padding: 40px 36px;
    border: 1px solid var(--border);
    position: relative; overflow: hidden;
    transition: all 0.35s ease;
    cursor: default;
  }
  .service-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--blue-dim) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.35s ease;
  }
  .service-card:hover { border-color: var(--blue); transform: translateY(-4px); }
  .service-card:hover::before { opacity: 1; }
  .service-icon {
    width: 52px; height: 52px; margin-bottom: 24px;
    background: var(--blue-dim); border: 1px solid var(--border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    transition: all 0.35s ease;
  }
  .service-card:hover .service-icon { background: var(--blue); border-color: var(--blue); }
  .service-name {
    font-family: var(--font-display); font-size: 24px; letter-spacing: 1px;
    margin-bottom: 12px; color: var(--white);
  }
  .service-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }
  .service-num {
    position: absolute; top: 24px; right: 28px;
    font-family: var(--font-display); font-size: 60px;
    color: rgba(0,180,255,0.05); letter-spacing: 1px;
  }

  /* ── WHY US ── */
  .whyus-section { background: var(--black); }
  .whyus-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .whyus-visual {
    position: relative; height: 480px;
    display: flex; align-items: center; justify-content: center;
  }
  .whyus-rings {
    position: absolute; width: 340px; height: 340px;
  }
  .ring {
    position: absolute; border-radius: 50%;
    border: 1px solid var(--border);
  }
  .ring-1 { inset: 0; animation: spin 20s linear infinite; }
  .ring-1::after {
    content: ''; position: absolute; top: -3px; left: 50%;
    transform: translateX(-50%);
    width: 6px; height: 6px; border-radius: 50%; background: var(--blue);
    box-shadow: 0 0 10px var(--blue);
  }
  .ring-2 { inset: 30px; animation: spin 14s linear infinite reverse; border-color: rgba(255,107,0,0.15); }
  .ring-2::after {
    content: ''; position: absolute; bottom: -3px; left: 50%;
    transform: translateX(-50%);
    width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  .ring-3 { inset: 60px; animation: spin 30s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ring-center {
    position: relative; z-index: 2;
    width: 140px; height: 140px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 0 40px rgba(0,180,255,0.15);
  }
  .ring-center-num {
    font-family: var(--font-display); font-size: 42px; color: var(--blue); line-height: 1;
  }
  .ring-center-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

  .whyus-points { display: flex; flex-direction: column; gap: 28px; }
  .whyus-point {
    display: flex; gap: 20px; align-items: flex-start;
    padding: 24px; border: 1px solid var(--border); border-radius: 6px;
    background: var(--card);
    transition: all 0.3s ease;
  }
  .whyus-point:hover { border-color: var(--blue); }
  .point-icon {
    font-size: 22px; flex-shrink: 0; margin-top: 2px;
    width: 40px; height: 40px;
    background: var(--blue-dim); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .point-title { font-weight: 600; font-size: 15px; margin-bottom: 6px; }
  .point-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

  /* ── ABOUT ── */
  .about-section { background: var(--panel); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .about-image-wrap {
    position: relative; height: 500px; border-radius: 4px; overflow: hidden;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .about-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    color: var(--muted);
  }
  .about-placeholder .big-icon { font-size: 80px; opacity: 0.3; }
  .about-placeholder p { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
  .about-badge {
    position: absolute; bottom: 24px; right: 24px;
    background: var(--blue); color: var(--black);
    padding: 12px 20px; border-radius: 4px;
    font-family: var(--font-display); font-size: 18px;
    letter-spacing: 1px;
  }
  .about-content .section-title { margin-bottom: 24px; }
  .about-lead { font-size: 16px; color: var(--muted); line-height: 1.8; margin-bottom: 32px; }
  .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; }
  .mv-card {
    padding: 24px; background: var(--card);
    border: 1px solid var(--border); border-radius: 4px;
    transition: border-color 0.3s;
  }
  .mv-card:hover { border-color: var(--blue); }
  .mv-label {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 10px; font-weight: 600;
  }
  .mv-text { font-size: 13px; color: var(--muted); line-height: 1.7; }

  /* ── PROJECTS ── */
  .projects-section { background: var(--dark); }
  .projects-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 20px; }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 16px;
  }
  .project-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 6px;
    overflow: hidden; position: relative;
    transition: all 0.35s ease; cursor: pointer;
  }
  .project-card:first-child { grid-column: span 2; }
  .project-card:hover { border-color: var(--blue); transform: translateY(-3px); }
  .project-img {
    height: 220px; background: var(--panel);
    display: flex; align-items: center; justify-content: center;
    font-size: 48px; position: relative; overflow: hidden;
    transition: all 0.35s ease;
  }
  .project-card:first-child .project-img { height: 280px; }
  .project-img-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--blue-dim) 0%, transparent 70%);
  }
  .project-overlay {
    position: absolute; inset: 0;
    background: rgba(0,180,255,0.1);
    opacity: 0; transition: opacity 0.35s;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
  }
  .project-card:hover .project-overlay { opacity: 1; }
  .project-info { padding: 24px; }
  .project-tag {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); font-weight: 600; margin-bottom: 8px;
  }
  .project-name {
    font-weight: 600; font-size: 16px; margin-bottom: 8px;
  }
  .project-loc { font-size: 12px; color: var(--muted); }

  /* ── CONTACT ── */
  .contact-section { background: var(--black); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start; }
  .contact-info { display: flex; flex-direction: column; gap: 32px; }
  .contact-item { display: flex; gap: 16px; align-items: flex-start; }
  .contact-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    background: var(--blue-dim); border: 1px solid var(--border); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .contact-item-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .contact-item-val { font-size: 14px; font-weight: 500; }
  .contact-item-val a { color: var(--white); text-decoration: none; transition: color 0.2s; }
  .contact-item-val a:hover { color: var(--blue); }

  .contact-form { display: flex; flex-direction: column; gap: 20px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-weight: 500; }
  .form-input, .form-textarea {
    background: var(--card); border: 1px solid var(--border); border-radius: 4px;
    padding: 14px 18px; font-family: var(--font-body); font-size: 14px; color: var(--white);
    transition: border-color 0.25s, box-shadow 0.25s;
    outline: none; width: 100%;
  }
  .form-input:focus, .form-textarea:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(0,180,255,0.08);
  }
  .form-textarea { resize: vertical; min-height: 130px; }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
  .form-submit {
    width: 100%; padding: 16px; background: var(--blue); color: var(--black);
    border: none; cursor: pointer; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(0,180,255,0.2);
  }
  .form-submit:hover { background: var(--white); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,180,255,0.25); }
  .form-submit.sent { background: #00c97e; }

  /* ── FOOTER ── */
  .footer {
    background: var(--dark);
    border-top: 1px solid var(--border);
    padding: 64px 5% 32px;
  }
  .footer-top {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 48px; margin-bottom: 48px; padding-bottom: 48px;
    border-bottom: 1px solid var(--border);
  }
  .footer-brand-desc { font-size: 13px; color: var(--muted); line-height: 1.8; margin-top: 16px; max-width: 260px; }
  .footer-social { display: flex; gap: 10px; margin-top: 20px; }
  .social-btn {
    width: 36px; height: 36px;
    border: 1px solid var(--border); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer; background: var(--card);
    transition: all 0.25s ease; text-decoration: none; color: var(--muted);
  }
  .social-btn:hover { background: var(--blue); border-color: var(--blue); color: var(--black); }
  .footer-col-title {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;
    color: var(--blue); margin-bottom: 20px;
  }
  .footer-links { display: flex; flex-direction: column; gap: 10px; }
  .footer-link {
    background: none; border: none; cursor: pointer; text-align: left;
    font-family: var(--font-body); font-size: 13px; color: var(--muted);
    transition: color 0.2s; padding: 0;
  }
  .footer-link:hover { color: var(--blue); }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px;
    font-size: 12px; color: var(--muted);
  }

  /* ── WHATSAPP ── */
  .whatsapp-btn {
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    width: 56px; height: 56px; border-radius: 50%;
    background: #25d366; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 26px;
    box-shadow: 0 4px 24px rgba(37,211,102,0.4);
    transition: all 0.3s ease;
    text-decoration: none;
  }
  .whatsapp-btn:hover { transform: scale(1.1); box-shadow: 0 8px 32px rgba(37,211,102,0.5); }

  /* ── CTA BAND ── */
  .cta-band {
    background: var(--blue);
    padding: 64px 5%;
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 28px;
  }
  .cta-band-title {
    font-family: var(--font-display); font-size: clamp(28px, 4vw, 50px);
    color: var(--black); letter-spacing: 1px; line-height: 1;
  }
  .cta-band-sub { font-size: 14px; color: rgba(8,12,16,0.65); margin-top: 8px; }
  .btn-dark {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 16px 32px; background: var(--black); color: var(--white);
    border: none; cursor: pointer; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: all 0.3s ease; flex-shrink: 0;
  }
  .btn-dark:hover { background: var(--dark); transform: translateY(-2px); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .whyus-grid { grid-template-columns: 1fr; gap: 48px; }
    .whyus-visual { height: 280px; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .footer-top { grid-template-columns: 1fr 1fr; }
    .projects-grid { grid-template-columns: 1fr 1fr; }
    .project-card:first-child { grid-column: span 2; }
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .hero-stats { gap: 28px; }
    .services-grid { grid-template-columns: 1fr; }
    .mv-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .projects-grid { grid-template-columns: 1fr; }
    .project-card:first-child { grid-column: span 1; }
    .project-card:first-child .project-img { height: 220px; }
    .cta-band { flex-direction: column; text-align: center; }
    .projects-header { flex-direction: column; align-items: flex-start; }
  }
`;

const SERVICES = [
  { icon: "⚡", name: "Electrical Installations", desc: "Full-scale residential, commercial, and industrial electrical installations. From wiring to panel upgrades, done to the highest safety standards." },
  { icon: "📹", name: "CCTV & Security Systems", desc: "Advanced IP and HD CCTV camera systems with remote viewing, night vision, and cloud storage for total property surveillance." },
  { icon: "🔑", name: "Access Control", desc: "Biometric fingerprint, RFID card, and smart lock systems tailored for offices, apartments, warehouses, and institutions." },
  { icon: "🚨", name: "Alarm Systems", desc: "Intrusion detection, motion sensors, glass break detectors, and 24/7 monitored alarm systems for complete peace of mind." },
  { icon: "⚙️", name: "Electric Fencing", desc: "Energized perimeter fencing systems with tamper alerts and energizer monitoring. Deter intruders before breach occurs." },
  { icon: "🔧", name: "Maintenance & Support", desc: "Scheduled maintenance, emergency call-outs, and technical support contracts to keep your systems running at peak performance." },
];

const WHY = [
  { icon: "🏅", title: "Licensed & Certified", desc: "Fully registered with the Energy and Petroleum Regulatory Authority (EPRA) Kenya. Compliant with all national electrical codes." },
  { icon: "⚡", title: "Rapid Response", desc: "24/7 emergency support with guaranteed on-site response within 4 hours across Nairobi and surrounding counties." },
  { icon: "🛡️", title: "End-to-End Solutions", desc: "We design, supply, install, and maintain — one company for your entire electrical and security infrastructure." },
  { icon: "💡", title: "Modern Technology", desc: "We deploy only current-generation equipment from trusted global brands, ensuring longevity and warranty coverage." },
];

const PROJECTS = [
  { tag: "CCTV & Access Control", name: "Westlands Commercial Complex", loc: "Nairobi, Kenya", icon: "🏢", year: "2024" },
  { tag: "Electric Fencing", name: "Residential Estate Perimeter", loc: "Karen, Nairobi", icon: "🏘️", year: "2023" },
  { tag: "Electrical Installation", name: "Industrial Warehouse Fit-Out", loc: "Embakasi, Nairobi", icon: "🏭", year: "2024" },
  { tag: "Alarm Systems", name: "Banking Branch Security Upgrade", loc: "CBD, Nairobi", icon: "🏦", year: "2023" },
  { tag: "Solar + Electrical", name: "School Campus Electrification", loc: "Kiambu County", icon: "🏫", year: "2024" },
];

const NAV = ["Home", "About", "Services", "Projects", "Contact"];

export default function App() {
  const [page, setPage] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }, [page]);

  const handleForm = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => setPage("Home")}>
          <div className="nav-logo-icon">⚡</div>
          <div className="nav-logo-text">
            <span>Afristruct</span>
            <span>Electrical Engineers</span>
          </div>
        </div>
        <div className="nav-links">
          {NAV.map(n => (
            <button key={n} className={`nav-link${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className="nav-cta" onClick={() => setPage("Contact")}>Get a Quote</button>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV.map(n => (
          <button key={n} className={`mobile-link${page === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
        ))}
      </div>

      {/* PAGES */}
      {page === "Home" && <HomePage setPage={setPage} />}
      {page === "About" && <AboutPage setPage={setPage} />}
      {page === "Services" && <ServicesPage setPage={setPage} />}
      {page === "Projects" && <ProjectsPage setPage={setPage} />}
      {page === "Contact" && <ContactPage form={form} setForm={setForm} handleForm={handleForm} sent={sent} />}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="nav-logo" style={{ cursor: "default" }}>
              <div className="nav-logo-icon">⚡</div>
              <div className="nav-logo-text">
                <span>Afristruct</span>
                <span>Electrical Engineers</span>
              </div>
            </div>
            <p className="footer-brand-desc">Kenya's trusted partner for electrical installations, security systems, and intelligent infrastructure solutions since 2010.</p>
            <div className="footer-social">
              <a href="https://wa.me/254722539292" className="social-btn" target="_blank" rel="noreferrer">💬</a>
              <a href="mailto:Afristructelectricals@gmail.com" className="social-btn">✉️</a>
              <a href="#" className="social-btn">in</a>
              <a href="#" className="social-btn">𝕏</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Navigation</div>
            <div className="footer-links">
              {NAV.map(n => <button key={n} className="footer-link" onClick={() => window.scrollTo(0,0)}>{n}</button>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              {SERVICES.map(s => <span key={s.name} className="footer-link" style={{ cursor: "default" }}>{s.name}</span>)}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-links">
              <span className="footer-link" style={{ cursor: "default" }}>📞 +254 722 539 292</span>
              <a href="mailto:Afristructelectricals@gmail.com" className="footer-link" style={{ textDecoration: "none" }}>✉️ Afristructelectricals@gmail.com</a>
              <span className="footer-link" style={{ cursor: "default" }}>📍 Nairobi, Kenya</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Afristruct Electrical Engineers. All rights reserved.</span>
          <span>Registered | EPRA Kenya Compliant</span>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a href="https://wa.me/254722539292" className="whatsapp-btn" target="_blank" rel="noreferrer" title="Chat on WhatsApp">💬</a>
    </>
  );
}

/* ───────────────────── HOME ───────────────────── */
function HomePage({ setPage }) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-eyebrow">Kenya's Premier Electrical Engineers</div>
          <h1 className="hero-title">
            <span className="highlight">POWERING</span><br />
            <span className="line2">KENYA'S</span><br />
            FUTURE
          </h1>
          <p className="hero-desc">
            Afristruct Electrical Engineers delivers world-class electrical installations, advanced security systems,
            and intelligent infrastructure solutions across Kenya.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("Services")}>
              ⚡ Explore Services
            </button>
            <button className="btn-secondary" onClick={() => setPage("Contact")}>
              Get a Free Quote →
            </button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num">500+</div><div className="stat-label">Projects Done</div></div>
            <div><div className="stat-num">14+</div><div className="stat-label">Years Active</div></div>
            <div><div className="stat-num">98%</div><div className="stat-label">Client Satisfaction</div></div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="services-section">
        <div className="services-header">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Our Core Services</h2>
          <p className="section-sub">End-to-end electrical and security solutions engineered for homes, businesses, and industrial facilities across Kenya.</p>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={s.name} className="service-card">
              <div className="service-num">0{i + 1}</div>
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="whyus-section">
        <div className="whyus-grid">
          <div className="whyus-visual">
            <div className="whyus-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
            <div className="ring-center">
              <div className="ring-center-num">A+</div>
              <div className="ring-center-label">Rated</div>
            </div>
          </div>
          <div>
            <div className="section-label">Why Afristruct</div>
            <h2 className="section-title">Built on Trust.<br />Driven by Excellence.</h2>
            <p className="section-sub" style={{ marginBottom: 40 }}>We don't just install — we engineer solutions that stand the test of time, climate, and scale.</p>
            <div className="whyus-points">
              {WHY.map(w => (
                <div key={w.title} className="whyus-point">
                  <div className="point-icon">{w.icon}</div>
                  <div>
                    <div className="point-title">{w.title}</div>
                    <div className="point-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <div className="cta-band">
        <div>
          <div className="cta-band-title">READY TO START YOUR PROJECT?</div>
          <div className="cta-band-sub">Talk to our engineers today — no obligation, free assessment.</div>
        </div>
        <button className="btn-dark" onClick={() => setPage("Contact")}>📞 Contact Us Now →</button>
      </div>
    </>
  );
}

/* ───────────────────── ABOUT ───────────────────── */
function AboutPage({ setPage }) {
  return (
    <>
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%", background: "var(--dark)" }}>
        <div className="section-label">About Afristruct</div>
        <h1 className="section-title" style={{ maxWidth: 600 }}>Engineering Excellence,<br /><span style={{ color: "var(--blue)" }}>Built in Kenya.</span></h1>
      </section>

      <section className="about-section">
        <div className="about-grid">
          <div className="about-image-wrap">
            <div className="about-placeholder">
              <div className="big-icon">🏗️</div>
              <p>Afristruct Engineers</p>
            </div>
            <div className="about-badge">Est. 2010</div>
          </div>
          <div className="about-content">
            <div className="section-label">Our Story</div>
            <h2 className="section-title" style={{ fontSize: "clamp(28px,4vw,48px)" }}>Who We Are</h2>
            <p className="about-lead">
              Afristruct Electrical Engineers is a Kenyan-owned and operated engineering firm with over 14 years of
              experience delivering high-quality electrical, security, and access control solutions.
            </p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, marginBottom: 16 }}>
              Founded in Nairobi, we have grown from a small electrical contracting firm into a full-service
              systems integrator trusted by property developers, banks, schools, hospitals, and industrial operators
              across Kenya and East Africa.
            </p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
              Our team of certified engineers and technicians is committed to delivering projects on time, within
              budget, and to the highest international standards — because when we power your building,
              your safety depends on our precision.
            </p>
            <div className="mv-grid">
              <div className="mv-card">
                <div className="mv-label">Our Mission</div>
                <div className="mv-text">To provide innovative, reliable, and affordable electrical and security solutions that empower Kenyan businesses and communities to thrive safely.</div>
              </div>
              <div className="mv-card">
                <div className="mv-label">Our Vision</div>
                <div className="mv-text">To be East Africa's most trusted integrated electrical and security systems company, recognized for quality, integrity, and impact.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--dark)", padding: "80px 5%" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Core Values</div>
          <h2 className="section-title">The Principles We Work By</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {[
            { icon: "🛡️", title: "Safety First", desc: "Every installation follows EPRA regulations and international best practices without compromise." },
            { icon: "⏱️", title: "Reliability", desc: "We deliver on time, every time. Our clients' timelines are treated as sacred commitments." },
            { icon: "💡", title: "Innovation", desc: "We stay at the frontier of technology to bring our clients the best solutions the market offers." },
            { icon: "🤝", title: "Integrity", desc: "Transparent pricing, honest assessments, and no hidden costs. What we quote is what you pay." },
          ].map(v => (
            <div key={v.title} className="service-card" style={{ padding: "32px 28px" }}>
              <div className="service-icon">{v.icon}</div>
              <div className="service-name" style={{ fontSize: 20 }}>{v.title}</div>
              <p className="service-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <div>
          <div className="cta-band-title">LET'S BUILD SOMETHING GREAT</div>
          <div className="cta-band-sub">Reach out for a free consultation with our senior engineers.</div>
        </div>
        <button className="btn-dark" onClick={() => setPage("Contact")}>Get in Touch →</button>
      </div>
    </>
  );
}

/* ───────────────────── SERVICES ───────────────────── */
function ServicesPage({ setPage }) {
  const detail = [
    {
      icon: "⚡", name: "Electrical Installations",
      bullets: ["Residential wiring and rewiring", "Commercial fit-outs and tenant improvements", "Industrial power distribution panels", "Street lighting and car park lighting", "Solar PV integration and hybrid systems", "Generator installation and ATS panels"],
    },
    {
      icon: "📹", name: "CCTV & Security Systems",
      bullets: ["IP and HD-TVI camera systems", "Remote monitoring via mobile app", "NVR/DVR setup and network config", "Facial recognition analytics", "Night vision and PTZ cameras", "Data storage solutions (NAS/Cloud)"],
    },
    {
      icon: "🔑", name: "Access Control",
      bullets: ["Biometric fingerprint readers", "RFID proximity card systems", "Smart PIN and key card locks", "Boom gates and turnstiles", "Multi-door centralized control", "Time and attendance integration"],
    },
    {
      icon: "🚨", name: "Alarm Systems",
      bullets: ["Intrusion detection (PIR, MW)", "Glass break and door contact sensors", "Siren and strobe alert devices", "24/7 central station monitoring", "SMS and app-push notifications", "Panic buttons and duress alarms"],
    },
    {
      icon: "⚙️", name: "Electric Fencing",
      bullets: ["High-voltage perimeter energizers", "Stainless steel tensioned wire systems", "Fault alert and zone monitoring", "Integration with CCTV triggers", "Solar-powered remote energizers", "Maintenance and energizer replacement"],
    },
    {
      icon: "🔧", name: "Maintenance & Support",
      bullets: ["Scheduled preventive maintenance", "24/7 emergency callout service", "System health diagnostics", "Firmware and software updates", "Spare parts supply", "Annual maintenance contracts (AMC)"],
    },
  ];

  return (
    <>
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%", background: "var(--dark)" }}>
        <div className="section-label">Services</div>
        <h1 className="section-title">Complete Electrical<br /><span style={{ color: "var(--blue)" }}>&amp; Security Solutions</span></h1>
        <p className="section-sub">From a single socket outlet to a multi-site integrated security platform — we do it all.</p>
      </section>

      <section style={{ background: "var(--black)", padding: "80px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24 }}>
          {detail.map((s, i) => (
            <div key={s.name} className="service-card" style={{ padding: "40px 36px" }}>
              <div className="service-num">0{i + 1}</div>
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {s.bullets.map(b => (
                  <li key={b} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--muted)", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--blue)", flexShrink: 0, marginTop: 1 }}>›</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <div>
          <div className="cta-band-title">NEED A CUSTOM SOLUTION?</div>
          <div className="cta-band-sub">Every project is unique — let's scope yours together.</div>
        </div>
        <button className="btn-dark" onClick={() => setPage("Contact")}>Request a Quote →</button>
      </div>
    </>
  );
}

/* ───────────────────── PROJECTS ───────────────────── */
function ProjectsPage({ setPage }) {
  return (
    <>
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%", background: "var(--dark)" }}>
        <div className="section-label">Portfolio</div>
        <h1 className="section-title">Projects That<br /><span style={{ color: "var(--blue)" }}>Define Our Work</span></h1>
        <p className="section-sub">A selection of completed projects across Kenya showcasing our capabilities and range.</p>
      </section>

      <section className="projects-section">
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <div key={p.name} className="project-card">
              <div className="project-img">
                <div className="project-img-bg" />
                <span style={{ position: "relative", zIndex: 1, fontSize: i === 0 ? 72 : 52 }}>{p.icon}</span>
                <div className="project-overlay">🔍</div>
              </div>
              <div className="project-info">
                <div className="project-tag">{p.tag} · {p.year}</div>
                <div className="project-name">{p.name}</div>
                <div className="project-loc">📍 {p.loc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 2, marginTop: 48 }}>
          {[
            { n: "500+", l: "Projects Completed" },
            { n: "300+", l: "Satisfied Clients" },
            { n: "47", l: "Counties Served" },
            { n: "14+", l: "Years of Experience" },
          ].map(s => (
            <div key={s.l} style={{ background: "var(--card)", padding: "36px 28px", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--blue)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginTop: 8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-band">
        <div>
          <div className="cta-band-title">YOUR PROJECT COULD BE NEXT</div>
          <div className="cta-band-sub">Let's discuss your requirements and build something exceptional.</div>
        </div>
        <button className="btn-dark" onClick={() => setPage("Contact")}>Start Your Project →</button>
      </div>
    </>
  );
}

/* ───────────────────── CONTACT ───────────────────── */
function ContactPage({ form, setForm, handleForm, sent }) {
  return (
    <>
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%", background: "var(--dark)" }}>
        <div className="section-label">Contact</div>
        <h1 className="section-title">Let's Talk<br /><span style={{ color: "var(--blue)" }}>About Your Project</span></h1>
        <p className="section-sub">Our engineers are ready to assess your needs and provide a detailed, no-obligation quotation.</p>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 1, marginBottom: 32 }}>GET IN TOUCH</h3>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-item-label">Phone / WhatsApp</div>
                  <div className="contact-item-val"><a href="tel:+254722539292">+254 722 539 292</a></div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-val"><a href="mailto:Afristructelectricals@gmail.com">Afristructelectricals@gmail.com</a></div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-item-label">Location</div>
                  <div className="contact-item-val">Nairobi, Kenya</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div>
                  <div className="contact-item-label">Working Hours</div>
                  <div className="contact-item-val">Mon – Sat: 8:00 AM – 6:00 PM<br /><span style={{ fontSize: 12, color: "var(--muted)" }}>24/7 Emergency Callouts</span></div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40, padding: 28, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--blue)", marginBottom: 12, fontWeight: 600 }}>Quick WhatsApp</div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.7 }}>Need a fast answer? Message us on WhatsApp and get a response within minutes during working hours.</p>
              <a href="https://wa.me/254722539292" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button style={{ background: "#25d366", color: "#fff", border: "none", cursor: "pointer", padding: "14px 24px", borderRadius: 4, fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, letterSpacing: 1, display: "flex", alignItems: "center", gap: 10 }}>
                  💬 Open WhatsApp Chat
                </button>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleForm}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 1, marginBottom: 8 }}>SEND A MESSAGE</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Fill in the form and we'll respond within 24 hours with a detailed quote.</p>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" placeholder="John Doe" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="you@company.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Message / Project Description *</label>
              <textarea className="form-textarea" placeholder="Tell us about your project — location, scope, timeline, and any specific requirements..." required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <button type="submit" className={`form-submit${sent ? " sent" : ""}`}>
              {sent ? "✓ Message Sent!" : "⚡ Send Message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

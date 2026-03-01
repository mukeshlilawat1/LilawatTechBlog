import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Mail, ArrowUpRight } from "lucide-react";

const FooterStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .ft-root {
      background: #0a0a0b;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    /* subtle glow */
    .ft-root::after {
      content: '';
      position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
      width: 400px; height: 160px;
      background: radial-gradient(ellipse, rgba(232,255,71,0.05) 0%, transparent 70%);
      pointer-events: none;
    }

    .ft-inner {
      position: relative; z-index: 1;
      max-width: 1200px; margin: 0 auto;
      padding: 40px 20px 0;
    }

    /* ── BRAND ROW ── */
    .ft-brand-row {
      display: flex; align-items: center; justify-content: space-between;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 32px;
      flex-wrap: wrap; gap: 16px;
    }
    .ft-brand { display: flex; align-items: center; gap: 10px; }
    .ft-logo-mark {
      width: 34px; height: 34px; border-radius: 10px;
      background: #e8ff47;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: #0a0a0b;
    }
    .ft-brand-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px; letter-spacing: 0.04em; color: #f0f0ee;
    }
    .ft-socials { display: flex; gap: 8px; }
    .ft-social-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 12px; border-radius: 8px;
      font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
      color: #6b6b72; text-decoration: none;
      border: 1px solid rgba(255,255,255,0.07); background: transparent;
      transition: all 0.18s;
    }
    .ft-social-btn:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }

    /* ── MAIN GRID ── */
    /* Mobile: single column stacked */
    .ft-grid {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Desktop: 4 columns side by side */
    @media (min-width: 768px) {
      .ft-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 40px;
      }
    }

    /* Mobile: each section is a collapsible-looking row */
    .ft-col {
      padding: 20px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ft-col:last-child { border-bottom: none; }

    @media (min-width: 768px) {
      .ft-col { padding: 0; border-bottom: none; }
    }

    .ft-col-title {
      font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase; color: #6b6b72;
      margin-bottom: 14px;
    }

    /* About */
    .ft-about-text { font-size: 13px; line-height: 1.75; color: #4a4a52; }
    .ft-author-card { margin-top: 16px; display: flex; align-items: center; gap: 10px; }
    .ft-author-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(232,255,71,0.1); border: 1.5px solid rgba(232,255,71,0.2);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 15px; color: #e8ff47; flex-shrink: 0;
    }
    .ft-author-name { font-size: 13px; font-weight: 700; color: #f0f0ee; }
    .ft-author-role { font-family: 'DM Mono', monospace; font-size: 10px; color: #6b6b72; margin-top: 2px; }

    /* Nav lists */
    .ft-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }

    /* Mobile: nav list horizontal wrap */
    @media (max-width: 767px) {
      .ft-nav-list { flex-direction: row; flex-wrap: wrap; gap: 8px 16px; }
    }

    .ft-nav-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; color: #4a4a52; text-decoration: none; transition: color 0.18s;
    }
    .ft-nav-link:hover { color: #f0f0ee; }
    .ft-nav-link svg { opacity: 0; transition: all 0.18s; }
    .ft-nav-link:hover svg { opacity: 1; }

    /* Mobile: topics as chips */
    @media (max-width: 767px) {
      .ft-topics-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .ft-topic-chip {
        padding: 4px 10px; border-radius: 6px;
        font-family: 'DM Mono', monospace; font-size: 11px; color: #6b6b72;
        background: #18181b; border: 1px solid rgba(255,255,255,0.07);
      }
    }
    @media (min-width: 768px) {
      .ft-topics-list { display: flex; flex-direction: column; gap: 10px; }
      .ft-topic-chip { font-size: 13px; color: #4a4a52; }
    }

    /* ── BOTTOM BAR ── */
    .ft-bottom {
      margin-top: 32px;
      padding: 18px 0 24px;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex; flex-direction: column; gap: 6px; align-items: center; text-align: center;
    }
    @media (min-width: 640px) {
      .ft-bottom { flex-direction: row; justify-content: space-between; text-align: left; }
    }
    .ft-bottom-copy { font-family: 'DM Mono', monospace; font-size: 11px; color: #3a3a42; letter-spacing: 0.04em; }
    .ft-bottom-built { font-size: 11px; color: #3a3a42; }
    .ft-bottom-accent { color: #e8ff47; font-weight: 700; }
  `}</style>
);

const Footer: React.FC = () => (
  <>
    <FooterStyles />
    <footer className="ft-root">
      <div className="ft-inner">
        {/* ── Brand + Socials ── */}
        <div className="ft-brand-row">
          <div className="ft-brand">
            <div className="ft-logo-mark">LT</div>
            <span className="ft-brand-text">LilawatTechBlog</span>
          </div>
          <div className="ft-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="ft-social-btn"
            >
              <Github size={12} /> GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="ft-social-btn"
            >
              <Twitter size={12} /> Twitter
            </a>
            <a href="mailto:contact@lilawattech.com" className="ft-social-btn">
              <Mail size={12} /> Email
            </a>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="ft-grid">
          {/* About */}
          <div className="ft-col">
            <div className="ft-col-title">About</div>
            <p className="ft-about-text">
              Practical, production-level engineering blogs on software
              architecture, system design, and real-world debugging.
            </p>
            <div className="ft-author-card">
              <div className="ft-author-avatar">ML</div>
              <div>
                <div className="ft-author-name">Mukesh Lilawat</div>
                <div className="ft-author-role">
                  Software Engineer · Full-Stack Dev
                </div>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="ft-col">
            <div className="ft-col-title">Explore</div>
            <ul className="ft-nav-list">
              {[
                { label: "Home", path: "/" },
                { label: "Categories", path: "/categories" },
                { label: "Tags", path: "/tags" },
                { label: "My Drafts", path: "/posts/drafts" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="ft-nav-link">
                    {item.label} <ArrowUpRight size={10} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div className="ft-col">
            <div className="ft-col-title">Topics</div>
            <div className="ft-topics-list">
              {[
                "Spring Boot",
                "React & Frontend",
                "System Design",
                "Backend Arch",
                "DevOps",
              ].map((t) => (
                <span key={t} className="ft-topic-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="ft-col">
            <div className="ft-col-title">Account</div>
            <ul className="ft-nav-list">
              {[
                { label: "My Profile", path: "/profile" },
                { label: "My Posts", path: "/my-posts" },
                { label: "My Notes", path: "/notes" },
                { label: "Help Centre", path: "/help" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="ft-nav-link">
                    {item.label} <ArrowUpRight size={10} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-bottom-copy">
            © {new Date().getFullYear()} LilawatTechBlog — All rights reserved
          </p>
          <p className="ft-bottom-built">
            Built with <span className="ft-bottom-accent">React</span> &amp;{" "}
            <span className="ft-bottom-accent">Spring Boot</span>
          </p>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookDashed,
  Edit3,
  FileText,
  Home,
  LogOut,
  Menu,
  NotebookPen,
  Plus,
  ShieldCheck,
  User,
  UserCircle,
  X,
  Zap,
  Github,
  Twitter,
  Mail,
  Info,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

interface NavBarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userProfile?: { name: string; avatar?: string };
  onLogout: () => void;
}

const NavStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --nb-surface: #111113;
      --nb-surface2: #18181b;
      --nb-border: rgba(255,255,255,0.07);
      --nb-accent: #e8ff47;
      --nb-danger: #ff4444;
      --nb-text: #f0f0ee;
      --nb-muted: #6b6b72;
      --nb-violet: #a78bfa;
    }

    /* ═══════ DESKTOP BAR ═══════ */
    .nb-bar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(10,10,11,0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--nb-border);
      font-family: 'DM Sans', sans-serif;
    }
    .nb-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 0 24px;
      display: flex; align-items: center; height: 60px; gap: 2px;
    }

    /* Logo */
    .nb-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; margin-right: 16px; flex-shrink: 0;
    }
    .nb-logo-mark {
      width: 34px; height: 34px; border-radius: 10px;
      background: var(--nb-accent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px; color: #0a0a0b; flex-shrink: 0;
      position: relative;
    }
    .nb-logo-mark::after {
      content: ''; position: absolute; inset: -2px;
      border-radius: 12px; border: 1px solid rgba(232,255,71,0.25);
    }
    .nb-logo-text { display: flex; flex-direction: column; line-height: 1; }
    .nb-logo-top {
      font-family: 'DM Mono', monospace; font-size: 9px;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--nb-muted);
    }
    .nb-logo-bottom {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 19px; letter-spacing: 0.04em; color: var(--nb-text);
    }

    .nb-divider { width: 1px; height: 20px; background: var(--nb-border); margin: 0 6px; flex-shrink: 0; }
    .nb-spacer { flex: 1; }

    /* Nav link */
    .nb-link {
      padding: 6px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 500; color: var(--nb-muted);
      text-decoration: none; transition: all 0.18s; white-space: nowrap;
      display: flex; align-items: center; gap: 5px;
    }
    .nb-link:hover { color: var(--nb-text); background: rgba(255,255,255,0.05); }
    .nb-link.active { color: var(--nb-accent); background: rgba(232,255,71,0.08); font-weight: 700; }

    /* Buttons */
    .nb-btn-ghost {
      padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
      color: var(--nb-muted); background: transparent; border: 1px solid var(--nb-border);
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    }
    .nb-btn-ghost:hover { color: var(--nb-text); border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }

    .nb-btn-primary {
      padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700;
      color: #0a0a0b; background: var(--nb-accent); border: none; cursor: pointer;
      transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    }
    .nb-btn-primary:hover { background: #f5ff6e; transform: translateY(-1px); }

    /* Avatar */
    .nb-avatar-btn {
      width: 34px; height: 34px; border-radius: 50%;
      border: 1.5px solid var(--nb-border); background: rgba(232,255,71,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; overflow: hidden;
      font-family: 'Bebas Neue', sans-serif; font-size: 14px; color: var(--nb-accent); flex-shrink: 0;
    }
    .nb-avatar-btn:hover { border-color: var(--nb-accent); transform: scale(1.05); }
    .nb-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }

    /* User dropdown */
    .nb-dropdown { position: relative; display: inline-block; }
    .nb-dropdown-menu {
      position: absolute; top: calc(100% + 10px); right: 0;
      min-width: 220px; background: var(--nb-surface);
      border: 1px solid var(--nb-border); border-radius: 14px; padding: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7); z-index: 200;
      animation: dropIn 0.18s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .nb-dd-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 9px; font-size: 13px; font-weight: 500;
      color: var(--nb-muted); text-decoration: none; cursor: pointer;
      transition: all 0.15s; background: none; border: none; width: 100%;
      font-family: 'DM Sans', sans-serif; text-align: left;
    }
    .nb-dd-item:hover { color: var(--nb-text); background: rgba(255,255,255,0.05); }
    .nb-dd-item.danger { color: var(--nb-danger); }
    .nb-dd-item.danger:hover { background: rgba(255,68,68,0.08); }
    .nb-dd-item.admin-item { color: var(--nb-violet); }
    .nb-dd-item.admin-item:hover { background: rgba(167,139,250,0.08); }
    .nb-dd-sep { height: 1px; background: var(--nb-border); margin: 6px 0; }
    .nb-dd-header {
      padding: 8px 12px 4px; font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--nb-muted);
    }
    .nb-dd-user-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px 12px; }
    .nb-dd-user-name { font-weight: 700; font-size: 14px; color: var(--nb-text); line-height: 1; }
    .nb-dd-user-role {
      font-family: 'DM Mono', monospace; font-size: 10px; color: var(--nb-accent);
      margin-top: 3px; display: flex; align-items: center; gap: 3px;
    }

    .nb-admin-badge {
      display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
      border-radius: 7px; font-size: 11px; font-weight: 700; color: var(--nb-violet);
      background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2);
      text-decoration: none; font-family: 'DM Mono', monospace; transition: all 0.18s;
    }
    .nb-admin-badge:hover { background: rgba(167,139,250,0.18); }

    /* ═══════ MOBILE TOP BAR ═══════ */
    .nb-mobile-bar {
      display: none; position: sticky; top: 0; z-index: 100;
      background: rgba(10,10,11,0.95); backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--nb-border);
    }
    .nb-mobile-inner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; height: 56px;
    }
    .nb-hamburger {
      width: 38px; height: 38px; border-radius: 10px;
      border: 1px solid var(--nb-border); background: rgba(255,255,255,0.03);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.18s; color: var(--nb-muted);
    }
    .nb-hamburger:hover { color: var(--nb-text); border-color: rgba(255,255,255,0.15); }

    /* ═══════ DRAWER (mobile only) ═══════ */
    .nb-overlay {
      position: fixed; inset: 0; top: 56px; z-index: 89;
      background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
      transition: opacity 0.25s;
    }
    .nb-overlay.hidden { opacity: 0; pointer-events: none; }

    .nb-drawer {
      position: fixed; inset-x: 12px; top: 68px; z-index: 90;
      background: var(--nb-surface); border: 1px solid var(--nb-border);
      border-radius: 18px; padding: 16px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.75);
      max-height: calc(100vh - 100px); overflow-y: auto;
      transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    }
    .nb-drawer.hidden { opacity: 0; transform: translateY(-12px) scale(0.97); pointer-events: none; }
    .nb-drawer::-webkit-scrollbar { display: none; }

    .nb-drawer-user {
      display: flex; align-items: center; gap: 12px; padding: 12px 14px;
      border-radius: 12px; background: rgba(232,255,71,0.05);
      border: 1px solid rgba(232,255,71,0.1); margin-bottom: 14px;
    }
    .nb-drawer-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(232,255,71,0.12); border: 1.5px solid rgba(232,255,71,0.3);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--nb-accent);
      overflow: hidden; flex-shrink: 0;
    }
    .nb-drawer-avatar img { width: 100%; height: 100%; object-fit: cover; }

    .nb-drawer-label {
      font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--nb-muted);
      padding: 10px 4px 4px;
    }
    .nb-drawer-link {
      display: flex; align-items: center; gap: 10px; padding: 11px 14px;
      border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--nb-muted);
      text-decoration: none; background: none; border: none; cursor: pointer;
      width: 100%; font-family: 'DM Sans', sans-serif; text-align: left; transition: all 0.15s;
    }
    .nb-drawer-link:hover { color: var(--nb-text); background: rgba(255,255,255,0.05); }
    .nb-drawer-link.active { color: var(--nb-accent); background: rgba(232,255,71,0.07); font-weight: 700; }
    .nb-drawer-link.admin-item { color: var(--nb-violet); }
    .nb-drawer-link.admin-item:hover { background: rgba(167,139,250,0.08); }
    .nb-drawer-link .active-dot { margin-left: auto; width: 6px; height: 6px; border-radius: 50%; background: var(--nb-accent); }

    .nb-drawer-sep { height: 1px; background: var(--nb-border); margin: 10px 0; }

    .nb-drawer-socials { display: flex; gap: 6px; padding: 4px 0 6px; flex-wrap: wrap; }
    .nb-social-btn {
      display: flex; align-items: center; gap: 5px; padding: 5px 10px;
      border-radius: 7px; font-size: 11px; font-weight: 600; color: var(--nb-muted);
      text-decoration: none; background: rgba(255,255,255,0.04);
      border: 1px solid var(--nb-border); transition: all 0.15s; font-family: 'DM Mono', monospace;
    }
    .nb-social-btn:hover { color: var(--nb-text); border-color: rgba(255,255,255,0.15); }

    .nb-drawer-cta-primary {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 700;
      color: #0a0a0b; background: var(--nb-accent); border: none; cursor: pointer;
      text-decoration: none; font-family: 'DM Sans', sans-serif; transition: all 0.18s; margin-bottom: 8px;
    }
    .nb-drawer-cta-primary:hover { background: #f5ff6e; }
    .nb-drawer-cta-danger {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600;
      color: var(--nb-danger); background: rgba(255,68,68,0.06);
      border: 1px solid rgba(255,68,68,0.2); cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: all 0.18s;
    }
    .nb-drawer-cta-danger:hover { background: rgba(255,68,68,0.12); }
    .nb-drawer-cta-secondary {
      display: flex; align-items: center; justify-content: center;
      width: 100%; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 600;
      color: var(--nb-muted); border: 1px solid var(--nb-border); background: transparent;
      text-decoration: none; font-family: 'DM Sans', sans-serif; transition: all 0.18s; margin-bottom: 8px;
    }
    .nb-drawer-cta-secondary:hover { color: var(--nb-text); border-color: rgba(255,255,255,0.15); }

    /* ═══════ MOBILE BOTTOM NAV ═══════ */
    .nb-bottom {
      display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 80;
      background: rgba(10,10,11,0.96); backdrop-filter: blur(24px);
      border-top: 1px solid var(--nb-border); height: 64px; padding: 0 8px;
      align-items: center; justify-content: space-around; font-family: 'DM Sans', sans-serif;
    }
    .nb-bottom-item {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      padding: 8px 16px; border-radius: 12px; text-decoration: none;
      background: none; border: none; cursor: pointer; transition: all 0.18s; position: relative;
    }
    .nb-bottom-item span { font-size: 10px; font-weight: 600; color: var(--nb-muted); }
    .nb-bottom-item svg { color: var(--nb-muted); transition: all 0.18s; }
    .nb-bottom-item.active svg { color: var(--nb-accent); transform: scale(1.1); }
    .nb-bottom-item.active span { color: var(--nb-accent); }
    .nb-bottom-item.active::after {
      content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 20px; height: 2px; background: var(--nb-accent); border-radius: 1px;
    }
    .nb-bottom-fab {
      width: 52px; height: 52px; border-radius: 16px; background: var(--nb-accent);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: all 0.18s; transform: translateY(-6px);
      box-shadow: 0 8px 24px rgba(232,255,71,0.35);
    }
    .nb-bottom-fab:hover { transform: translateY(-9px); box-shadow: 0 12px 32px rgba(232,255,71,0.45); }

    .nb-mobile-spacer { display: none; height: 64px; }

    /* ═══════ RESPONSIVE ═══════ */
    @media (max-width: 768px) {
      .nb-bar { display: none; }
      .nb-mobile-bar { display: block; }
      .nb-bottom { display: flex; }
      .nb-mobile-spacer { display: block; }
    }
  `}</style>
);

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AvatarEl({
  src,
  name,
  size = 34,
}: {
  src?: string;
  name?: string;
  size?: number;
}) {
  if (src)
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    );
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: size * 0.45,
        color: "var(--nb-accent)",
      }}
    >
      {getInitials(name)}
    </span>
  );
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  isAdmin,
  userProfile,
  onLogout,
}) => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const userRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const mainNavLinks = [
    { name: "Home", path: "/", icon: <Home size={15} /> },
    { name: "About", path: "/about", icon: <Info size={15} /> },
    { name: "Help", path: "/help", icon: <HelpCircle size={15} /> },
    { name: "Contact", path: "/contact", icon: <MessageSquare size={15} /> },
    ...(isAdmin
      ? [
          {
            name: "Categories",
            path: "/categories",
            icon: <FileText size={15} />,
          },
          { name: "Tags", path: "/tags", icon: <BookDashed size={15} /> },
        ]
      : []),
  ];

  const userMenuLinks = [
    { name: "My Profile", path: "/profile", icon: <UserCircle size={15} /> },
    { name: "My Posts", path: "/my-posts", icon: <FileText size={15} /> },
    { name: "My Notes", path: "/notes", icon: <NotebookPen size={15} /> },
    { name: "My Drafts", path: "/posts/drafts", icon: <Edit3 size={15} /> },
    ...(isAdmin
      ? [
          {
            name: "Review Queue",
            path: "/admin",
            icon: <ShieldCheck size={15} />,
            isAdmin: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <NavStyles />

      {/* ═══════════════════════════════════════
          DESKTOP NAVBAR — all links visible
      ═══════════════════════════════════════ */}
      <nav className="nb-bar">
        <div className="nb-inner">
          {/* Logo */}
          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">LT</div>
            <div className="nb-logo-text">
              <span className="nb-logo-top">Lilawat</span>
              <span className="nb-logo-bottom">TechBlog</span>
            </div>
          </Link>

          <div className="nb-divider" />

          {/* All nav links directly in bar */}
          {mainNavLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nb-link ${isActive(item.path) ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}

          <div className="nb-spacer" />

          {/* Right side */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nb-admin-badge"
                  style={{ marginRight: 6 }}
                >
                  <ShieldCheck size={12} /> Admin
                </Link>
              )}

              <Link
                to="/posts/new"
                className="nb-btn-primary"
                style={{ marginRight: 8 }}
              >
                <Plus size={15} strokeWidth={2.5} /> New Post
              </Link>

              {/* User dropdown */}
              <div className="nb-dropdown" ref={userRef}>
                <button
                  className="nb-avatar-btn"
                  onClick={() => setUserOpen(!userOpen)}
                >
                  <AvatarEl
                    src={userProfile?.avatar}
                    name={userProfile?.name}
                    size={34}
                  />
                </button>
                {userOpen && (
                  <div className="nb-dropdown-menu">
                    {/* User info card */}
                    <div className="nb-dd-user-card">
                      <div
                        className="nb-avatar-btn"
                        style={{ pointerEvents: "none" }}
                      >
                        <AvatarEl
                          src={userProfile?.avatar}
                          name={userProfile?.name}
                          size={34}
                        />
                      </div>
                      <div>
                        <div className="nb-dd-user-name">
                          {userProfile?.name || "User"}
                        </div>
                        {isAdmin ? (
                          <div className="nb-dd-user-role">
                            <Zap size={9} /> Admin
                          </div>
                        ) : (
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--nb-muted)",
                              fontFamily: "'DM Mono',monospace",
                              marginTop: 3,
                            }}
                          >
                            Member
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="nb-dd-sep" />
                    <div className="nb-dd-header">My Account</div>

                    {userMenuLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`nb-dd-item ${link.isAdmin ? "admin-item" : ""}`}
                        onClick={() => setUserOpen(false)}
                      >
                        <span
                          style={{
                            color: link.isAdmin
                              ? "var(--nb-violet)"
                              : "var(--nb-muted)",
                          }}
                        >
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    ))}

                    <div className="nb-dd-sep" />

                    <button
                      className="nb-dd-item danger"
                      onClick={() => {
                        setUserOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="nb-btn-ghost"
                style={{ marginRight: 6 }}
              >
                Sign Up
              </Link>
              <Link to="/login" className="nb-btn-primary">
                <User size={14} /> Log In
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          MOBILE TOP BAR
      ═══════════════════════════════════════ */}
      <div className="nb-mobile-bar">
        <div className="nb-mobile-inner">
          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">LT</div>
            <span className="nb-logo-bottom" style={{ fontSize: 17 }}>
              TechBlog
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isAuthenticated && (
              <Link
                to="/posts/new"
                className="nb-btn-primary"
                style={{ padding: "6px 12px", fontSize: 12 }}
              >
                <Plus size={14} strokeWidth={2.5} /> New
              </Link>
            )}
            <button
              className="nb-hamburger"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? (
                <X size={18} style={{ color: "var(--nb-text)" }} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`nb-overlay ${drawerOpen ? "" : "hidden"}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ═══════════════════════════════════════
          MOBILE DRAWER — hamburger content
      ═══════════════════════════════════════ */}
      <div className={`nb-drawer ${drawerOpen ? "" : "hidden"}`}>
        {/* User card */}
        {isAuthenticated && (
          <div className="nb-drawer-user">
            <div className="nb-drawer-avatar">
              <AvatarEl
                src={userProfile?.avatar}
                name={userProfile?.name}
                size={40}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--nb-text)",
                }}
              >
                {userProfile?.name || "User"}
              </div>
              {isAdmin ? (
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10,
                    color: "var(--nb-accent)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 3,
                  }}
                >
                  <Zap size={9} /> Admin
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10,
                    color: "var(--nb-muted)",
                    marginTop: 3,
                  }}
                >
                  Member
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="nb-drawer-label">Navigate</div>
        {mainNavLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nb-drawer-link ${isActive(item.path) ? "active" : ""}`}
          >
            <span
              style={{
                color: isActive(item.path)
                  ? "var(--nb-accent)"
                  : "var(--nb-muted)",
              }}
            >
              {item.icon}
            </span>
            {item.name}
            {isActive(item.path) && <span className="active-dot" />}
          </Link>
        ))}

        {/* Account links */}
        {isAuthenticated && (
          <>
            <div className="nb-drawer-sep" />
            <div className="nb-drawer-label">My Account</div>
            {userMenuLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nb-drawer-link ${link.isAdmin ? "admin-item" : ""}`}
              >
                <span
                  style={{
                    color: link.isAdmin
                      ? "var(--nb-violet)"
                      : "var(--nb-muted)",
                  }}
                >
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </>
        )}

        {/* Social links */}
        <div className="nb-drawer-sep" />
        <div className="nb-drawer-socials">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="nb-social-btn"
          >
            <Github size={12} /> GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="nb-social-btn"
          >
            <Twitter size={12} /> Twitter
          </a>
          <a href="mailto:contact@example.com" className="nb-social-btn">
            <Mail size={12} /> Email
          </a>
        </div>

        <div className="nb-drawer-sep" />

        {/* CTA buttons */}
        {isAuthenticated ? (
          <>
            <Link
              to="/posts/new"
              className="nb-drawer-cta-primary"
              onClick={() => setDrawerOpen(false)}
            >
              <Plus size={18} strokeWidth={2.5} /> Create New Post
            </Link>
            <button
              className="nb-drawer-cta-danger"
              onClick={() => {
                setDrawerOpen(false);
                onLogout();
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="nb-drawer-cta-secondary"
              onClick={() => setDrawerOpen(false)}
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="nb-drawer-cta-primary"
              onClick={() => setDrawerOpen(false)}
            >
              <User size={16} /> Log In
            </Link>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════
          MOBILE BOTTOM NAV
      ═══════════════════════════════════════ */}
      <div className="nb-bottom">
        <Link
          to="/"
          className={`nb-bottom-item ${isActive("/") ? "active" : ""}`}
        >
          <Home size={22} />
          <span>Home</span>
        </Link>

        {isAuthenticated ? (
          <Link to="/posts/new" className="nb-bottom-fab">
            <Plus size={24} color="#0a0a0b" strokeWidth={2.5} />
          </Link>
        ) : (
          <Link to="/login" className="nb-bottom-fab">
            <User size={22} color="#0a0a0b" />
          </Link>
        )}

        {isAuthenticated ? (
          <button
            className={`nb-bottom-item ${drawerOpen ? "active" : ""}`}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <div
              className="nb-avatar-btn"
              style={{
                width: 26,
                height: 26,
                fontSize: 11,
                pointerEvents: "none",
                border: drawerOpen ? "1.5px solid var(--nb-accent)" : undefined,
              }}
            >
              <AvatarEl
                src={userProfile?.avatar}
                name={userProfile?.name}
                size={26}
              />
            </div>
            <span>Menu</span>
          </button>
        ) : (
          <Link
            to="/register"
            className={`nb-bottom-item ${isActive("/register") ? "active" : ""}`}
          >
            <UserCircle size={22} />
            <span>Sign Up</span>
          </Link>
        )}
      </div>

      <div className="nb-mobile-spacer" />
    </>
  );
};

export default NavBar;

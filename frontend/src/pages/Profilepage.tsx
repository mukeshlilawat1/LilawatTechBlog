import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Mail,
  Shield,
  Plus,
  BookDashed,
  Edit3,
  LayoutGrid,
  StickyNote,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";

const ProfileStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .pp-root { background: #0a0a0b; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #f0f0ee; }

    /* ── Hero ── */
    .pp-hero {
      position: relative; overflow: hidden;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding: 48px 24px 40px;
    }
    .pp-hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 80% at 80% 0%, rgba(232,255,71,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .pp-hero-inner { max-width: 960px; margin: 0 auto; position: relative; }
    .pp-hero-row { display: flex; align-items: flex-end; gap: 28px; flex-wrap: wrap; }

    /* Avatar */
    .pp-avatar-wrap { position: relative; flex-shrink: 0; }
    .pp-avatar-glow {
      position: absolute; inset: -6px; border-radius: 50%;
      background: radial-gradient(circle, rgba(232,255,71,0.25) 0%, transparent 70%);
      pointer-events: none;
    }
    .pp-avatar {
      width: 88px; height: 88px; border-radius: 50%;
      background: linear-gradient(135deg, #1e1e22 0%, #2a2a30 100%);
      border: 2px solid rgba(232,255,71,0.3);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #e8ff47;
      position: relative; z-index: 1;
    }

    .pp-hero-info { flex: 1; min-width: 0; }
    .pp-role-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 5px; margin-bottom: 10px;
      font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase; border: 1px solid;
    }
    .pp-role-admin { color: #e8ff47; background: rgba(232,255,71,0.08); border-color: rgba(232,255,71,0.3); }
    .pp-role-user  { color: #22c55e; background: rgba(34,197,94,0.08);  border-color: rgba(34,197,94,0.3);  }

    .pp-name { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px,6vw,54px); letter-spacing: 0.02em; color: #f0f0ee; line-height: 1; margin-bottom: 8px; }
    .pp-email { display: flex; align-items: center; gap: 7px; font-family: 'DM Mono', monospace; font-size: 12px; color: #4a4a52; }

    .pp-actions { display: flex; gap: 10px; flex-wrap: wrap; padding-bottom: 4px; }
    .pp-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 700;
      cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
      text-decoration: none; border: 1px solid;
    }
    .pp-btn-primary { color: #0a0a0b; background: #e8ff47; border-color: #e8ff47; }
    .pp-btn-primary:hover { background: #f5ff6e; transform: translateY(-1px); }
    .pp-btn-ghost { color: #6b6b72; background: transparent; border-color: rgba(255,255,255,0.1); }
    .pp-btn-ghost:hover { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }

    /* ── Body ── */
    .pp-body { max-width: 960px; margin: 0 auto; padding: 32px 24px 80px; }

    /* Stats */
    .pp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
    @media (max-width: 480px) { .pp-stats { grid-template-columns: 1fr 1fr; } }
    .pp-stat-card {
      background: #111113; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; padding: 20px;
      transition: border-color 0.2s;
    }
    .pp-stat-card:hover { border-color: rgba(232,255,71,0.15); }
    .pp-stat-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
    .pp-stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 36px; line-height: 1; margin-bottom: 4px; }
    .pp-stat-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; }

    /* Info card */
    .pp-info-card { background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
    .pp-info-header { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .pp-info-header-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #4a4a52; }
    .pp-info-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .pp-info-row:last-child { border-bottom: none; }
    .pp-info-key { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }
    .pp-info-val { font-size: 13px; font-weight: 600; color: #b0b0b8; }

    /* Quick links */
    .pp-quick { background: rgba(232,255,71,0.04); border: 1px solid rgba(232,255,71,0.12); border-radius: 16px; padding: 20px; }
    .pp-quick-title { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(232,255,71,0.5); margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
    .pp-quick-links { display: flex; flex-wrap: wrap; gap: 10px; }
    .pp-quick-link {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
      text-decoration: none; border: 1px solid rgba(232,255,71,0.2);
      color: #e8ff47; background: rgba(232,255,71,0.06);
      transition: all 0.18s; font-family: 'DM Sans', sans-serif;
    }
    .pp-quick-link:hover { background: rgba(232,255,71,0.12); transform: translateY(-1px); }

    /* Activity links */
    .pp-activity { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
    @media (max-width: 480px) { .pp-activity { grid-template-columns: 1fr; } }
    .pp-activity-card {
      display: flex; align-items: center; gap: 14px;
      background: #111113; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
      padding: 16px 18px; text-decoration: none; transition: all 0.18s;
    }
    .pp-activity-card:hover { border-color: rgba(232,255,71,0.2); transform: translateY(-1px); }
    .pp-activity-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .pp-activity-title { font-size: 13px; font-weight: 700; color: #f0f0ee; margin-bottom: 2px; }
    .pp-activity-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: #4a4a52; }

    /* Loading */
    @keyframes pp-spin { to { transform: rotate(360deg); } }
    .pp-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0b; }
    .pp-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: pp-spin 0.7s linear infinite; }
  `}</style>
);

const ProfilePage: React.FC = () => {
  const { profile, isAdmin } = useAuth();

  if (!profile) {
    return (
      <>
        <ProfileStyles />
        <div className="pp-loading">
          <div className="pp-spinner" />
        </div>
      </>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <ProfileStyles />
      <div className="pp-root">
        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-hero-row">
              <div className="pp-avatar-wrap">
                <div className="pp-avatar-glow" />
                <div className="pp-avatar">{initials}</div>
              </div>

              <div className="pp-hero-info">
                <div
                  className={`pp-role-badge ${isAdmin ? "pp-role-admin" : "pp-role-user"}`}
                >
                  <Shield size={10} />
                  {isAdmin ? "Admin" : "Member"}
                </div>
                <div className="pp-name">{profile.name}</div>
                <div className="pp-email">
                  <Mail size={13} />
                  {profile.email}
                </div>
              </div>

              <div className="pp-actions">
                {isAdmin && (
                  <Link to="/posts/new" className="pp-btn pp-btn-primary">
                    <Plus size={14} /> New Post
                  </Link>
                )}
                <Link to="/my-posts" className="pp-btn pp-btn-ghost">
                  <FileText size={14} /> My Posts
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pp-body">
          {/* Stats */}
          <div className="pp-stats">
            <div className="pp-stat-card">
              <div
                className="pp-stat-icon"
                style={{ background: "rgba(232,255,71,0.1)" }}
              >
                <FileText size={16} color="#e8ff47" />
              </div>
              <div className="pp-stat-value" style={{ color: "#e8ff47" }}>
                {String(profile.totalPosts).padStart(2, "0")}
              </div>
              <div className="pp-stat-label">Total Posts</div>
            </div>
            <div className="pp-stat-card">
              <div
                className="pp-stat-icon"
                style={{ background: "rgba(139,92,246,0.1)" }}
              >
                <BookDashed size={16} color="#8b5cf6" />
              </div>
              <div className="pp-stat-value" style={{ color: "#8b5cf6" }}>
                —
              </div>
              <div className="pp-stat-label">Drafts</div>
            </div>
            <div className="pp-stat-card">
              <div
                className="pp-stat-icon"
                style={{
                  background: isAdmin
                    ? "rgba(232,255,71,0.1)"
                    : "rgba(34,197,94,0.1)",
                }}
              >
                <Shield size={16} color={isAdmin ? "#e8ff47" : "#22c55e"} />
              </div>
              <div
                className="pp-stat-value"
                style={{
                  color: isAdmin ? "#e8ff47" : "#22c55e",
                  fontSize: "24px",
                  paddingTop: "6px",
                }}
              >
                {isAdmin ? "Admin" : "User"}
              </div>
              <div className="pp-stat-label">Role</div>
            </div>
          </div>

          {/* Activity quick links */}
          <div className="pp-activity">
            <Link to="/my-posts" className="pp-activity-card">
              <div
                className="pp-activity-icon"
                style={{ background: "rgba(232,255,71,0.08)" }}
              >
                <Edit3 size={16} color="#e8ff47" />
              </div>
              <div>
                <div className="pp-activity-title">My Posts</div>
                <div className="pp-activity-sub">drafts, published, review</div>
              </div>
            </Link>
            <Link to="/notes" className="pp-activity-card">
              <div
                className="pp-activity-icon"
                style={{ background: "rgba(139,92,246,0.08)" }}
              >
                <StickyNote size={16} color="#8b5cf6" />
              </div>
              <div>
                <div className="pp-activity-title">My Notes</div>
                <div className="pp-activity-sub">personal workspace</div>
              </div>
            </Link>
          </div>

          {/* Account details */}
          <div className="pp-info-card" style={{ marginBottom: "20px" }}>
            <div className="pp-info-header">
              <div className="pp-info-header-label">Account Details</div>
            </div>
            {[
              { key: "Full Name", val: profile.name },
              { key: "Email Address", val: profile.email },
              { key: "Role", val: isAdmin ? "Administrator" : "Member" },
              { key: "Published Posts", val: String(profile.totalPosts) },
            ].map((item) => (
              <div key={item.key} className="pp-info-row">
                <span className="pp-info-key">{item.key}</span>
                <span className="pp-info-val">{item.val}</span>
              </div>
            ))}
          </div>

          {/* Admin quick links */}
          {isAdmin && (
            <div className="pp-quick">
              <div className="pp-quick-title">
                <Shield size={11} /> Admin Quick Links
              </div>
              <div className="pp-quick-links">
                <Link to="/categories" className="pp-quick-link">
                  <LayoutGrid size={12} /> Categories
                </Link>
                <Link to="/tags" className="pp-quick-link">
                  <FileText size={12} /> Tags
                </Link>
                <Link to="/posts/new" className="pp-quick-link">
                  <Plus size={12} /> New Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

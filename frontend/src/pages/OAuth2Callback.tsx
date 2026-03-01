import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { CheckCircle, X } from "lucide-react";

const OAuthStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .oa-root {
      min-height: 100vh; background: #0a0a0b;
      display: flex; align-items: center; justify-content: center;
      padding: 40px 16px; font-family: 'DM Sans', sans-serif;
      position: relative; overflow: hidden;
    }
    .oa-root::before {
      content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
      width: 600px; height: 400px;
      background: radial-gradient(ellipse, rgba(232,255,71,0.04) 0%, transparent 70%);
      pointer-events: none;
    }

    .oa-wrap { width: 100%; max-width: 360px; position: relative; z-index: 1; }

    /* Logo */
    .oa-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; }
    .oa-logo-mark { width: 36px; height: 36px; border-radius: 9px; background: #e8ff47; display: flex; align-items: center; justify-content: center; }
    .oa-logo-mark span { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: #0a0a0b; }
    .oa-logo-name { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; color: #f0f0ee; }

    /* Card */
    .oa-card { background: #111113; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px 28px; text-align: center; }

    /* Google icon ring */
    .oa-google-ring {
      width: 56px; height: 56px; border-radius: 50%;
      background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }

    .oa-heading { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.04em; color: #f0f0ee; margin-bottom: 6px; }
    .oa-sub { font-size: 13px; color: #4a4a52; margin-bottom: 24px; }

    /* User info box */
    .oa-user-box {
      background: rgba(232,255,71,0.04); border: 1px solid rgba(232,255,71,0.12);
      border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; text-align: left;
    }
    .oa-user-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,255,71,0.4); margin-bottom: 6px; }
    .oa-user-name { font-size: 14px; font-weight: 700; color: #f0f0ee; margin-bottom: 2px; }
    .oa-user-email { font-family: 'DM Mono', monospace; font-size: 11px; color: #4a4a52; }

    /* Buttons */
    .oa-btns { display: flex; gap: 10px; }
    .oa-btn {
      flex: 1; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 700;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
      display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid;
    }
    .oa-btn-cancel { background: transparent; border-color: rgba(255,255,255,0.1); color: #6b6b72; }
    .oa-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #f0f0ee; }
    .oa-btn-confirm { background: #e8ff47; border-color: #e8ff47; color: #0a0a0b; }
    .oa-btn-confirm:hover { background: #f5ff6e; transform: translateY(-1px); }

    /* Loading */
    @keyframes oa-spin { to { transform: rotate(360deg); } }
    .oa-spinner { width: 28px; height: 28px; border: 2px solid rgba(232,255,71,0.15); border-top-color: #e8ff47; border-radius: 50%; animation: oa-spin 0.7s linear infinite; margin: 0 auto 12px; }
    .oa-loading-text { font-family: 'DM Mono', monospace; font-size: 12px; color: #4a4a52; }
  `}</style>
);

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth() as any;
  const [showConfirm, setShowConfirm] = useState(false);
  const [userData, setUserData] = useState<{
    token: string;
    refreshToken: string;
    role: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const role = params.get("role");
    const name = params.get("name");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.sub || "";
        setUserData({
          token,
          refreshToken: refreshToken || "",
          role: role || "",
          name: name || "",
          email,
        });
        setShowConfirm(true);
      } catch {
        setUserData({
          token,
          refreshToken: refreshToken || "",
          role: role || "",
          name: name || "",
          email: "",
        });
        setShowConfirm(true);
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleConfirm = () => {
    if (!userData) return;
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("name", userData.name);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <OAuthStyles />
      <div className="oa-root">
        <div className="oa-wrap">
          <div className="oa-logo">
            <div className="oa-logo-mark">
              <span>LT</span>
            </div>
            <div className="oa-logo-name">LilawatTechBlog</div>
          </div>

          <div className="oa-card">
            {!showConfirm ? (
              <>
                <div className="oa-spinner" />
                <div className="oa-loading-text">Verifying with Google...</div>
              </>
            ) : (
              <>
                <div className="oa-google-ring">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>

                <div className="oa-heading">Confirm Sign In</div>
                <p className="oa-sub">Sign in to LilawatTechBlog with Google</p>

                <div className="oa-user-box">
                  <div className="oa-user-label">Signing in as</div>
                  <div className="oa-user-name">{userData?.name}</div>
                  {userData?.email && (
                    <div className="oa-user-email">{userData.email}</div>
                  )}
                </div>

                <div className="oa-btns">
                  <button
                    className="oa-btn oa-btn-cancel"
                    onClick={() => navigate("/login")}
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    className="oa-btn oa-btn-confirm"
                    onClick={handleConfirm}
                  >
                    <CheckCircle size={13} /> Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OAuth2Callback;

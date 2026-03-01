import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = "0x4AAAAAACkXr0RBGaxDtd-I";

const LoginStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .lp-root {
      min-height: 100vh; background: #0a0a0b;
      display: flex; align-items: center; justify-content: center;
      padding: 40px 16px; font-family: 'DM Sans', sans-serif;
      position: relative; overflow: hidden;
    }
    .lp-root::before {
      content: ''; position: absolute;
      top: -200px; right: -200px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 65%);
      pointer-events: none;
    }
    .lp-root::after {
      content: ''; position: absolute;
      bottom: -200px; left: -200px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%);
      pointer-events: none;
    }

    .lp-wrap { width: 100%; max-width: 380px; position: relative; z-index: 1; }

    /* Logo */
    .lp-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; }
    .lp-logo-mark {
      width: 36px; height: 36px; border-radius: 9px;
      background: #e8ff47; display: flex; align-items: center; justify-content: center;
    }
    .lp-logo-mark span { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: #0a0a0b; letter-spacing: 0.05em; }
    .lp-logo-name { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; color: #f0f0ee; }

    /* Card */
    .lp-card {
      background: #111113; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; padding: 32px 28px;
    }
    .lp-heading { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.04em; color: #f0f0ee; margin-bottom: 4px; }
    .lp-sub { font-size: 13px; color: #4a4a52; margin-bottom: 28px; }

    /* Field */
    .lp-field { margin-bottom: 16px; }
    .lp-label { display: block; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; margin-bottom: 7px; }
    .lp-input {
      width: 100%; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #f0f0ee;
      font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.18s;
      box-sizing: border-box;
    }
    .lp-input::placeholder { color: #2e2e35; }
    .lp-input:focus { border-color: rgba(232,255,71,0.4); }
    .lp-input:disabled { opacity: 0.45; cursor: not-allowed; }
    .lp-input-wrap { position: relative; }
    .lp-eye-btn {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; color: #2e2e35;
      transition: color 0.15s; padding: 0; display: flex; align-items: center;
    }
    .lp-eye-btn:hover { color: #6b6b72; }

    .lp-forgot { font-size: 11px; color: #4a4a52; text-decoration: none; transition: color 0.15s; }
    .lp-forgot:hover { color: #e8ff47; }
    .lp-field-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }

    /* Turnstile */
    .lp-turnstile { display: flex; justify-content: center; margin: 16px 0; }

    /* Error */
    .lp-error { padding: 10px 14px; border-radius: 9px; background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.2); color: rgba(255,68,68,0.9); font-size: 12px; margin-bottom: 16px; }

    /* Submit */
    .lp-submit {
      width: 100%; padding: 12px 20px; border-radius: 10px; border: none;
      background: #e8ff47; color: #0a0a0b; font-size: 14px; font-weight: 800;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .lp-submit:hover:not(:disabled) { background: #f5ff6e; transform: translateY(-1px); }
    .lp-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

    @keyframes lp-spin { to { transform: rotate(360deg); } }
    .lp-spin { width: 14px; height: 14px; border: 2px solid rgba(10,10,11,0.2); border-top-color: #0a0a0b; border-radius: 50%; animation: lp-spin 0.7s linear infinite; }

    /* Divider */
    .lp-divider { position: relative; margin: 20px 0; }
    .lp-divider::before { content: ''; position: absolute; inset: 0; display: flex; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); top: 50%; }
    .lp-divider-text { position: relative; display: flex; justify-content: center; }
    .lp-divider-text span { background: #111113; padding: 0 12px; font-family: 'DM Mono', monospace; font-size: 10px; color: #2e2e35; letter-spacing: 0.1em; }

    /* Google */
    .lp-google {
      width: 100%; padding: 11px; border-radius: 10px;
      background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08);
      color: #b0b0b8; font-size: 13px; font-weight: 600;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
      display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .lp-google:hover { border-color: rgba(255,255,255,0.18); color: #f0f0ee; transform: translateY(-1px); }

    .lp-footer-text { text-align: center; margin-top: 20px; font-size: 12px; color: #4a4a52; }
    .lp-footer-text a { color: #e8ff47; text-decoration: none; font-weight: 700; }
    .lp-footer-text a:hover { text-decoration: underline; }
  `}</style>
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!turnstileToken) return setError("Please complete the security check.");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoginStyles />
      <div className="lp-root">
        <div className="lp-wrap">
          {/* Logo */}
          <div className="lp-logo">
            <div className="lp-logo-mark">
              <span>LT</span>
            </div>
            <div className="lp-logo-name">LilawatTechBlog</div>
          </div>

          <div className="lp-card">
            <div className="lp-heading">Sign In</div>
            <p className="lp-sub">Welcome back, pick up where you left off.</p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="lp-field">
                <label className="lp-label">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="lp-input"
                />
              </div>

              {/* Password */}
              <div className="lp-field">
                <div className="lp-field-header">
                  <label className="lp-label" style={{ marginBottom: 0 }}>
                    Password
                  </label>
                  <Link to="/forgot-password" className="lp-forgot">
                    Forgot?
                  </Link>
                </div>
                <div className="lp-input-wrap">
                  <input
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="lp-input"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    className="lp-eye-btn"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Turnstile */}
              <div className="lp-turnstile">
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(t) => setTurnstileToken(t)}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                />
              </div>

              {error && <div className="lp-error">{error}</div>}

              <button
                type="submit"
                disabled={isLoading || !turnstileToken}
                className="lp-submit"
              >
                {isLoading ? (
                  <>
                    <div className="lp-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="lp-divider">
              <div className="lp-divider-text">
                <span>OR</span>
              </div>
            </div>

            <button
              type="button"
              className="lp-google"
              onClick={() =>
                (window.location.href =
                  import.meta.env.VITE_API_URL + "/oauth2/authorization/google")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
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
              Continue with Google
            </button>

            <p className="lp-footer-text">
              No account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

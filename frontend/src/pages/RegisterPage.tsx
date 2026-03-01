import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../components/AuthContext";
import { Eye, EyeOff, ArrowLeft, Check, ArrowRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

type Step = "form" | "otp";
const TURNSTILE_SITE_KEY = "0x4AAAAAACkXr0RBGaxDtd-I";

const RegisterStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    .rp-root {
      min-height: 100vh; background: #0a0a0b;
      display: flex; align-items: center; justify-content: center;
      padding: 40px 16px; font-family: 'DM Sans', sans-serif;
      position: relative; overflow: hidden;
    }
    .rp-root::before {
      content: ''; position: absolute; top: -200px; right: -200px;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%);
      pointer-events: none;
    }
    .rp-wrap { width: 100%; max-width: 380px; position: relative; z-index: 1; }

    /* Logo */
    .rp-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; }
    .rp-logo-mark { width: 36px; height: 36px; border-radius: 9px; background: #e8ff47; display: flex; align-items: center; justify-content: center; }
    .rp-logo-mark span { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: #0a0a0b; }
    .rp-logo-name { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; color: #f0f0ee; }

    /* Step indicator */
    .rp-steps { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
    .rp-step { width: 28px; height: 4px; border-radius: 2px; transition: background 0.3s; }
    .rp-step-active { background: #e8ff47; }
    .rp-step-done   { background: rgba(232,255,71,0.4); }
    .rp-step-idle   { background: rgba(255,255,255,0.08); }

    /* Card */
    .rp-card { background: #111113; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px 28px; }
    .rp-heading { font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.04em; color: #f0f0ee; margin-bottom: 4px; }
    .rp-sub { font-size: 13px; color: #4a4a52; margin-bottom: 28px; }

    /* Field */
    .rp-field { margin-bottom: 14px; }
    .rp-label { display: block; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4a52; margin-bottom: 7px; }
    .rp-input {
      width: 100%; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #f0f0ee;
      font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.18s; box-sizing: border-box;
    }
    .rp-input::placeholder { color: #2e2e35; }
    .rp-input:focus { border-color: rgba(232,255,71,0.4); }
    .rp-input:disabled { opacity: 0.45; cursor: not-allowed; }
    .rp-input-error { border-color: rgba(255,68,68,0.4) !important; }
    .rp-input-wrap { position: relative; }
    .rp-eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #2e2e35; transition: color 0.15s; padding: 0; display: flex; align-items: center; }
    .rp-eye-btn:hover { color: #6b6b72; }

    /* Password checks */
    .rp-pwd-checks { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
    .rp-pwd-check { display: flex; align-items: center; gap: 4px; font-size: 11px; transition: color 0.2s; }
    .rp-check-ok  { color: #22c55e; }
    .rp-check-no  { color: #2e2e35; }

    /* Turnstile */
    .rp-turnstile { display: flex; justify-content: center; margin: 14px 0; }

    /* Error */
    .rp-error { padding: 10px 14px; border-radius: 9px; background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.2); color: rgba(255,68,68,0.9); font-size: 12px; margin-bottom: 14px; }

    /* Submit */
    .rp-submit {
      width: 100%; padding: 12px 20px; border-radius: 10px; border: none;
      background: #e8ff47; color: #0a0a0b; font-size: 14px; font-weight: 800;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rp-submit:hover:not(:disabled) { background: #f5ff6e; transform: translateY(-1px); }
    .rp-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

    @keyframes rp-spin { to { transform: rotate(360deg); } }
    .rp-spin { width: 14px; height: 14px; border: 2px solid rgba(10,10,11,0.2); border-top-color: #0a0a0b; border-radius: 50%; animation: rp-spin 0.7s linear infinite; }

    /* OTP input */
    .rp-otp-input {
      width: 100%; background: #0d0d0f; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px; padding: 16px 14px; font-size: 28px; font-weight: 800;
      font-family: 'DM Mono', monospace; color: #e8ff47; text-align: center;
      letter-spacing: 0.5em; outline: none; transition: border-color 0.18s; box-sizing: border-box;
    }
    .rp-otp-input::placeholder { color: #2e2e35; letter-spacing: 0.3em; font-size: 20px; }
    .rp-otp-input:focus { border-color: rgba(232,255,71,0.4); }
    .rp-otp-input:disabled { opacity: 0.45; }
    .rp-otp-hint { font-family: 'DM Mono', monospace; font-size: 10px; color: #2e2e35; text-align: center; margin-top: 6px; }

    /* OTP email info */
    .rp-otp-info { background: rgba(232,255,71,0.04); border: 1px solid rgba(232,255,71,0.1); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; }
    .rp-otp-info-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,255,71,0.4); margin-bottom: 4px; }
    .rp-otp-info-email { font-size: 13px; font-weight: 700; color: #e8ff47; }
    .rp-otp-info-note { font-size: 11px; color: #4a4a52; margin-top: 2px; }

    /* OTP bottom row */
    .rp-otp-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
    .rp-otp-back { display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer; color: #4a4a52; font-size: 12px; font-family: 'DM Sans', sans-serif; transition: color 0.15s; padding: 0; }
    .rp-otp-back:hover { color: #f0f0ee; }
    .rp-resend { background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 700; color: #e8ff47; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; }
    .rp-resend:hover { opacity: 0.7; }
    .rp-resend:disabled { opacity: 0.4; cursor: not-allowed; }

    .rp-footer-text { text-align: center; margin-top: 20px; font-size: 12px; color: #4a4a52; }
    .rp-footer-text a { color: #e8ff47; text-decoration: none; font-weight: 700; }
    .rp-footer-text a:hover { text-decoration: underline; }
  `}</style>
);

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [otp, setOtp] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const allChecks = Object.values(checks).every(Boolean);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPwd) return setError("Passwords do not match.");
    if (!allChecks) return setError("Password requirements not met.");
    if (!turnstileToken) return setError("Please complete the security check.");
    setIsLoading(true);
    try {
      await apiService.sendOtp(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const clean = otp.replace(/\D/g, "").trim();
    if (clean.length !== 6)
      return setError("Please enter a valid 6-digit OTP.");
    setIsLoading(true);
    try {
      await apiService.verifyOtpAndRegister({
        name,
        email,
        password,
        otp: clean,
      });
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp("");
    setIsLoading(true);
    try {
      await apiService.sendOtp(email);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegisterStyles />
      <div className="rp-root">
        <div className="rp-wrap">
          {/* Logo */}
          <div className="rp-logo">
            <div className="rp-logo-mark">
              <span>LT</span>
            </div>
            <div className="rp-logo-name">LilawatTechBlog</div>
          </div>

          {/* Step dots */}
          <div className="rp-steps">
            <div
              className={`rp-step ${step === "form" ? "rp-step-active" : "rp-step-done"}`}
            />
            <div
              className={`rp-step ${step === "otp" ? "rp-step-active" : "rp-step-idle"}`}
            />
          </div>

          <div className="rp-card">
            {/* ── STEP 1: Form ── */}
            {step === "form" && (
              <>
                <div className="rp-heading">Create Account</div>
                <p className="rp-sub">Join LilawatTechBlog today.</p>

                <form onSubmit={handleSendOtp}>
                  <div className="rp-field">
                    <label className="rp-label">Full Name</label>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      disabled={isLoading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mukesh Lilawat"
                      className="rp-input"
                    />
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Email</label>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rp-input"
                    />
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Password</label>
                    <div className="rp-input-wrap">
                      <input
                        type={showPwd ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="rp-input"
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        className="rp-eye-btn"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {password && (
                      <div className="rp-pwd-checks">
                        {[
                          { ok: checks.length, label: "8+ chars" },
                          { ok: checks.uppercase, label: "Uppercase" },
                          { ok: checks.number, label: "Number" },
                        ].map((c) => (
                          <span
                            key={c.label}
                            className={`rp-pwd-check ${c.ok ? "rp-check-ok" : "rp-check-no"}`}
                          >
                            <Check size={10} strokeWidth={c.ok ? 3 : 1.5} />{" "}
                            {c.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Confirm Password</label>
                    <div className="rp-input-wrap">
                      <input
                        type={showConf ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        placeholder="••••••••"
                        className={`rp-input ${confirmPwd && password !== confirmPwd ? "rp-input-error" : ""}`}
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        type="button"
                        className="rp-eye-btn"
                        onClick={() => setShowConf(!showConf)}
                      >
                        {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {confirmPwd && password !== confirmPwd && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "rgba(255,68,68,0.8)",
                          marginTop: 5,
                        }}
                      >
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <div className="rp-turnstile">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(t) => setTurnstileToken(t)}
                      onExpire={() => setTurnstileToken("")}
                      onError={() => setTurnstileToken("")}
                    />
                  </div>

                  {error && <div className="rp-error">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading || !turnstileToken}
                    className="rp-submit"
                  >
                    {isLoading ? (
                      <>
                        <div className="rp-spin" /> Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP & Continue <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <p className="rp-footer-text">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <>
                <div className="rp-heading">Verify Email</div>
                <p className="rp-sub" style={{ marginBottom: 20 }}>
                  One-time code sent to your inbox.
                </p>

                <div className="rp-otp-info">
                  <div className="rp-otp-info-label">Sending to</div>
                  <div className="rp-otp-info-email">{email}</div>
                  <div className="rp-otp-info-note">
                    Check spam if not received.
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="rp-field">
                    <label className="rp-label">6-digit OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      disabled={isLoading}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      className="rp-otp-input"
                    />
                    <p className="rp-otp-hint">Expires in 5 minutes</p>
                  </div>

                  {error && <div className="rp-error">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="rp-submit"
                  >
                    {isLoading ? (
                      <>
                        <div className="rp-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Create Account <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <div className="rp-otp-row">
                    <button
                      type="button"
                      className="rp-otp-back"
                      onClick={() => {
                        setStep("form");
                        setError("");
                        setOtp("");
                      }}
                    >
                      <ArrowLeft size={12} /> Change email
                    </button>
                    <button
                      type="button"
                      className="rp-resend"
                      onClick={handleResend}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

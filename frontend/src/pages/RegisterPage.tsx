import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../components/AuthContext";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

type Step = "form" | "otp";

const TURNSTILE_SITE_KEY = "0x4AAAAAACkXr0RBGaxDtd-I";

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const allChecks = Object.values(passwordChecks).every(Boolean);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
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
    const cleanOtp = otp.replace(/\D/g, "").trim();
    if (cleanOtp.length !== 6)
      return setError("Please enter a valid 6-digit OTP.");
    setIsLoading(true);
    try {
      await apiService.verifyOtpAndRegister({
        name,
        email,
        password,
        otp: cleanOtp,
      });
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
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

  const inputClass =
    "w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-50 transition";

  return (
    <div
      className="flex items-center justify-center px-4 py-10"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">LT</span>
          </div>
          <span className="text-sm font-black text-foreground tracking-tight">
            LilawatTechBlog
          </span>
        </div>

        <div className="w-full bg-content1 border border-default-200 rounded-2xl shadow-sm p-6">
          {/* ── STEP 1: Form ── */}
          {step === "form" && (
            <>
              <h1 className="text-lg font-black text-foreground">
                Create Account
              </h1>
              <p className="text-xs text-default-500 mt-0.5 mb-5">
                Join LilawatTechBlog today.
              </p>

              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mukesh Lilawat"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-3 mt-1.5">
                      {[
                        { ok: passwordChecks.length, label: "8+ chars" },
                        { ok: passwordChecks.uppercase, label: "Uppercase" },
                        { ok: passwordChecks.number, label: "Number" },
                      ].map((c) => (
                        <span
                          key={c.label}
                          className={`flex items-center gap-1 text-xs transition-colors ${c.ok ? "text-success" : "text-default-400"}`}
                        >
                          <Check size={10} strokeWidth={c.ok ? 3 : 1.5} />
                          {c.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pr-9 ${confirmPassword && password !== confirmPassword ? "border-danger-300" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-danger mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Turnstile */}
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                  />
                </div>

                {error && (
                  <p className="text-xs text-danger bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !turnstileToken}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP & Continue"
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-default-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <>
              <h1 className="text-lg font-black text-foreground">
                Verify Email
              </h1>
              <p className="text-xs text-default-500 mt-0.5">
                OTP sent to{" "}
                <span className="font-semibold text-foreground">{email}</span>
              </p>
              <p className="text-xs text-default-400 mb-5">
                Check spam if not received.
              </p>

              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    6-digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    disabled={isLoading}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2.5 text-center text-xl font-bold tracking-[0.4em] text-foreground placeholder:text-default-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-50 transition"
                  />
                  <p className="text-xs text-default-400 text-center mt-1">
                    Expires in 5 minutes
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-danger bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Create Account"
                  )}
                </button>

                <div className="flex items-center justify-between pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError("");
                      setOtp("");
                    }}
                    className="flex items-center gap-1 text-xs text-default-500 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={12} /> Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
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
  );
};

export default RegisterPage;

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { ArrowLeft, Eye, EyeOff, Check, Mail, KeyRound } from "lucide-react";

type Step = "email" | "otp" | "reset" | "success";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };
  const allChecks = Object.values(passwordChecks).every(Boolean);
  const otpValue = otp.join("");

  // ── OTP input handler ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // ── Step 1: Send OTP email ──
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await apiService.forgotPassword(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otpValue.length !== 6)
      return setError("Please enter the complete 6-digit OTP.");
    setStep("reset");
  };

  // ── Step 3: Reset password ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    if (!allChecks) return setError("Password requirements not met.");
    setIsLoading(true);
    try {
      // Backend expects { token: otp, newPassword } OR { email, otp, newPassword }
      // Based on AuthController using otpService.verifyOtp(email, otp)
      await apiService.resetPassword({ email, otp: otpValue, newPassword });
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
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
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">LT</span>
          </div>
          <span className="text-sm font-black text-foreground tracking-tight">
            LilawatTechBlog
          </span>
        </div>

        <div className="w-full bg-content1 border border-default-200 rounded-2xl shadow-sm p-6">
          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail size={18} className="text-primary" />
              </div>
              <h1 className="text-lg font-black text-foreground">
                Forgot Password?
              </h1>
              <p className="text-xs text-default-500 mt-0.5 mb-5">
                Enter your email and we'll send you a 6-digit OTP.
              </p>

              <form className="space-y-3.5" onSubmit={handleSendEmail}>
                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    Email Address
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

                {error && (
                  <p className="text-xs text-danger bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>

              <div className="mt-4 flex justify-center">
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-xs text-default-500 hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <KeyRound size={18} className="text-primary" />
              </div>
              <h1 className="text-lg font-black text-foreground">Enter OTP</h1>
              <p className="text-xs text-default-500 mt-0.5 mb-1">
                We sent a 6-digit code to
              </p>
              <p className="text-xs font-semibold text-foreground mb-5">
                {email}
              </p>

              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                {/* OTP Boxes */}
                <div
                  className="flex gap-2 justify-between"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 rounded-lg border border-default-200 bg-default-50 text-center text-lg font-bold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition caret-transparent"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-danger bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={otpValue.length !== 6}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Verify OTP
                </button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setError("");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="flex items-center gap-1 text-xs text-default-500 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={12} /> Change email
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await apiService.forgotPassword(email);
                        setOtp(["", "", "", "", "", ""]);
                        setError("");
                      } catch {
                        setError("Failed to resend.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="text-xs text-primary hover:text-primary/80 font-semibold transition disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === "reset" && (
            <>
              <h1 className="text-lg font-black text-foreground">
                Set New Password
              </h1>
              <p className="text-xs text-default-500 mt-0.5 mb-5">
                Enter your new password below.
              </p>

              <form className="space-y-3.5" onSubmit={handleResetPassword}>
                <div>
                  <label className="block text-xs font-semibold text-default-600 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
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
                      className={`${inputClass} pr-9 ${confirmPassword && newPassword !== confirmPassword ? "border-danger-300" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-danger mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-danger bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isLoading || !allChecks || newPassword !== confirmPassword
                  }
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("otp");
                    setError("");
                  }}
                  className="flex items-center justify-center gap-1 w-full text-xs text-default-500 hover:text-foreground transition-colors pt-0.5"
                >
                  <ArrowLeft size={12} /> Back to OTP
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Success ── */}
          {step === "success" && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-success" strokeWidth={2.5} />
              </div>
              <h1 className="text-lg font-black text-foreground">
                Password Reset!
              </h1>
              <p className="text-xs text-default-500 mt-1 mb-5">
                Your password has been reset successfully. You can now sign in.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-default-400">
          OTP expires in 15 minutes
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

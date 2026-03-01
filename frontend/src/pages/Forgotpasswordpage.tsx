import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../services/apiService";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";

type Step = "email" | "reset" | "success";

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = useState<Step>(tokenFromUrl ? "reset" : "email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(tokenFromUrl || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };
  const allChecks = Object.values(passwordChecks).every(Boolean);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await apiService.forgotPassword(email);
      setStep("reset");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    if (!allChecks) return setError("Password requirements not met.");
    setIsLoading(true);
    try {
      await apiService.resetPassword({ token, newPassword });
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired token.");
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
              <h1 className="text-lg font-black text-foreground">
                Forgot Password?
              </h1>
              <p className="text-xs text-default-500 mt-0.5 mb-5">
                Enter your email and we'll send you a reset link.
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
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
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

          {/* ── STEP 2: Reset Password ── */}
          {step === "reset" && (
            <>
              <h1 className="text-lg font-black text-foreground">
                Set New Password
              </h1>
              <p className="text-xs text-default-500 mt-0.5 mb-5">
                {tokenFromUrl
                  ? "Enter your new password below."
                  : "Paste the token from your email and set a new password."}
              </p>

              <form className="space-y-3.5" onSubmit={handleResetPassword}>
                {!tokenFromUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-default-600 mb-1">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste token from email"
                      className={inputClass}
                    />
                  </div>
                )}

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
                    isLoading ||
                    !allChecks ||
                    newPassword !== confirmPassword ||
                    !token
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

                {!tokenFromUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setError("");
                    }}
                    className="flex items-center justify-center gap-1 w-full text-xs text-default-500 hover:text-foreground transition-colors pt-0.5"
                  >
                    <ArrowLeft size={12} /> Back — resend email
                  </button>
                )}
              </form>
            </>
          )}

          {/* ── STEP 3: Success ── */}
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
          Reset link expires in 15 minutes
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

type Step = "form" | "otp";

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.sendOtp(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Spaces aur non-numeric hata do
    const cleanOtp = otp.replace(/\D/g, "").replace(/\s/g, "").trim();

    if (cleanOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.verifyOtpAndRegister({
        name,
        email,
        password,
        otp: cleanOtp, // ✅ clean OTP bhejo
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
    } catch (err: any) {
      setError("Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `
    w-full rounded-xl border border-default-300 bg-background/60
    px-4 py-2.5 text-sm text-foreground
    focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
    disabled:bg-default-100 transition
  `;

  const labelClass = "text-sm font-semibold text-default-700";

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-default-100/40 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-3xl blur opacity-60" />

        <div className="relative bg-background/80 backdrop-blur-xl border border-default-200/60 rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* ===== STEP 1 — Registration Form ===== */}
          {step === "form" && (
            <>
              <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  Create Account
                </h1>
                <p className="text-sm text-default-500">
                  Join{" "}
                  <span className="font-semibold text-foreground">
                    LilawatTechBlog
                  </span>{" "}
                  today
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div className="space-y-1.5">
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="name"
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

                <div className="space-y-1.5">
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="email"
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

                <div className="space-y-1.5">
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <p className="text-xs text-default-400">
                    Min 8 characters, 1 uppercase, 1 number
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} ${
                      confirmPassword && password !== confirmPassword
                        ? "border-danger-300 focus:ring-danger/40"
                        : ""
                    }`}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-danger-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl bg-danger-50/80 border border-danger-200 px-4 py-3 text-sm text-danger-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* ===== STEP 2 — OTP Verification ===== */}
          {step === "otp" && (
            <>
              <div className="text-center mb-8 space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  Verify Email
                </h1>
                <p className="text-sm text-default-500">
                  OTP sent to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
                <p className="text-xs text-default-400">
                  Check your inbox (and spam folder)
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="space-y-1.5">
                  <label htmlFor="otp" className={labelClass}>
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    disabled={isLoading}
                    value={otp}
                    // ✅ Sirf numbers allow karo — spaces nahi
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "").replace(/\s/g, ""),
                      )
                    }
                    placeholder="062745"
                    // ✅ tracking hata diya — spaces ka illusion nahi hoga
                    className={`${inputClass} text-center text-2xl font-bold`}
                  />
                  <p className="text-xs text-default-400 text-center">
                    OTP expires in 5 minutes
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl bg-danger-50/80 border border-danger-200 px-4 py-3 text-sm text-danger-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError("");
                      setOtp("");
                    }}
                    className="text-sm text-default-500 hover:text-foreground transition"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-primary hover:underline underline-offset-2 transition disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-default-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline underline-offset-2 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;

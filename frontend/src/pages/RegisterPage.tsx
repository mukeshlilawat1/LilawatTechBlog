import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.register({ name, email, password });
      // Auto-login after successful registration
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `
    w-full rounded-xl border border-default-300 bg-background/60
    px-4 py-2.5 text-sm text-foreground
    focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
    disabled:bg-default-100
    transition
  `;

  const labelClass = "text-sm font-semibold text-default-700";

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-default-100/40 flex items-center justify-center px-4 py-12">
      {/* ===== Background Orbs ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* ===== Card ===== */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-3xl blur opacity-60" />

        <div className="relative bg-background/80 backdrop-blur-xl border border-default-200/60 rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Header */}
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

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
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

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                name="email"
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

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} ${
                  confirmPassword && password !== confirmPassword
                    ? "border-danger-300 focus:ring-danger/40 focus:border-danger/40"
                    : ""
                }`}
              />
              {/* Live mismatch hint */}
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-danger-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-danger-50/80 border border-danger-200 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full rounded-xl
                bg-gradient-to-r from-primary to-secondary
                py-3 text-sm font-bold text-white
                shadow-lg shadow-primary/30
                hover:shadow-xl hover:shadow-primary/40
                focus:outline-none focus:ring-2 focus:ring-primary/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all mt-2
              "
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Link to Login */}
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
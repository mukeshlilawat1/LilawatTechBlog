import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../components/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ✅ AB (correct)
      await login(email, password); // email, password pass karo
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-default-100/40 flex items-center justify-center px-4">
      {/* ===== Background Orbs (same design language as Home) ===== */}
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
              Welcome Back
            </h1>
            <p className="text-sm text-default-500">
              Sign in to continue to{" "}
              <span className="font-semibold text-foreground">
                LilawatTechBlog
              </span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-default-700"
              >
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
                className="
                  w-full rounded-xl border border-default-300 bg-background/60
                  px-4 py-2.5 text-sm text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                  disabled:bg-default-100
                  transition
                "
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-default-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full rounded-xl border border-default-300 bg-background/60
                  px-4 py-2.5 text-sm text-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                  disabled:bg-default-100
                  transition
                "
              />
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
                transition-all
              "
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-default-500">
            Secure access · Admin & author only
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

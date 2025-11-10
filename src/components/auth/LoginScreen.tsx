import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Mail, Lock, Smartphone, Coins } from "lucide-react";
import { useLogin } from "../../hooks/auth/useLogin";
import { useAuth } from "../../contexts/AuthContext";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [error, setError] = useState("");

  const { mutate, isPending, isError, error: mutationError } = useLogin();
  const { setAuth, isAuthenticated, user, currentUserRole, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect if already logged in
  if (isAuthenticated && user && currentUserRole) {
    console.log("✅ Redirecting to:", currentUserRole);
    const roleRouteMap: Record<string, string> = {
      admin: "/admin",
      partner: "/partner",
      member: "/member",
    };
    const redirectPath = roleRouteMap[currentUserRole] || "/member";

    console.log("✅ User is authenticated, redirecting to:", redirectPath);

    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("✅ Login success:", data);
          setAuth(data.user, data.token);
        },
        onError: (err: any) => {
          console.error("❌ Login failed:", err);
          setError("Invalid credentials or server error.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Coins className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
            Welcome to PepperLoyal
          </h2>
          <p className="text-neutral-600 dark:text-dark-text-secondary text-sm sm:text-base">
            Sign in to your loyalty platform account
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 sm:mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Login Type */}
            <div className="flex bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium ${
                  loginType === "email"
                    ? "bg-white dark:bg-dark-bg-tertiary text-primary-600 shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <Mail className="h-4 w-4 mr-2" /> Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType("phone")}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium ${
                  loginType === "phone"
                    ? "bg-white dark:bg-dark-bg-tertiary text-primary-600 shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <Smartphone className="h-4 w-4 mr-2" /> Phone
              </button>
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {loginType === "email" ? (
                  <Mail className="h-5 w-5 text-neutral-400" />
                ) : (
                  <Smartphone className="h-5 w-5 text-neutral-400" />
                )}
              </div>
              <input
                type={loginType === "email" ? "email" : "tel"}
                required
                placeholder={loginType === "email" ? "Email address" : "Phone number"}
                className="appearance-none relative block w-full pl-10 pr-3 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                className="appearance-none relative block w-full pl-10 pr-3 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {(error || isError) && (
            <div className="rounded-md bg-error-50 border border-error-200 p-4">
              <div className="text-sm text-error-700">
                {error || mutationError?.message || "Login failed. Please try again."}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-4 rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

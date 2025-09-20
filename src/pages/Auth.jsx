import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Key } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook
import FreeTrialNotification from "../components/FreeTrialNotification"; // Import notification component

const Auth = () => {
  const { user, login, trialDaysLeft } = useAuth(); // Use AuthContext
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleClientLoaded, setGoogleClientLoaded] = useState(false);
  const navigate = useNavigate();

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const toggleRef = useRef(null);
  const googleButtonRef = useRef(null);

  // Your Google Client ID - Replace with your actual Client ID
  const GOOGLE_CLIENT_ID =
    "250038161349-6si7s2p12mdubdi4je0nadobjfs2t6b5.apps.googleusercontent.com";
  const API_URL = "http://localhost:5000";

  // Load Google Sign-In script
  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setGoogleClientLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✅ Google Sign-In script loaded");
      setGoogleClientLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Google Sign-In script");
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!googleClientLoaded || !window.google) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (!isLogin && googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          size: "large",
          theme: "outline",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: "100%",
        });
      }
    } catch (err) {
      console.error("❌ Google init error:", err);
    }
  }, [googleClientLoaded, isLogin]);

  // Google OAuth callback
  const handleGoogleSuccess = (response) => {
    setLoading(true);
    setError("");

    const idToken = response.credential;

    fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google auth failed");
        return data;
      })
      .then((data) => {
        login(data.user); // Use login from AuthContext
        navigate("/");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Animate on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([toggleRef.current, formRef.current], {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate form toggle
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [isLogin]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      login(data.user); // Use login from AuthContext
      if (isLogin) {
        navigate("/");
      } else {
        setIsLogin(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Functions
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setError("OTP sent to your email! Check your inbox.");
      setShowForgotPassword(false);
      setShowOtpForm(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid or expired OTP");
      }

      setShowOtpForm(false);
      setShowResetForm(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setError("Password reset successfully! Redirecting to login...");
      setShowResetForm(false);
      setIsLogin(true);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      login(data.user); // Update user state after reset
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 relative overflow-hidden text-white">
      {/* Free Trial Notification */}
      {user && trialDaysLeft > 0 && trialDaysLeft <= 7 && (
        <FreeTrialNotification daysLeft={trialDaysLeft} onClose={() => {}} />
      )}

      {/* Background elements */}
      <div className="absolute inset-0 bg-[#0A0A0A]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex items-center justify-center min-h-screen mt-20">
        <div className="max-w-md w-full space-y-8">
          {/* Toggle */}
          <div ref={toggleRef} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back" : "Join Us"}{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-gray-300 text-sm">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
            {/* Forgot Password Link */}
            {isLogin && (
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-purple-300 hover:text-purple-200 text-sm mt-2"
              >
                Forgot Password?
              </button>
            )}
          </div>

          {/* Main Form */}
          <div
            ref={formRef}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 uppercase tracking-wide shadow-lg transform -skew-x-12 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <span className="inline-block skew-x-12">
                  {loading
                    ? "Processing..."
                    : isLogin
                    ? "Log In"
                    : "Sign Up"}
                </span>
              </button>
            </form>

            {/* Google Sign-In Button - Only in Signup Mode */}
            {!isLogin && (
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/10 text-gray-300">or</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  {googleClientLoaded ? (
                    <div
                      ref={googleButtonRef}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "50px",
                        backgroundColor: "white",
                        borderRadius: "25px",
                        overflow: "hidden",
                        border: "none",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.02)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></div>
                  ) : (
                    <button
                      className="w-full flex items-center justify-center py-3 px-4 bg-white rounded-xl text-gray-700 font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
                      disabled
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                      />
                      Loading Google Sign-In...
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-gray-400 text-xs">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Secure • SSL Encrypted</span>
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Forgot Password?</h3>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 uppercase tracking-wide shadow-lg transform -skew-x-12 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <span className="inline-block skew-x-12">
                  {loading ? "Sending..." : "Send OTP"}
                </span>
              </button>
            </form>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mt-4 text-gray-300 hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* OTP Form Modal */}
      {showOtpForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Enter OTP</h3>
            <p className="text-gray-300 mb-4">
              Check your email for the 6-digit OTP sent to {forgotEmail}
            </p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 uppercase tracking-wide shadow-lg transform -skew-x-12 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <span className="inline-block skew-x-12">
                  {loading ? "Verifying..." : "Verify OTP"}
                </span>
              </button>
            </form>
            <button
              onClick={() => {
                setShowOtpForm(false);
                setShowForgotPassword(true);
              }}
              className="mt-4 text-gray-300 hover:text-white transition-colors"
            >
              Back to Email
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Reset Password</h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 uppercase tracking-wide shadow-lg transform -skew-x-12 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <span className="inline-block skew-x-12">
                  {loading ? "Updating..." : "Reset Password"}
                </span>
              </button>
            </form>
            <button
              onClick={() => {
                setShowResetForm(false);
                setShowOtpForm(true);
              }}
              className="mt-4 text-gray-300 hover:text-white transition-colors"
            >
              Back to OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
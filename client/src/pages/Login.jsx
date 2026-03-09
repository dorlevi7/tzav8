import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AuthCard from "../components/AuthCard";
import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function Login({ theme, setTheme }) {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [error, setError] = useState("");

  const { t, i18n } = useTranslation();
  const { setLoading } = useLoading();

  // Update browser tab title
  usePageTitle(t("auth.loginTitle"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const username = e.target.username.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(t("auth.loginSuccess"));

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      setError(t("auth.loginError"));
      toast.error(t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     Theme Toggle (same logic as Navbar)
  ======================== */

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  /* ========================
     Language Toggle
  ======================== */

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";

    document.body.classList.add("lang-switching");

    setTimeout(() => {
      i18n.changeLanguage(newLang);

      setTimeout(() => {
        document.body.classList.remove("lang-switching");
      }, 50);
    }, 350);
  };

  const nextFlag = i18n.language === "he" ? "🇺🇸" : "🇮🇱";

  return (
    <>
      {/* Theme button */}
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: "20px",
          left: "70px",
          fontSize: "18px",
          background: "transparent",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Language button */}
      <button
        onClick={toggleLanguage}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          fontSize: "18px",
          background: "transparent",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        {nextFlag}
      </button>

      <AuthCard
        title={t("auth.loginTitle")}
        buttonText={t("auth.loginButton")}
        footerText={t("auth.noAccount")}
        footerLinkText={t("auth.signup")}
        footerLinkTo="/signup"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="username"
          placeholder={t("auth.username")}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t("auth.password")}
          required
        />

        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>
        )}
      </AuthCard>
    </>
  );
}

export default Login;

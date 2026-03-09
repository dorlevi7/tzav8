import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AuthCard from "../components/AuthCard";
import AdminDetailsModal from "../components/modals/AdminDetailsModal";
import CompanyDetailsModal from "../components/modals/CompanyDetailsModal";

import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function Signup({ theme, setTheme }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const { t, i18n } = useTranslation();
  const { setLoading } = useLoading();

  usePageTitle(t("auth.signupTitle"));

  const [adminDetails, setAdminDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      toast.error(t("auth.validationError"));
      return;
    }

    if (!adminDetails) {
      toast.error(t("auth.adminDetailsRequired"));
      return;
    }

    if (!companyDetails) {
      toast.error(t("auth.companyDetailsRequired"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          ...adminDetails,
          ...companyDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Username already exists") {
          toast.error(t("auth.usernameExists"));
          return;
        }

        toast.error(t("auth.serverError"));
        return;
      }

      toast.success(t("auth.signupSuccess"));

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(t("auth.serverError"));
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     Theme Toggle
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
          zIndex: 1000,
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
          zIndex: 1000,
        }}
      >
        {nextFlag}
      </button>

      <AuthCard
        title={t("auth.signupTitle")}
        buttonText={t("auth.signupButton")}
        footerText={t("auth.haveAccount")}
        footerLinkText={t("auth.login")}
        footerLinkTo="/login"
        onSubmit={handleSubmit}
      >
        <input
          id="username"
          name="username"
          type="text"
          placeholder={t("auth.username")}
          autoComplete="off"
          required
        />

        <input
          id="password"
          name="password"
          type="password"
          placeholder={t("auth.password")}
          autoComplete="new-password"
          required
        />

        <button type="button" onClick={() => setShowAdminModal(true)}>
          {adminDetails ? "✔ " : ""}
          {t("auth.adminDetails")}
        </button>

        <button type="button" onClick={() => setShowCompanyModal(true)}>
          {companyDetails ? "✔ " : ""}
          {t("auth.companyDetails")}
        </button>
      </AuthCard>

      {showAdminModal && (
        <AdminDetailsModal
          onClose={() => setShowAdminModal(false)}
          onSave={(data) => {
            setAdminDetails(data);
            setShowAdminModal(false);
          }}
        />
      )}

      {showCompanyModal && (
        <CompanyDetailsModal
          onClose={() => setShowCompanyModal(false)}
          onSave={(data) => {
            setCompanyDetails(data);
            setShowCompanyModal(false);
          }}
        />
      )}
    </>
  );
}

export default Signup;

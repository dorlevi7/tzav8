import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AuthCard from "../components/AuthCard";
import usePageTitle from "../hooks/usePageTitle";
import { useLoading } from "../context/LoadingContext";

function Signup() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const { t, i18n } = useTranslation();
  const { setLoading } = useLoading();

  // Update browser tab title
  usePageTitle(t("auth.signupTitle"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    // validation
    if (!username || !password) {
      toast.error(t("auth.validationError"));
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
      <button
        onClick={toggleLanguage}
        style={{
          position: "fixed",
          top: "20px",
          right: i18n.language === "he" ? "20px" : "auto",
          left: i18n.language === "en" ? "20px" : "auto",
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
        title={t("auth.signupTitle")}
        buttonText={t("auth.signupButton")}
        footerText={t("auth.haveAccount")}
        footerLinkText={t("auth.login")}
        footerLinkTo="/login"
        onSubmit={handleSubmit}
      >
        <input
          id="username"
          type="text"
          name="username"
          placeholder={t("auth.username")}
          autoComplete="off"
          required
        />

        <input
          id="password"
          type="password"
          name="password"
          placeholder={t("auth.password")}
          autoComplete="new-password"
          required
        />
      </AuthCard>
    </>
  );
}

export default Signup;

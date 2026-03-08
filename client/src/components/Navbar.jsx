import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import "../styles/navbar.css";

function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);
  };

  const nextFlag = i18n.language === "he" ? "🇺🇸" : "🇮🇱";

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} dir="rtl">
      <div className="navbar-inner">
        <div className="navbar-right">
          {/* Logout */}
          <button className="logout-button" onClick={handleLogout}>
            {t("auth.logout")}
          </button>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Language toggle */}
          <button
            className="lang-button"
            onClick={toggleLanguage}
            aria-label="Change language"
          >
            {nextFlag}
          </button>
        </div>

        <Link to="/home" className="logo">
          Tzav8
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

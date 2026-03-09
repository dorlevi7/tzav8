import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import "../styles/navbar.css";

function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} dir="rtl">
      <div className="navbar-inner">
        <div className="navbar-right">
          {/* Logout (desktop) */}
          <button className="logout-button desktop-only" onClick={handleLogout}>
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

          {/* Personnel Management (desktop) */}
          <Link
            to="/personnel-management"
            className="personnel-management-button desktop-only"
          >
            {t("navbar.personnelManagement")}
          </Link>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        <Link to="/home" className="logo">
          Tzav8
        </Link>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown">
          <Link
            to="/personnel-management"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("navbar.personnelManagement")}
          </Link>

          <button onClick={handleLogout}>{t("auth.logout")}</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

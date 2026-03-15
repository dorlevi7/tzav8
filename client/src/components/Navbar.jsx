import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import "../styles/navbar.css";
import { ROUTES } from "../constants/routes";

function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Current user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Detect development mode (Vite)
  const isDev = import.meta.env.DEV;

  /* Detect scroll for navbar shadow */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock scroll + activate blur when menu open */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(ROUTES.LOGIN);
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

  const closeMenu = () => setMobileMenuOpen(false);

  const handlePMNavigation = () => {
    navigate(ROUTES.PM_ROUTE(user));
  };

  return (
    <>
      {/* Dark overlay when mobile menu is open */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMenu} />}

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} dir="rtl">
        <div className="navbar-inner">
          <div className="navbar-right">
            {/* Logout (desktop only) */}
            <button
              className="logout-button desktop-only"
              onClick={handleLogout}
            >
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

            {/* Personnel management (desktop only) */}
            {ROUTES.CAN_SEE_PM(user) && (
              <button
                onClick={handlePMNavigation}
                className="personnel-management-button desktop-only"
              >
                {t("navbar.personnelManagement")}
              </button>
            )}

            {/* DB debug (development only) */}
            {isDev && (
              <Link
                to={ROUTES.DB_DEBUG}
                className="personnel-management-button desktop-only"
              >
                🗄 DB
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>

          {/* Logo */}
          <Link to={ROUTES.HOME} className="logo">
            Tzav8
          </Link>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown">
            {ROUTES.CAN_SEE_PM(user) && (
              <button
                onClick={() => {
                  closeMenu();
                  handlePMNavigation();
                }}
              >
                {t("navbar.personnelManagement")}
              </button>
            )}

            {/* DB debug in mobile menu (development only) */}
            {isDev && (
              <Link to={ROUTES.DB_DEBUG} onClick={closeMenu}>
                🗄 DB Debug
              </Link>
            )}

            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
            >
              {t("auth.logout")}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;

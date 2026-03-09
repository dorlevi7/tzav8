import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import MainLayout from "./layouts/MainLayout";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { i18n } = useTranslation();

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  /* ========================
     Theme handling
  ======================== */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ========================
     Language direction (RTL / LTR)
  ======================== */

  useEffect(() => {
    const direction = i18n.language === "he" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", direction);
  }, [i18n.language]);

  return (
    <>
      {/* Toast system */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* routes WITHOUT navbar */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={<Login theme={theme} setTheme={setTheme} />}
        />

        <Route
          path="/signup"
          element={<Signup theme={theme} setTheme={setTheme} />}
        />

        {/* routes WITH navbar */}
        <Route element={<MainLayout theme={theme} setTheme={setTheme} />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

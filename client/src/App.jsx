import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import MainLayout from "./layouts/MainLayout";

import { Toaster } from "react-hot-toast";

function App() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* routes WITH navbar */}
        <Route element={<MainLayout theme={theme} setTheme={setTheme} />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

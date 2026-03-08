import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthCard from "../components/AuthCard";
import { TOAST_MESSAGES } from "../constants/toastMessages";

function Login() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const username = e.target.username.value;
    const password = e.target.password.value;

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

      // Toast success
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

      // Navigate to home page
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      setError(TOAST_MESSAGES.LOGIN_ERROR);

      toast.error(TOAST_MESSAGES.LOGIN_ERROR);
    }
  };

  return (
    <>
      <AuthCard
        title="התחברות"
        buttonText="התחבר"
        footerText="אין לך חשבון?"
        footerLinkText="הרשמה"
        footerLinkTo="/signup"
        onSubmit={handleSubmit}
      >
        <input type="text" name="username" placeholder="שם משתמש" required />

        <input type="password" name="password" placeholder="סיסמה" required />

        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>
        )}
      </AuthCard>
    </>
  );
}

export default Login;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthCard from "../components/AuthCard";
import { TOAST_MESSAGES } from "../constants/toastMessages";

function Login() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  console.log("API_URL =", API_URL);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login form submitted");

    setError("");

    const username = e.target.username.value;
    const password = e.target.password.value;

    console.log("Username:", username);
    console.log("Password entered:", password ? "YES" : "NO");

    try {
      const url = `${API_URL}/api/auth/login`;

      console.log("Sending request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("Response data:", data);

      if (!response.ok) {
        console.log("Login failed:", data);
        throw new Error(data.error || "Login failed");
      }

      console.log("Login success:", data);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data));

      console.log("User saved to localStorage");

      // Toast success
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

      console.log("Navigating to /home");

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

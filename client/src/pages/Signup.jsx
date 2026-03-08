import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthCard from "../components/AuthCard";
import { TOAST_MESSAGES } from "../constants/toastMessages";

function Signup() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    // validation
    if (!username || !password) {
      toast.error(TOAST_MESSAGES.VALIDATION_ERROR);
      return;
    }

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
          toast.error(TOAST_MESSAGES.USERNAME_EXISTS);
          return;
        }

        toast.error(TOAST_MESSAGES.SERVER_ERROR);
        return;
      }

      console.log("Signup success:", data);

      toast.success(TOAST_MESSAGES.SIGNUP_SUCCESS);

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);

      toast.error(TOAST_MESSAGES.SERVER_ERROR);
    }
  };

  return (
    <AuthCard
      title="הרשמה"
      buttonText="צור חשבון"
      footerText="כבר יש לך חשבון?"
      footerLinkText="התחברות"
      footerLinkTo="/login"
      onSubmit={handleSubmit}
    >
      <input
        id="username"
        type="text"
        name="username"
        placeholder="שם משתמש"
        autoComplete="off"
        required
      />

      <input
        id="password"
        type="password"
        name="password"
        placeholder="סיסמה"
        autoComplete="new-password"
        required
      />
    </AuthCard>
  );
}

export default Signup;

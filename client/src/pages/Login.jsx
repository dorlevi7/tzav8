import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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

      console.log("Login success:", data);

      // שמירת המשתמש ב-localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // מעבר למסך הבית
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <AuthCard
      title="התחברות"
      buttonText="התחבר"
      footerText="אין לך חשבון?"
      footerLinkText="הרשמה"
      footerLinkTo="/signup"
      onSubmit={handleSubmit}
    >
      <input type="text" name="username" placeholder="שם משתמש" />

      <input type="password" name="password" placeholder="סיסמה" />
    </AuthCard>
  );
}

export default Login;

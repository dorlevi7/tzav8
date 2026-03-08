import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
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

      console.log("Signup success:", data);

      // redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
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
      />

      <input
        id="password"
        type="password"
        name="password"
        placeholder="סיסמה"
        autoComplete="new-password"
      />
    </AuthCard>
  );
}

export default Signup;

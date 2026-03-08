import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

function Login() {
  return (
    <AuthCard
      title="התחברות"
      buttonText="התחבר"
      footerText="אין לך חשבון?"
      footerLinkText="הרשמה"
      footerLinkTo="/signup"
    >
      <input type="text" name="username" placeholder="שם משתמש" />
      <input type="password" name="password" placeholder="סיסמה" />
    </AuthCard>
  );
}

export default Login;

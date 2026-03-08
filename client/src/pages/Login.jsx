import "../styles/pages/Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">
      <div className="login-container">
        <h2 className="auth-title">התחברות</h2>

        <form>
          <input type="text" placeholder="שם משתמש" className="auth-input" />

          <input type="password" placeholder="סיסמה" className="auth-input" />

          <button type="submit" className="auth-button">
            התחבר
          </button>
        </form>

        <p className="auth-footer">
          אין לך חשבון? <Link to="/signup">הרשמה</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

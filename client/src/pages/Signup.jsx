import { Link } from "react-router-dom";
import "../styles/pages/Signup.css";

function Signup() {
  return (
    <div className="auth-page">
      <div className="signup-container">
        <h2 className="auth-title">הרשמה</h2>

        <form>
          <input type="text" placeholder="שם משתמש" className="auth-input" />

          <input type="password" placeholder="סיסמה" className="auth-input" />

          <button type="submit" className="auth-button">
            צור חשבון
          </button>
        </form>

        <p className="auth-footer">
          כבר יש לך חשבון? <Link to="/login">התחברות</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

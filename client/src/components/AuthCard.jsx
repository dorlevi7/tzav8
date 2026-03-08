import { Link } from "react-router-dom";
import "../styles/pages/Auth.css";

function AuthCard({
  title,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkTo,
  onSubmit,
  children,
}) {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{title}</h2>
        </div>

        <form className="auth-form" autoComplete="off" onSubmit={onSubmit}>
          {children}

          <button type="submit">{buttonText}</button>
        </form>

        <div className="auth-footer">
          <p>
            {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;

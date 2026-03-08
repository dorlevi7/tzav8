import AuthCard from "../components/AuthCard";

function Signup() {
  return (
    <AuthCard
      title="הרשמה"
      buttonText="צור חשבון"
      footerText="כבר יש לך חשבון?"
      footerLinkText="התחברות"
      footerLinkTo="/login"
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

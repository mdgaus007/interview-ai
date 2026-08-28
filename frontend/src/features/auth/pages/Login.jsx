import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleLogin({ email, password });
    if (result?.success) {
      navigate("/");
    } else {
      setError(result?.message || "Account doesn't exist");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-spinner" />
        <h1>Signing you in...</h1>
        <p>Please wait a moment while we verify your session.</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <span className="brand-badge">InterviewAI</span>
          <h1 className="heading">Welcome Back</h1>
          <p className="subtitle">Sign in to access your custom interview preparation plans</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#e11d48",
                padding: "0.65rem 0.85rem",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <div className="input-box">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-box-field"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmail}
              required
            />
          </div>

          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-box-field"
              placeholder="Enter your password"
              value={password}
              onChange={handlePassword}
              required
            />
          </div>

          <button type="submit" className="submit-button primary-button">
            Sign In
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Login;

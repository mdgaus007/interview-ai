import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
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

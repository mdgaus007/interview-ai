import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const { loading, handleSignup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignup({ username, email, password });
    navigate("/");
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-spinner" />
        <h1>Creating your account...</h1>
        <p>Setting up your profile and interview prep workspace.</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <span className="brand-badge">InterviewAI</span>
          <h1 className="heading">Create an Account</h1>
          <p className="subtitle">Start building winning, AI-tailored interview strategies</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="input-box-field"
              placeholder="e.g. alexdev"
              value={username}
              onChange={handleUsername}
              required
            />
          </div>

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
              placeholder="Create a secure password"
              value={password}
              onChange={handlePassword}
              required
            />
          </div>

          <button type="submit" className="submit-button primary-button">
            Create Account
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Signup;

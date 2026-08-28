import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import "./navbar.scss";

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="app-navbar">
      <div className="app-navbar__container">
        {/* Brand Logo & Name (Clicks back to Home /) */}
        <Link to="/" className="app-navbar__brand" title="Return to Home">
          <div className="brand-icon-box">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="brand-title">
            Interview<span className="highlight">AI</span>
          </span>
        </Link>

        {/* Navigation and User Actions */}
        <div className="app-navbar__actions">
          {/* "+ New Strategy" is only visible on report pages, hidden on Home */}
          {!isHomePage && (
            <Link to="/" className="nav-btn-home">
              + New Strategy
            </Link>
          )}

          <button
            type="button"
            className="logout-btn"
            onClick={onLogoutClick}
            title="Log out"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

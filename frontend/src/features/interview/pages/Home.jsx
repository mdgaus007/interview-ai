import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar.jsx";

function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const { loading, generateReport, reports } = useInterview();
  const navigate = useNavigate();
  const resumeInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError("File size must be less than 3MB");
        return;
      }
      setResumeFile(file);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError("File size must be less than 3MB");
        return;
      }
      setResumeFile(file);
      setError("");
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const resumeFile = resumeInputRef.current.files?.[0]

    const report = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/interview/${report._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-spinner" />
        <h1>Generating your custom interview plan...</h1>
        <p>Analyzing job requirements, assessing skills, and generating tailored questions.</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="home">
      <div className="plan-builder">
        <header className="plan-builder__header">
          <span className="brand-pill">InterviewAI Strategy Planner</span>
          <h1>
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>
          <p>
            Analyze target job requirements against your profile to generate focused questions,
            STAR frameworks, and a day-by-day roadmap.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="plan-builder__form">
          {error && <div className="error-banner">{error}</div>}

          <div className="plan-builder__panels">
            {/* Left Panel: Target Job Description */}
            <section className="panel">
              <div className="panel__title">
                <span
                  className="panel__icon panel__icon--required"
                  aria-hidden="true"
                />
                <h2>Target Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder="Paste the target job description here...&#10;e.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript, and distributed systems architecture...'"
                required
              />
              <div className="char-count">
                {jobDescription.length} / 5000 chars
              </div>
            </section>

            {/* Right Panel: User Profile */}
            <section className="panel">
              <div className="panel__title">
                <span
                  className="panel__icon panel__icon--profile"
                  aria-hidden="true"
                />
                <h2>Your Profile</h2>
              </div>

              <label className="field-label" htmlFor="resume">
                Upload Resume{" "}
                <span className="field-label__hint">(Best Results)</span>
              </label>

              {resumeFile ? (
                <div className="file-selected-box">
                  <div className="file-info">
                    <span className="file-name">{resumeFile.name}</span>
                    <span className="file-size">
                      ({(resumeFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={removeResume}
                    title="Remove file"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  className={`dropzone ${isDragging ? "dropzone--active" : ""}`}
                  htmlFor="resume"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <span className="dropzone__title">
                    Click to upload or drag &amp; drop
                  </span>
                  <span className="dropzone__subtitle">PDF only (Max 5MB)</span>
                </label>
              )}
              <input
                hidden
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                ref={resumeInputRef}
              />

              <div className="divider">
                <span>OR</span>
              </div>

              <label className="field-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                id="selfDescription"
                className="self-description"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Describe your tech stack, years of experience, and notable projects if you don't have a resume handy..."
              />

              <p className="info-banner">
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required.
              </p>
            </section>
          </div>

          <footer className="plan-builder__footer">
            <span className="footer-note">AI-Powered Strategy Generation</span>
            <button
              type="submit"
              className="submit-button primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Generating Strategy...
                </>
              ) : (
                "Generate My Interview Strategy"
              )}
            </button>
          </footer>
        </form>

        {reports?.length > 0 && (
          <section className="history-section">
            <h2>Your Interview Reports</h2>
            <ul className="history-list">
              {reports.map((report) => (
                <li key={report._id} className="history-item">
                  <div className="history-info">
                    <h3>{report.title}</h3>
                    <p className="history-meta">
                      {report.createdAt && (
                        <span>
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          •{" "}
                        </span>
                      )}
                      Match Score: <strong>{report.matchScore}%</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="view-btn"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    View Report
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
    </>
  );
}

export default Home;

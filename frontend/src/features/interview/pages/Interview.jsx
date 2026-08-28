import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";
import Navbar from "../../../components/Navbar.jsx";

function CircularScore({ score = 0, size = 58, strokeWidth = 5 }) {
  const normalizedRadius = (size - strokeWidth * 2) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="circular-score-wrapper"
      style={{ width: size, height: size }}
    >
      <svg height={size} width={size} className="circular-score-svg">
        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle
          className="circular-score-bg"
          stroke="#334155"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="circular-score-progress"
          stroke="url(#scoreGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="circular-score-content">
        <span className="score-number">{score}%</span>
      </div>
    </div>
  );
}

function Interview({ data }) {
  const { report, getReportById, loading, generatePDF, pdfLoading } =
    useInterview();
  const { interviewId } = useParams();
  const [activeTab, setActiveTab] = useState("technical"); // 'technical' | 'behavioral' | 'roadmap'
  const [expandedAnswers, setExpandedAnswers] = useState({});

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const {
    matchScore = 0,
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
  } = report || {};

  const toggleAnswer = (key) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (pdfLoading) {
    return (
      <main className="loading-screen">
        <div className="loader-spinner" />
        <h1>Creating your AI-generated resume...</h1>
        <p>Formatting, tailoring to your target role, and converting to PDF.</p>
      </main>
    );
  }

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <div className="loader-spinner" />
        <h1>Loading your interview plan...</h1>
        <p>Fetching your personalized questions and preparation roadmap.</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="interview-page">
        <div className="interview-container">
          {/* Top Bar Header */}
          <header className="interview-page__topbar">
            <div className="brand-group">
              <h1 className="brand-title">
                Interview <span className="highlight">Preparation Report</span>
              </h1>
              <p className="brand-subtitle">
                AI-generated evaluation and study plan tailored to your profile
              </p>
            </div>
            <div className="score-badge-card">
              <CircularScore score={matchScore} size={58} strokeWidth={5} />
              <div className="score-meta">
                <span className="score-title">Match Score</span>
                <span className="score-subtext">Profile Alignment</span>
              </div>
            </div>
          </header>

          {/* 3-Column Layout from Wireframe (Responsive across all devices) */}
          <div className="interview-page__frame">
            {/* Left Column: Navigation Sidebar */}
            <aside className="interview-page__sidebar-left">
              <div className="nav-wrapper">
                <ul className="nav-list">
                  <li>
                    <button
                      type="button"
                      className={`nav-item-btn ${
                        activeTab === "technical" ? "nav-item-btn--active" : ""
                      }`}
                      onClick={() => setActiveTab("technical")}
                    >
                      <span>Technical questions</span>
                      {/* <span className="count-badge">{technicalQuestions.length}</span> */}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`nav-item-btn ${
                        activeTab === "behavioral" ? "nav-item-btn--active" : ""
                      }`}
                      onClick={() => setActiveTab("behavioral")}
                    >
                      <span>Behavioral questions</span>
                      {/* <span className="count-badge">{behavioralQuestions.length}</span> */}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`nav-item-btn ${
                        activeTab === "roadmap" ? "nav-item-btn--active" : ""
                      }`}
                      onClick={() => setActiveTab("roadmap")}
                    >
                      <span>Road Map</span>
                      {/* <span className="count-badge">{preparationPlan.length} Days</span> */}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="sidebar-footer-card">
                <button
                  type="button"
                  className="download-resume-btn"
                  onClick={() => generatePDF(interviewId)}
                  disabled={pdfLoading}
                >
                  Download Tailored Resume
                </button>
                <div className="card-header">Strategy Overview</div>
                <p>
                  Review high priority skill gaps and practice structuring your
                  responses before revealing the answers.
                </p>
              </div>
            </aside>

            {/* Center Column: Main Content */}
            <section className="interview-page__content">
              {activeTab === "technical" && (
                <div className="tab-content-wrapper">
                  <div className="content-header">
                    <div>
                      <h2>
                        <span className="dot-indicator" /> Technical Questions
                      </h2>
                      <span className="section-subtitle">
                        {technicalQuestions.length} core technical questions
                        curated for your role
                      </span>
                    </div>
                  </div>

                  <div className="questions-list">
                    {technicalQuestions.map((item, index) => {
                      const key = `tech-${index}`;
                      const isExpanded = !!expandedAnswers[key];

                      return (
                        <article key={index} className="question-card">
                          <div className="question-card__header">
                            <span className="q-index">Q{index + 1}</span>
                            <h3 className="q-title">{item.question}</h3>
                          </div>

                          <div className="question-card__section">
                            <span className="section-label section-label--intention">
                              Interviewer Intention
                            </span>
                            <p className="section-body section-body--intention">
                              {item.intention}
                            </p>
                          </div>

                          <div className="question-card__answer-toggle-area">
                            <button
                              type="button"
                              className={`toggle-answer-btn ${isExpanded ? "toggle-answer-btn--open" : ""}`}
                              onClick={() => toggleAnswer(key)}
                            >
                              <span>
                                {isExpanded ? "Hide Answer" : "Show Answer"}
                              </span>
                              <span
                                className={`chevron ${isExpanded ? "chevron--open" : ""}`}
                              >
                                ▾
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="question-card__section answer-reveal-box">
                                <span className="section-label section-label--answer">
                                  Expected Answer / Key Points
                                </span>
                                <p className="section-body section-body--answer">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "behavioral" && (
                <div className="tab-content-wrapper">
                  <div className="content-header">
                    <div>
                      <h2>
                        <span className="dot-indicator" /> Behavioral Questions
                      </h2>
                      <span className="section-subtitle">
                        {behavioralQuestions.length} behavioral questions to
                        evaluate teamwork &amp; problem solving
                      </span>
                    </div>
                  </div>

                  <div className="questions-list">
                    {behavioralQuestions.map((item, index) => {
                      const key = `behav-${index}`;
                      const isExpanded = !!expandedAnswers[key];

                      return (
                        <article key={index} className="question-card">
                          <div className="question-card__header">
                            <span className="q-index">BQ{index + 1}</span>
                            <h3 className="q-title">{item.question}</h3>
                          </div>

                          <div className="question-card__section">
                            <span className="section-label section-label--intention">
                              Interviewer Intention
                            </span>
                            <p className="section-body section-body--intention">
                              {item.intention}
                            </p>
                          </div>

                          <div className="question-card__answer-toggle-area">
                            <button
                              type="button"
                              className={`toggle-answer-btn ${isExpanded ? "toggle-answer-btn--open" : ""}`}
                              onClick={() => toggleAnswer(key)}
                            >
                              <span>
                                {isExpanded ? "Hide Answer" : "Show Answer"}
                              </span>
                              <span
                                className={`chevron ${isExpanded ? "chevron--open" : ""}`}
                              >
                                ▾
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="question-card__section answer-reveal-box">
                                <span className="section-label section-label--answer">
                                  Expected Answer (STAR Framework)
                                </span>
                                <p className="section-body section-body--answer">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "roadmap" && (
                <div className="tab-content-wrapper">
                  <div className="content-header">
                    <div>
                      <h2>
                        <span className="dot-indicator" /> Preparation Road Map
                      </h2>
                      <span className="section-subtitle">
                        {preparationPlan.length}-day tailored action plan
                      </span>
                    </div>
                  </div>

                  <div className="roadmap-list">
                    {preparationPlan.map((plan, index) => (
                      <div key={index} className="roadmap-card">
                        <div className="day-marker">
                          <small>DAY</small>
                          <span>{plan.day}</span>
                        </div>
                        <div className="roadmap-content">
                          <h3 className="focus-title">{plan.focus}</h3>
                          <ul className="tasks-list">
                            {plan.task.map((t, tIndex) => (
                              <li key={tIndex}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Right Sidebar: Skill Gaps */}
            <aside className="interview-page__sidebar-right">
              <div className="skill-gaps-section">
                <h2 className="section-title">Skill Gaps</h2>
                <div className="pills-container">
                  {skillGaps.map((gap, index) => (
                    <div
                      key={index}
                      className={`skill-pill skill-pill--${gap.severity || "medium"}`}
                    >
                      <div className="skill-pill__main">
                        <span className="severity-dot" />
                        <span className="skill-name">{gap.skill}</span>
                      </div>
                      {gap.severity && (
                        <span className="severity-badge">{gap.severity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card__title">Plan Summary</div>
                <div className="stat-row">
                  <span className="stat-label">Match Score</span>
                  <span className="stat-val highlight-stat">{matchScore}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Technical Questions</span>
                  <span className="stat-val">{technicalQuestions.length}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Behavioral Questions</span>
                  <span className="stat-val">{behavioralQuestions.length}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Skill Gaps Identified</span>
                  <span className="stat-val">{skillGaps.length}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Roadmap Duration</span>
                  <span className="stat-val">
                    {preparationPlan.length} Days
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default Interview;

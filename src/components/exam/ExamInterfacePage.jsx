import React, { useState } from 'react';
import { useExam, QUESTION_STATES } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Send,
  HelpCircle,
  XSquare
} from 'lucide-react';

export default function ExamInterfacePage({ onFinishExam }) {
  const { currentUser } = useAuth();
  const {
    activeExam,
    activeQuestions,
    currentQuestionIndex,
    answers,
    bookmarks,
    remainingSeconds,
    autoSaveStatus,
    lastSavedTime,
    selectAnswer,
    clearAnswer,
    toggleBookmark,
    goToQuestion,
    getQuestionState,
    submitExam
  } = useExam();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  if (!activeExam || !activeQuestions.length) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No active examination loaded</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please start an examination from the student dashboard.</p>
      </div>
    );
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const isBookmarked = !!bookmarks[currentQ.id];
  const selectedOption = answers[currentQ.id];

  // Timer formatting (MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds < 300; // Warning under 5 minutes

  // Calculate palette summary counts
  const summaryCounts = activeQuestions.reduce(
    (acc, q) => {
      const state = getQuestionState(q.id);
      if (state === QUESTION_STATES.ANSWERED || state === QUESTION_STATES.ANSWERED_AND_BOOKMARKED) acc.answered++;
      else if (state === QUESTION_STATES.UNANSWERED) acc.unanswered++;
      if (state === QUESTION_STATES.BOOKMARKED || state === QUESTION_STATES.ANSWERED_AND_BOOKMARKED) acc.bookmarked++;
      if (state === QUESTION_STATES.NOT_VISITED) acc.notVisited++;
      return acc;
    },
    { answered: 0, unanswered: 0, bookmarked: 0, notVisited: 0 }
  );

  const handleFinalSubmit = () => {
    const result = submitExam();
    setShowSubmitModal(false);
    if (onFinishExam) {
      onFinishExam(result);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Exam Top Bar (Minimal CBT Toolbar) */}
      <header style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        boxShadow: 'var(--shadow-md)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="logo-glowing-ring" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            border: '2px solid #10b981'
          }}>
            <img 
              src="https://collegetransport-p9yg.vercel.app/logo.png" 
              alt="SVGI Logo" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <h1 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              {activeExam.title}
            </h1>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Subject: {activeExam.subjectCode} • Candidate: {currentUser?.name} ({currentUser?.rollNo})
            </div>
          </div>
        </div>

        {/* Live Timer Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: isLowTime ? '#7f1d1d' : '#1e293b',
            color: isLowTime ? '#fca5a5' : '#f8fafc',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: isLowTime ? '1px solid #ef4444' : '1px solid #334155',
            fontFamily: 'monospace',
            fontWeight: '700',
            fontSize: '1.05rem'
          }}>
            <Clock size={16} className={isLowTime ? 'animate-pulse' : ''} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button 
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-warning"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            <Send size={15} />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* 2. Main Examination Area (Mobile & Laptop Responsive) */}
      <div className="cbt-container" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)', flexWrap: 'wrap' }}>
        
        {/* Left Side: Question Workspace */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>
            
            {/* Question Header & Action Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                    Question {currentQuestionIndex + 1} of {activeQuestions.length}
                  </span>
                  <span className={`badge ${
                    currentQ.difficulty === 'EASY' ? 'badge-green' :
                    currentQ.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                  <span className="badge badge-blue">
                    +{currentQ.marks} Marks
                  </span>
                  {activeExam.negativeMarkingEnabled && (
                    <span className="badge badge-gray" style={{ color: '#991b1b' }}>
                      -{currentQ.negativeMarks || (currentQ.marks * 0.25)} Negative
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Topic: <strong>{currentQ.topic}</strong>
                </div>
              </div>

              {/* Bookmark Toggle Button */}
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`btn ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  backgroundColor: isBookmarked ? '#8b5cf6' : '#ffffff',
                  borderColor: isBookmarked ? '#7c3aed' : 'var(--border-color)',
                  color: isBookmarked ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              >
                <Bookmark size={16} fill={isBookmarked ? '#ffffff' : 'none'} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div style={{
              fontSize: '1.05rem',
              fontWeight: '600',
              color: 'var(--text-main)',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              {currentQ.text}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', flex: 1 }}>
              {currentQ.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <label
                    key={idx}
                    onClick={() => selectAnswer(currentQ.id, idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--primary-600)' : '2px solid #cbd5e1',
                      backgroundColor: isSelected ? 'var(--primary-600)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {optionLabel}
                    </div>
                    <span style={{ fontSize: '0.98rem', fontWeight: isSelected ? '600' : '400', color: 'var(--text-main)' }}>
                      {optionText}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Bottom Controls Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => clearAnswer(currentQ.id)}
                  disabled={selectedOption === undefined}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <RotateCcw size={15} />
                  <span>Clear Response</span>
                </button>

                {/* Auto Save Status Indicator */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {autoSaveStatus === 'saved' && (
                    <>
                      <CheckCircle2 size={14} color="#10b981" />
                      <span style={{ color: '#059669', fontWeight: '500' }}>Answer auto-saved ({lastSavedTime})</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === activeQuestions.length - 1}
                  className="btn btn-primary"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>

        </main>

        {/* Right Side: Question Palette & Navigation Panel */}
        <aside className="cbt-sidebar" style={{
          width: '320px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #cbd5e1',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--accent-slate)' }}>
            Question Navigation Palette
          </h3>

          {/* Palette Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.6rem',
            marginBottom: '1.5rem'
          }}>
            {activeQuestions.map((q, idx) => {
              const state = getQuestionState(q.id);
              const isCurrent = idx === currentQuestionIndex;

              let stateClass = 'state-not-visited';
              if (state === QUESTION_STATES.ANSWERED) stateClass = 'state-answered';
              else if (state === QUESTION_STATES.UNANSWERED) stateClass = 'state-unanswered';
              else if (state === QUESTION_STATES.BOOKMARKED) stateClass = 'state-bookmarked';
              else if (state === QUESTION_STATES.ANSWERED_AND_BOOKMARKED) stateClass = 'state-answered-bookmarked';

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(idx)}
                  className={`q-palette-btn ${stateClass} ${isCurrent ? 'is-current' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question State Legend */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            fontSize: '0.78rem'
          }}>
            <div style={{ fontWeight: '700', marginBottom: '0.6rem', color: 'var(--text-main)' }}>Palette Status Legend:</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></span>
                <span>Answered ({summaryCounts.answered})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fee2e2', border: '1px solid #fca5a5' }}></span>
                <span>Unanswered ({summaryCounts.unanswered})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8b5cf6' }}></span>
                <span>Bookmarked ({summaryCounts.bookmarked})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f8fafc', border: '1px solid #cbd5e1' }}></span>
                <span>Not Visited ({summaryCounts.notVisited})</span>
              </div>
            </div>
          </div>

          {/* Exam Summary Overview */}
          <div className="card" style={{ padding: '1rem', marginTop: 'auto', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Attempt Progress
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Total Questions:</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeQuestions.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Answered:</span>
              <strong style={{ color: '#059669' }}>{summaryCounts.answered} / {activeQuestions.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Remaining Time:</span>
              <strong style={{ color: isLowTime ? '#dc2626' : 'var(--primary-600)' }}>{formatTime(remainingSeconds)}</strong>
            </div>
          </div>

        </aside>

      </div>

      {/* 3. Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', backgroundColor: '#ffffff' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} color="#d97706" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Confirm Exam Submission</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Are you sure you want to finish the examination?</p>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                <span>Answered Questions:</span>
                <strong style={{ color: '#059669' }}>{summaryCounts.answered}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                <span>Unanswered Questions:</span>
                <strong style={{ color: '#dc2626' }}>{summaryCounts.unanswered + summaryCounts.notVisited}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.88rem' }}>
                <span>Bookmarked Questions:</span>
                <strong style={{ color: '#7c3aed' }}>{summaryCounts.bookmarked}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSubmitModal(false)} className="btn btn-secondary">
                Continue Exam
              </button>
              <button onClick={handleFinalSubmit} className="btn btn-primary" style={{ backgroundColor: '#059669' }}>
                Yes, Submit Exam
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

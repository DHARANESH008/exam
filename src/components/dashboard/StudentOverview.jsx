import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, Award, FileText, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function StudentOverview({ activeTab, setActiveTab, onStartExam, onViewResult }) {
  const { currentUser } = useAuth();
  const { exams, results } = useExam();
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState(null);
  const [agreedInstructions, setAgreedInstructions] = useState(false);

  const activeExams = exams.filter(e => e.status === 'LIVE');
  const upcomingExams = exams.filter(e => e.status === 'SCHEDULED');
  const myResults = results.filter(r => r.studentId === currentUser?.id || r.rollNo === currentUser?.rollNo);

  const avgPercentage = myResults.length > 0 
    ? Math.round(myResults.reduce((acc, r) => acc + r.percentage, 0) / myResults.length)
    : 85;

  // View 1: Student Dashboard Overview
  if (activeTab === 'dashboard') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Welcome Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>Student Portal</span>
                <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>SVGI EXAM System</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                Welcome back, {currentUser?.name}!
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#d1fae5' }}>
                Roll Number: <strong>{currentUser?.rollNo}</strong> • Department of {currentUser?.department} ({currentUser?.batch})
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div style={{ display: 'flex', gap: '1.25rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>Active Tests</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff' }}>{activeExams.length}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>Average Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#34d399' }}>{avgPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Quick Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div 
            className="card card-hover" 
            onClick={() => setActiveTab && setActiveTab('exams')} 
            style={{ borderLeft: '4px solid #059669', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <BookOpen size={24} color="#059669" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Upcoming & Active Exams</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{activeExams.length} Exams Available Now</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                Take scheduled mid-term, model, and unit tests with real-time CBT timer & auto-save.
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#059669', borderColor: '#a7f3d0' }}>
              <span>Go to Active Exams Page</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div 
            className="card card-hover" 
            onClick={() => setActiveTab && setActiveTab('results')} 
            style={{ borderLeft: '4px solid #2563eb', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Award size={24} color="#2563eb" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>My Exam Results & Scorecards</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{myResults.length} Submissions Logged</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                View detailed scorecards, solution keys, rank summary, and topic accuracy rate.
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#2563eb', borderColor: '#bfdbfe' }}>
              <span>Go to Scorecards & Results Page</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View 2: Upcoming & Active Examinations ONLY
  if (activeTab === 'exams') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <BookOpen size={22} color="#059669" />
              <span>Upcoming & Active Examinations</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Select an examination below to view rules and launch the CBT test workspace.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
            ● {activeExams.length} Live Exams Available
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {activeExams.map(exam => {
            const existingResult = results.find(r => r.examId === exam.id && (r.studentId === currentUser?.id || r.rollNo === currentUser?.rollNo));
            const isCompleted = !!existingResult;

            return (
              <div key={exam.id} className="card card-hover" style={{ borderLeft: isCompleted ? '4px solid #10b981' : '4px solid #059669', backgroundColor: '#ffffff' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  {isCompleted ? (
                    <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46', fontWeight: '800' }}>✓ COMPLETED</span>
                  ) : (
                    <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>● LIVE NOW</span>
                  )}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {exam.subjectCode}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {exam.title}
                </h3>
                
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Faculty: {exam.createdByName} • {exam.department}
                </p>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  marginBottom: '1.25rem'
                }}>
                  <div><strong>Duration:</strong> {exam.durationMinutes} mins</div>
                  <div><strong>Total Marks:</strong> {exam.totalMarks}</div>
                  <div><strong>Questions:</strong> {exam.totalQuestions}</div>
                  <div><strong>Pass Mark:</strong> {exam.passPercentage}%</div>
                </div>

                {isCompleted ? (
                  <button
                    onClick={() => onViewResult(existingResult)}
                    className="btn btn-secondary"
                    style={{ width: '100%', borderColor: '#a7f3d0', color: '#065f46', fontWeight: '800' }}
                  >
                    <CheckCircle2 size={16} color="#059669" />
                    <span>View Scorecard & Solution Key</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedExamForInstructions(exam);
                      setAgreedInstructions(false);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', backgroundColor: '#059669', border: 'none', fontWeight: '800' }}
                  >
                    <span>Read Instructions & Start Exam</span>
                    <ArrowRight size={16} />
                  </button>
                )}

              </div>
            );
          })}
        </div>

        {/* Instructions Modal */}
        {selectedExamForInstructions && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', backgroundColor: '#ffffff', borderRadius: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-slate)' }}>
                    Exam Instructions & Declaration
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {selectedExamForInstructions.title} ({selectedExamForInstructions.subjectCode})
                  </div>
                </div>
                <button onClick={() => setSelectedExamForInstructions(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.25rem',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.5rem' }}>Rules & Guidelines:</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedExamForInstructions.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={agreedInstructions} 
                  onChange={(e) => setAgreedInstructions(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#059669' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  I have read, understood, and agree to follow all examination rules and instructions.
                </span>
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedExamForInstructions(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button 
                  disabled={!agreedInstructions} 
                  onClick={() => {
                    const examId = selectedExamForInstructions.id;
                    setSelectedExamForInstructions(null);
                    onStartExam(examId);
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#059669', border: 'none' }}
                >
                  <span>Start Examination Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  // View 3: My Exam Results ONLY
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Award size={22} color="#059669" />
            <span>My Exam Results & Scorecards</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Review completed exam scores, percentage, pass/fail status, and solution keys.
          </p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
          {myResults.length} Submissions Logged
        </span>
      </div>

      {myResults.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No submitted exam results yet. Complete an active exam to view your detailed scorecard!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {myResults.map(res => (
            <div key={res.id} className="card" style={{ borderLeft: res.status === 'PASS' ? '4px solid #10b981' : '4px solid #ef4444', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-700)' }}>{res.subjectCode}</span>
                <span className={`badge ${res.status === 'PASS' ? 'badge-green' : 'badge-red'}`}>{res.status}</span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.75rem' }}>{res.examTitle}</h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <span>Score: <strong style={{ color: '#059669' }}>{res.obtainedMarks} / {res.totalMarks}</strong></span>
                <span>Percentage: <strong>{res.percentage}%</strong></span>
                <span>Rank: <strong>#{res.rank}</strong></span>
              </div>

              <button onClick={() => onViewResult(res)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700' }}>
                <span>View Detailed Solution Key</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

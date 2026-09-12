import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, ArrowLeft, Target, Clock, Trophy, FileText } from 'lucide-react';

export default function ExamResultView({ resultData, onBackToDashboard }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CORRECT' | 'WRONG' | 'UNANSWERED'

  if (!resultData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No result data available</h2>
        <button onClick={onBackToDashboard} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const {
    examTitle,
    subjectCode,
    studentName,
    rollNo,
    totalMarks,
    obtainedMarks,
    percentage,
    correctCount,
    wrongCount,
    unansweredCount,
    accuracy,
    rank,
    status,
    submittedAt,
    questionBreakdown
  } = resultData;

  const filteredQuestions = (questionBreakdown || []).filter(item => {
    if (filter === 'CORRECT') return item.isCorrect;
    if (filter === 'WRONG') return !item.isCorrect && !item.isUnanswered;
    if (filter === 'UNANSWERED') return item.isUnanswered;
    return true;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Back Button */}
      <button onClick={onBackToDashboard} className="btn btn-secondary" style={{ marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Student Dashboard</span>
      </button>

      {/* 1. Scorecard Hero Banner */}
      <div className="card" style={{
        background: status === 'PASS' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
          : 'linear-gradient(135deg, #450a0a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${status === 'PASS' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                RESULT: {status}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Subject: {subjectCode} • Submitted on {new Date(submittedAt).toLocaleTimeString()}
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              {examTitle}
            </h1>
            
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Candidate: <strong>{studentName}</strong> (Roll: {rollNo})
            </div>
          </div>

          {/* Big Score Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Score</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#60a5fa', lineHeight: 1.1 }}>
                {obtainedMarks} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {totalMarks}</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Percentage</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: status === 'PASS' ? '#34d399' : '#f87171', lineHeight: 1.1 }}>
                {percentage}%
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Correct Answers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>{correctCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={24} color="#dc2626" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Incorrect Answers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#dc2626' }}>{wrongCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Accuracy Percentage</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284c7' }}>{accuracy}%</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={24} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Class Rank</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#d97706' }}>Rank #{rank}</div>
          </div>
        </div>

      </div>

      {/* 3. Solution Review Header & Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Question & Solution Key Review</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Review detailed explanations and verify answer correctness.</p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'CORRECT', 'WRONG', 'UNANSWERED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Question Review List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredQuestions.map((item, index) => {
            const q = item.question;
            const selectedIdx = item.selectedOptionIndex;
            const correctIdx = q.correctOptionIndex;

            return (
              <div key={q.id} className="card" style={{ borderLeft: item.isCorrect ? '4px solid #10b981' : item.isUnanswered ? '4px solid #94a3b8' : '4px solid #ef4444' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--primary-700)' }}>Q{index + 1}.</span>
                    <span className="badge badge-gray">{q.topic}</span>
                    <span className="badge badge-blue">+{q.marks} Marks</span>
                  </div>

                  <span className={`badge ${
                    item.isCorrect ? 'badge-green' : item.isUnanswered ? 'badge-gray' : 'badge-red'
                  }`}>
                    {item.isCorrect ? 'Correct' : item.isUnanswered ? 'Unanswered' : 'Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '0.98rem', fontWeight: '600', marginBottom: '1rem' }}>
                  {q.text}
                </div>

                {/* Options List with Color Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map((optText, optIdx) => {
                    const isOptionSelected = selectedIdx === optIdx;
                    const isOptionCorrect = correctIdx === optIdx;

                    let bg = '#ffffff';
                    let border = 'var(--border-color)';
                    let icon = null;

                    if (isOptionCorrect) {
                      bg = '#d1fae5';
                      border = '#059669';
                      icon = <CheckCircle2 size={16} color="#059669" />;
                    } else if (isOptionSelected && !isOptionCorrect) {
                      bg = '#fee2e2';
                      border = '#dc2626';
                      icon = <XCircle size={16} color="#dc2626" />;
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bg,
                          border: `1px solid ${border}`,
                          fontSize: '0.88rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{optText}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.82rem'
                }}>
                  <strong style={{ color: 'var(--primary-700)', display: 'block', marginBottom: '0.25rem' }}>
                    Solution Explanation:
                  </strong>
                  <span style={{ color: 'var(--text-main)' }}>{q.explanation}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

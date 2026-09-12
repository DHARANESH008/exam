import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HelpCircle, 
  PlusCircle, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Trash2, 
  Check, 
  BookOpenCheck,
  AlertCircle,
  FileUp,
  Layers,
  Award,
  ArrowRight,
  X,
  Users,
  BarChart3
} from 'lucide-react';

export default function FacultyOverview({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();
  const { exams, questions, results, createExam, addQuestion, bulkAddQuestions } = useExam();

  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  // File Upload State
  const [fileRawText, setFileRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // New Question Form State (Single Question)
  const [newQ, setNewQ] = useState({
    subjectId: 'sub_cs303',
    topic: 'Core Java',
    difficulty: 'EASY',
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    marks: 5,
    negativeMarks: 1.25,
    explanation: ''
  });

  // New Exam Form State
  const initialSelectedQIds = questions.map(q => q.id);
  const initialCalculatedMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  const [newExam, setNewExam] = useState({
    title: '',
    subjectCode: 'CS303',
    subjectName: 'Object Oriented Programming with Java',
    department: 'CSE',
    batch: '3rd Year CSE',
    durationMinutes: 30,
    totalMarks: initialCalculatedMarks || 50,
    passPercentage: 50,
    negativeMarkingEnabled: true,
    selectedQuestionIds: initialSelectedQIds
  });

  // Sample CSV/Text Template Generator
  const sampleTemplateText = `Question Text,Option A,Option B,Option C,Option D,Correct Option (0-3),Topic,Difficulty,Marks
Which keyword is used for inheritance in Java?,extend,extends,inherits,super,1,OOP Concepts,EASY,5
What is the time complexity of searching in a HashMap?,O(n),O(log n),O(1) average,O(n^2),2,Data Structures,MEDIUM,5
Which collection class allows unique null key?,Hashtable,HashMap,TreeMap,ConcurrentHashMap,1,Java Collections,MEDIUM,5
What happens when main method is declared private?,Compiles but runtime error,Compilation Error,Executes normally,Throws NullPointerException,0,JVM Core,HARD,5`;

  const handleParseFileContent = (contentToParse) => {
    try {
      const lines = contentToParse.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return;

      const results = [];
      const startIndex = lines[0].toLowerCase().includes('question') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 6) {
          const qText = parts[0];
          const optA = parts[1] || 'Option A';
          const optB = parts[2] || 'Option B';
          const optC = parts[3] || 'Option C';
          const optD = parts[4] || 'Option D';
          const correctIdx = parseInt(parts[5], 10) || 0;
          const topic = parts[6] || 'Java Fundamentals';
          const difficulty = (parts[7] || 'MEDIUM').toUpperCase();
          const marks = parseInt(parts[8], 10) || 5;

          results.push({
            text: qText,
            options: [optA, optB, optC, optD],
            correctOptionIndex: Math.min(3, Math.max(0, correctIdx)),
            topic,
            difficulty,
            marks,
            negativeMarks: 1.25,
            explanation: `Correct option is ${String.fromCharCode(65 + correctIdx)}. Verified by Faculty.`
          });
        }
      }

      setParsedQuestions(results);
    } catch (e) {
      alert('Error parsing file content. Please check CSV format.');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setFileRawText(text);
      handleParseFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleImportParsedQuestions = () => {
    if (!parsedQuestions.length) return;
    bulkAddQuestions(parsedQuestions);
    setUploadSuccessMsg(`Successfully imported ${parsedQuestions.length} single questions into the Question Bank!`);
    setTimeout(() => {
      setShowFileUploadModal(false);
      setParsedQuestions([]);
      setFileRawText('');
      setUploadSuccessMsg('');
      if (setActiveTab) setActiveTab('questions');
    }, 1200);
  };

  const handleAddSingleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQ.text || newQ.options.some(o => !o.trim())) return;
    addQuestion(newQ);
    setShowAddQuestionModal(false);
    setNewQ({
      subjectId: 'sub_cs303',
      topic: 'Core Java',
      difficulty: 'EASY',
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      marks: 5,
      negativeMarks: 1.25,
      explanation: ''
    });
    if (setActiveTab) setActiveTab('questions');
  };

  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    if (!newExam.title || !newExam.selectedQuestionIds.length) return;

    const selectedQs = questions.filter(q => newExam.selectedQuestionIds.includes(q.id));
    const calculatedTotalMarks = selectedQs.reduce((sum, q) => sum + Number(q.marks || 0), 0);

    createExam({
      ...newExam,
      totalQuestions: newExam.selectedQuestionIds.length,
      totalMarks: calculatedTotalMarks > 0 ? calculatedTotalMarks : newExam.totalMarks,
      createdByName: currentUser?.name || 'Dr. Anitha Sharma',
      instructions: [
        `Exam duration is ${newExam.durationMinutes} minutes.`,
        'All questions carry equal marks unless stated otherwise.',
        'Negative marking is enabled for incorrect answers.'
      ],
      questionIds: newExam.selectedQuestionIds
    });
    setShowCreateExamModal(false);
    alert('Examination created and published successfully!');
  };

  const toggleQuestionForExam = (qId) => {
    setNewExam(prev => {
      const exists = prev.selectedQuestionIds.includes(qId);
      const nextIds = exists
        ? prev.selectedQuestionIds.filter(id => id !== qId)
        : [...prev.selectedQuestionIds, qId];

      const nextSelectedQs = questions.filter(q => nextIds.includes(q.id));
      const calculatedTotalMarks = nextSelectedQs.reduce((sum, q) => sum + Number(q.marks || 0), 0);

      return {
        ...prev,
        selectedQuestionIds: nextIds,
        totalMarks: calculatedTotalMarks
      };
    });
  };

  // View 1: Question Bank Manager ONLY
  if (activeTab === 'questions') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <HelpCircle size={22} color="#059669" />
              <span>Subject Question Bank ({questions.length} Questions Available)</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Manage individual questions or bulk upload questions via CSV/TXT files for student exams.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowFileUploadModal(true)} className="btn btn-outline-primary" style={{ fontSize: '0.82rem', borderColor: '#059669', color: '#059669', fontWeight: '700' }}>
              <Upload size={14} /> Bulk File Upload
            </button>
            <button onClick={() => setShowAddQuestionModal(true)} className="btn btn-primary" style={{ fontSize: '0.82rem', backgroundColor: '#059669', fontWeight: '700' }}>
              + Add New Question
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="card" style={{
              padding: '1.1rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid #059669',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '900', color: '#059669', fontSize: '0.95rem' }}>Question #{idx + 1}</span>
                  <span className="badge badge-gray">{q.topic}</span>
                  <span className={`badge ${q.difficulty === 'EASY' ? 'badge-green' : q.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-red'}`}>{q.difficulty}</span>
                </div>
                <span className="badge badge-blue">+{q.marks} Marks</span>
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                {q.text}
              </div>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {q.options.map((opt, oIdx) => (
                  <div 
                    key={oIdx}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      backgroundColor: oIdx === q.correctOptionIndex ? '#d1fae5' : '#f8fafc',
                      border: oIdx === q.correctOptionIndex ? '1px solid #10b981' : '1px solid #e2e8f0',
                      color: oIdx === q.correctOptionIndex ? '#065f46' : 'var(--text-main)',
                      fontWeight: oIdx === q.correctOptionIndex ? '700' : '400'
                    }}
                  >
                    <strong>{String.fromCharCode(65 + oIdx)}:</strong> {opt} {oIdx === q.correctOptionIndex && '✓'}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '600', marginTop: '0.35rem' }}>
                  💡 Solution Key: {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Render File Upload & Add Question Modals */}
        {renderFileUploadModal()}
        {renderAddSingleQuestionModal()}
      </div>
    );
  }

  // View 2: Create New Exam View ONLY
  if (activeTab === 'create-exam') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <PlusCircle size={22} color="#059669" />
              <span>Create & Schedule Online CBT Exam</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Configure examination parameters and allocate single questions to student tests.
            </p>
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '16px' }}>
          <form onSubmit={handleCreateExamSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '700' }}>Examination Title</label>
              <input required value={newExam.title} onChange={(e) => setNewExam({ ...newExam, title: e.target.value })} className="form-input" placeholder="e.g. CS303 Java & Data Structures Mid-Term Exam" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">Subject Code</label>
                <input required value={newExam.subjectCode} onChange={(e) => setNewExam({ ...newExam, subjectCode: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Department & Batch</label>
                <input required value={newExam.batch} onChange={(e) => setNewExam({ ...newExam, batch: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Duration (Minutes)</label>
                <input type="number" required value={newExam.durationMinutes} onChange={(e) => setNewExam({ ...newExam, durationMinutes: Number(e.target.value) })} className="form-input" />
              </div>
              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total Marks</span>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>✓ Auto-calculated</span>
                </label>
                <input type="number" required value={newExam.totalMarks} onChange={(e) => setNewExam({ ...newExam, totalMarks: Number(e.target.value) })} className="form-input" placeholder="Auto-calculated from questions" />
              </div>
            </div>

            {/* Questions Selection List */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ fontWeight: '800', color: '#059669', margin: 0 }}>
                  Allocate Questions from Question Bank ({newExam.selectedQuestionIds.length} Selected):
                </label>
                <span className="badge badge-green">
                  {questions.length} Available in Bank
                </span>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.75rem', backgroundColor: '#f8fafc' }}>
                {questions.map((q, idx) => {
                  const isSelected = newExam.selectedQuestionIds.includes(q.id);
                  return (
                    <label key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderRadius: '8px', backgroundColor: isSelected ? '#ecfdf5' : '#ffffff', marginBottom: '0.4rem', cursor: 'pointer', border: isSelected ? '1px solid #10b981' : '1px solid #e2e8f0' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuestionForExam(q.id)}
                        style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: isSelected ? '700' : '500', color: 'var(--text-main)' }}>
                          <strong>Q{idx + 1}:</strong> {q.text}
                        </span>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Topic: {q.topic} • Marks: +{q.marks}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setActiveTab && setActiveTab('dashboard')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800' }}>
                <BookOpenCheck size={16} />
                <span>Publish & Schedule CBT Examination</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View 3: Student Results & Analytics ONLY
  if (activeTab === 'class-results') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Award size={22} color="#059669" />
              <span>Student Results & Performance Analytics</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Review student exam submissions, individual marks, pass percentages, and class leaderboard.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
            {results.length} Total Submissions
          </span>
        </div>

        {/* Results Summary Table */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No student submissions recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem' }}>Roll No</th>
                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem' }}>Exam Title</th>
                    <th style={{ padding: '0.75rem' }}>Score</th>
                    <th style={{ padding: '0.75rem' }}>Percentage</th>
                    <th style={{ padding: '0.75rem' }}>Rank</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, idx) => (
                    <tr key={res.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: '#059669' }}>{res.rollNo || '21CSE104'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{res.studentName || 'Rahul V. Sharma'}</td>
                      <td style={{ padding: '0.75rem' }}>{res.examTitle}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '800' }}>{res.obtainedMarks} / {res.totalMarks}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: '#2563eb' }}>{res.percentage}%</td>
                      <td style={{ padding: '0.75rem', fontWeight: '700' }}>#{res.rank || 1}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${res.status === 'PASS' ? 'badge-green' : 'badge-red'}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default View: Faculty Dashboard Overview
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Faculty Hero Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #0f172a 100%)',
        color: '#ffffff',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>Faculty Assessment Studio</span>
              <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>SVGI EXAM Portal</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
              Faculty Dashboard — {currentUser?.name}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#d1fae5' }}>
              Upload question bank files, manage individual single questions, and schedule online CBT examinations for students.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowFileUploadModal(true)} className="btn" style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: '700' }}>
              <Upload size={16} />
              <span>Upload Question File</span>
            </button>

            <button onClick={() => setShowAddQuestionModal(true)} className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: '700' }}>
              <PlusCircle size={16} />
              <span>Add Single Question</span>
            </button>

            <button onClick={() => setActiveTab && setActiveTab('create-exam')} className="btn btn-primary" style={{ backgroundColor: '#047857', border: 'none', fontWeight: '700' }}>
              <BookOpenCheck size={16} />
              <span>Create New Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Total Questions in Bank</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#059669' }}>{questions.length} Single Questions</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Configured Exams</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary-600)' }}>{exams.length} Live Exams</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Assigned Subject</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#d97706' }}>Java & Data Structures</div>
        </div>
      </div>

      {/* Faculty Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('questions')} 
          style={{ borderLeft: '4px solid #059669', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={24} color="#059669" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Question Bank</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{questions.length} Questions Ready</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              View, edit, or upload single question banks via CSV/TXT files with auto-parsing.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#059669', borderColor: '#a7f3d0' }}>
            <span>Go to Question Bank Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('create-exam')} 
          style={{ borderLeft: '4px solid #2563eb', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <PlusCircle size={24} color="#2563eb" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Create New Exam</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Configure & Schedule</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              Set exam parameters, negative marking rules, and allocate single questions to tests.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#2563eb', borderColor: '#bfdbfe' }}>
            <span>Go to Create Exam Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('class-results')} 
          style={{ borderLeft: '4px solid #d97706', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Award size={24} color="#d97706" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Student Results</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{results.length} Submissions Logged</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              Analyze student marks, rank summaries, class pass percentage, and individual scorecards.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#d97706', borderColor: '#fef3c7' }}>
            <span>Go to Student Results Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {renderFileUploadModal()}
      {renderAddSingleQuestionModal()}
    </div>
  );

  // Helper Modal Renders
  function renderFileUploadModal() {
    if (!showFileUploadModal) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#ffffff', borderRadius: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Upload & Import Question Bank File
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Upload a CSV / TXT / JSON file with questions. The portal parses each item into single questions for student exams.
              </p>
            </div>
            <button onClick={() => setShowFileUploadModal(false)} className="btn" style={{ background: 'none', border: 'none' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          {uploadSuccessMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#d1fae5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '700', marginBottom: '1rem' }}>
              <CheckCircle2 size={18} />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* File Drop / Select Area */}
          <div style={{
            border: '2px dashed #059669',
            backgroundColor: '#ecfdf5',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            <FileUp size={36} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#065f46' }}>
              Select Question Bank File (.csv / .txt)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#047857', marginBottom: '1rem' }}>
              Drag and drop your file here or click below to browse.
            </p>
            
            <label className="btn btn-primary" style={{ backgroundColor: '#059669', cursor: 'pointer', display: 'inline-flex' }}>
              <Upload size={16} /> Browse Question File
              <input type="file" accept=".csv,.txt,.json" onChange={handleFileInputChange} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Or Paste Raw File Text */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label">Or Paste File Contents (CSV format)</label>
              <button 
                type="button" 
                onClick={() => {
                  setFileRawText(sampleTemplateText);
                  handleParseFileContent(sampleTemplateText);
                }}
                style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: '700', background: 'none', border: 'none' }}
              >
                Load Sample CSV Template
              </button>
            </div>
            <textarea
              rows={4}
              value={fileRawText}
              onChange={(e) => {
                setFileRawText(e.target.value);
                handleParseFileContent(e.target.value);
              }}
              className="form-input"
              placeholder="Question Text, Option A, Option B, Option C, Option D, Correct Option Index (0-3), Topic, Difficulty, Marks"
            />
          </div>

          {/* Parsed Preview Table */}
          {parsedQuestions.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#059669' }}>
                  Parsed Preview ({parsedQuestions.length} Single Questions Ready)
                </span>
                <span className="badge badge-green">Valid CSV Format</span>
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                {parsedQuestions.map((pq, idx) => (
                  <div key={idx} style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.82rem', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <strong>Single Q{idx + 1}:</strong> {pq.text}<br />
                    <span style={{ color: '#059669', fontSize: '0.76rem' }}>
                      Options: [{pq.options.join(' | ')}] • Correct: Option {String.fromCharCode(65 + pq.correctOptionIndex)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setShowFileUploadModal(false)} className="btn btn-secondary">Cancel</button>
            <button 
              type="button" 
              onClick={handleImportParsedQuestions} 
              disabled={!parsedQuestions.length}
              className="btn btn-primary"
              style={{ backgroundColor: '#059669' }}
            >
              Import & Allocate {parsedQuestions.length} Single Questions
            </button>
          </div>

        </div>
      </div>
    );
  }

  function renderAddSingleQuestionModal() {
    if (!showAddQuestionModal) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#ffffff', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--accent-slate)' }}>Create Individual Single Question</h3>
          
          <form onSubmit={handleAddSingleQuestionSubmit}>
            <div className="form-group">
              <label className="form-label">Single Question Statement</label>
              <textarea 
                required
                rows={3}
                value={newQ.text} 
                onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                className="form-input" 
                placeholder="Enter the question statement..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Topic</label>
                <input required value={newQ.topic} onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Difficulty</label>
                <select value={newQ.difficulty} onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })} className="form-select">
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Options (Mark radio button for correct answer choice)</label>
              {newQ.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="radio" 
                    name="correctChoice" 
                    checked={newQ.correctOptionIndex === i} 
                    onChange={() => setNewQ({ ...newQ, correctOptionIndex: i })}
                  />
                  <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{String.fromCharCode(65 + i)}:</span>
                  <input 
                    required 
                    value={opt} 
                    onChange={(e) => {
                      const updatedOpts = [...newQ.options];
                      updatedOpts[i] = e.target.value;
                      setNewQ({ ...newQ, options: updatedOpts });
                    }}
                    className="form-input"
                    placeholder={`Option ${String.fromCharCode(65 + i)} text`}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Solution Explanation</label>
              <textarea 
                rows={2}
                value={newQ.explanation} 
                onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                className="form-input" 
                placeholder="Explain why the correct answer is right..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowAddQuestionModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669' }}>Save Single Question</button>
            </div>
          </form>

        </div>
      </div>
    );
  }
}

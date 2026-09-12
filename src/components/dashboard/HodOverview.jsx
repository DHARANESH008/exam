import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import { MOCK_DEPARTMENTS, MOCK_SUBJECTS, MOCK_STUDENT_RESULTS } from '../../data/mockData';
import { 
  Building2, 
  Award, 
  Users, 
  TrendingUp, 
  BarChart2, 
  ShieldCheck, 
  CheckCircle2,
  BookOpenCheck,
  ArrowRight,
  ShieldAlert,
  FileText,
  Search,
  UserCheck,
  BookOpen,
  GraduationCap,
  PlusCircle,
  X,
  Filter,
  UserPlus,
  Building,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock database of student exam histories for HOD lookup
const MOCK_STUDENT_ACADEMIC_HISTORY = {
  '21CSE104': {
    rollNo: '21CSE104',
    name: 'Rahul V. Sharma',
    department: 'CSE',
    batch: '2021-2025 (3rd Year)',
    cgpa: '8.4',
    totalExams: 4,
    passedExams: 4,
    avgPercentage: 86,
    history: [
      { subjectCode: 'CS303', subjectName: 'Core Java Fundamentals', examTitle: 'Unit Test I: Core Java', score: 20, total: 25, percentage: 80, rank: 4, status: 'PASS', date: '2026-09-01' },
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', examTitle: 'Mid-Term Model Exam', score: 45, total: 50, percentage: 90, rank: 2, status: 'PASS', date: '2026-08-20' },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', examTitle: 'Semester Quiz', score: 36, total: 40, percentage: 90, rank: 3, status: 'PASS', date: '2026-08-10' },
      { subjectCode: 'CS304', subjectName: 'Web Technology & Cloud', examTitle: 'Model Assessment', score: 42, total: 50, percentage: 84, rank: 5, status: 'PASS', date: '2026-07-28' }
    ]
  },
  '21CSE105': {
    rollNo: '21CSE105',
    name: 'Priya S. Kumar',
    department: 'CSE',
    batch: '2021-2025 (3rd Year)',
    cgpa: '9.3',
    totalExams: 4,
    passedExams: 4,
    avgPercentage: 93,
    history: [
      { subjectCode: 'CS303', subjectName: 'Core Java Fundamentals', examTitle: 'Unit Test I: Core Java', score: 24, total: 25, percentage: 96, rank: 1, status: 'PASS', date: '2026-09-01' },
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', examTitle: 'Mid-Term Model Exam', score: 48, total: 50, percentage: 96, rank: 1, status: 'PASS', date: '2026-08-20' },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', examTitle: 'Semester Quiz', score: 38, total: 40, percentage: 95, rank: 1, status: 'PASS', date: '2026-08-10' },
      { subjectCode: 'CS304', subjectName: 'Web Technology & Cloud', examTitle: 'Model Assessment', score: 43, total: 50, percentage: 86, rank: 3, status: 'PASS', date: '2026-07-28' }
    ]
  },
  '21CSE108': {
    rollNo: '21CSE108',
    name: 'Karthik R.',
    department: 'CSE',
    batch: '2021-2025 (3rd Year)',
    cgpa: '7.2',
    totalExams: 4,
    passedExams: 3,
    avgPercentage: 68,
    history: [
      { subjectCode: 'CS303', subjectName: 'Core Java Fundamentals', examTitle: 'Unit Test I: Core Java', score: 18, total: 25, percentage: 72, rank: 8, status: 'PASS', date: '2026-09-01' },
      { subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', examTitle: 'Mid-Term Model Exam', score: 22, total: 50, percentage: 44, rank: 18, status: 'FAIL', date: '2026-08-20' },
      { subjectCode: 'CS302', subjectName: 'Database Management Systems', examTitle: 'Semester Quiz', score: 28, total: 40, percentage: 70, rank: 10, status: 'PASS', date: '2026-08-10' },
      { subjectCode: 'CS304', subjectName: 'Web Technology & Cloud', examTitle: 'Model Assessment', score: 43, total: 50, percentage: 86, rank: 4, status: 'PASS', date: '2026-07-28' }
    ]
  }
};

export default function HodOverview({ roleOverride, activeTab, setActiveTab }) {
  const { currentUser, allUsers, addUser } = useAuth();
  const { exams, results, questions } = useExam();
  const activeRole = roleOverride || currentUser?.role || 'HOD';

  // Departments List State
  const [deptList, setDeptList] = useState(MOCK_DEPARTMENTS);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [selectedDeptForDetail, setSelectedDeptForDetail] = useState(null);

  const [newDept, setNewDept] = useState({
    code: '',
    name: '',
    totalStudents: 120,
    totalFaculty: 12
  });

  // Search State for Student Roll Number Search
  const [searchRollNo, setSearchRollNo] = useState('21CSE104');
  const [activeSearchResult, setActiveSearchResult] = useState(MOCK_STUDENT_ACADEMIC_HISTORY['21CSE104']);

  // Admin User Directory Filters & Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  
  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    rollNo: '',
    username: '',
    email: '',
    role: 'STUDENT',
    department: 'CSE',
    batch: '2021-2025 (3rd Year)'
  });

  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;
    const created = {
      id: `dept_${Date.now()}`,
      code: newDept.code.trim().toUpperCase(),
      name: newDept.name.trim(),
      totalStudents: Number(newDept.totalStudents) || 120,
      totalFaculty: Number(newDept.totalFaculty) || 12
    };
    setDeptList(prev => [...prev, created]);
    setShowAddDeptModal(false);
    alert(`Successfully added new Department: ${created.name} (${created.code})!`);
    setNewDept({ code: '', name: '', totalStudents: 120, totalFaculty: 12 });
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name) return;
    const added = addUser(newUser);
    alert(`Successfully registered new user: ${added.name} (${added.role}) in Department of ${added.department}! Username/Roll No: ${added.username}`);
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      rollNo: '',
      username: '',
      email: '',
      role: 'STUDENT',
      department: 'CSE',
      batch: '2021-2025 (3rd Year)'
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleaned = searchRollNo.trim().toUpperCase();
    if (MOCK_STUDENT_ACADEMIC_HISTORY[cleaned]) {
      setActiveSearchResult(MOCK_STUDENT_ACADEMIC_HISTORY[cleaned]);
    } else {
      setActiveSearchResult({
        rollNo: cleaned || '21CSE104',
        name: `Student (${cleaned})`,
        department: 'CSE',
        batch: '3rd Year B.Tech',
        cgpa: '8.0',
        totalExams: results.length || 1,
        passedExams: results.length || 1,
        avgPercentage: 80,
        history: results.length > 0 ? results.map(r => ({
          subjectCode: r.subjectCode || 'CS303',
          subjectName: 'Computer Science Core',
          examTitle: r.examTitle,
          score: r.obtainedMarks,
          total: r.totalMarks,
          percentage: r.percentage,
          rank: r.rank || 1,
          status: r.status,
          date: '2026-09-01'
        })) : [
          { subjectCode: 'CS303', subjectName: 'Core Java Fundamentals', examTitle: 'Unit Test I: Core Java', score: 20, total: 25, percentage: 80, rank: 4, status: 'PASS', date: '2026-09-01' }
        ]
      });
    }
  };

  // Helper render for Roll Number Search Panel
  const renderStudentRollNoSearchPanel = () => (
    <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Search size={20} color="#059669" />
            <span>Student Roll Number Performance Lookup</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Enter a student's roll number to view their subject-wise exam history, scorecards, and class ranks.
          </p>
        </div>

        {/* Quick Sample Roll Number Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick Select:</span>
          {['21CSE104', '21CSE105', '21CSE108'].map(roll => (
            <button
              key={roll}
              onClick={() => {
                setSearchRollNo(roll);
                setActiveSearchResult(MOCK_STUDENT_ACADEMIC_HISTORY[roll]);
              }}
              className="btn btn-secondary"
              style={{
                fontSize: '0.76rem',
                padding: '0.25rem 0.55rem',
                fontWeight: '700',
                backgroundColor: searchRollNo.toUpperCase() === roll ? '#ecfdf5' : '#f1f5f9',
                borderColor: searchRollNo.toUpperCase() === roll ? '#10b981' : '#cbd5e1',
                color: searchRollNo.toUpperCase() === roll ? '#065f46' : 'var(--text-main)'
              }}
            >
              {roll}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchRollNo}
            onChange={(e) => setSearchRollNo(e.target.value)}
            placeholder="Type Roll Number (e.g. 21CSE104)..."
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontWeight: '700', fontSize: '0.95rem' }}
          />
          <Search size={18} color="#059669" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800', padding: '0.6rem 1.25rem' }}>
          Search Student History
        </button>
      </form>

      {/* Student Profile & Performance Result Card */}
      {activeSearchResult && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', border: '2px solid #10b981' }}>
                {activeSearchResult.name ? activeSearchResult.name.charAt(0) : 'S'}
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                  {activeSearchResult.name}
                </h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Roll Number: <strong style={{ color: '#059669' }}>{activeSearchResult.rollNo}</strong> • Department of {activeSearchResult.department} ({activeSearchResult.batch})
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '1rem', background: '#ffffff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Overall Avg</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#059669' }}>{activeSearchResult.avgPercentage}%</div>
              </div>
              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Passed / Total</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#2563eb' }}>{activeSearchResult.passedExams} / {activeSearchResult.totalExams}</div>
              </div>
              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>CGPA</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#7c3aed' }}>{activeSearchResult.cgpa || '8.4'}</div>
              </div>
            </div>
          </div>

          {/* Subject Performance Breakdown Table */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--accent-slate)', marginBottom: '0.75rem' }}>
              Subject-Wise Exam Performance & History:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem' }}>Subject</th>
                  <th style={{ padding: '0.65rem' }}>Exam Title</th>
                  <th style={{ padding: '0.65rem' }}>Score</th>
                  <th style={{ padding: '0.65rem' }}>Percentage</th>
                  <th style={{ padding: '0.65rem' }}>Rank</th>
                  <th style={{ padding: '0.65rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeSearchResult.history.map((h, hIdx) => (
                  <tr key={hIdx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: hIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '0.65rem' }}>
                      <strong style={{ color: '#059669' }}>{h.subjectCode}</strong><br />
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{h.subjectName}</span>
                    </td>
                    <td style={{ padding: '0.65rem', fontWeight: '600' }}>{h.examTitle}</td>
                    <td style={{ padding: '0.65rem', fontWeight: '800' }}>{h.score} / {h.total}</td>
                    <td style={{ padding: '0.65rem', fontWeight: '700', color: '#2563eb' }}>{h.percentage}%</td>
                    <td style={{ padding: '0.65rem', fontWeight: '700' }}>#{h.rank}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <span className={`badge ${h.status === 'PASS' ? 'badge-green' : 'badge-red'}`}>
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );

  // View 1: Student Results & History ONLY (Dedicated HOD Student Directory Tab)
  if (activeTab === 'student-lookup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Users size={22} color="#059669" />
              <span>Student Results & Academic History</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Search any student by Roll Number to inspect overall CGPA, subject performance, and scorecards.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
            340 Students Registered
          </span>
        </div>

        {/* Render Roll Number Search Workspace */}
        {renderStudentRollNoSearchPanel()}
      </div>
    );
  }

  // View 2: Subject & Class Analytics ONLY
  if (activeTab === 'analytics') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <BarChart2 size={22} color="#059669" />
              <span>Subject & Class Analytics</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Subject-wise pass rate analysis, score distribution, and student roll number lookup.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
            ● Dept Pass Rate: 92.4%
          </span>
        </div>

        {/* Subject Performance Breakdown */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--accent-slate)' }}>
            Course Wise Student Pass Percentage & Performance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_SUBJECTS.map((sub, idx) => {
              const passPct = [94, 88, 92, 96][idx % 4];
              return (
                <div key={sub.id} style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{sub.code}: {sub.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        Semester {sub.semester} • Department of CSE • Assigned Faculty: Dr. Anitha Sharma
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.25rem 0.65rem' }}>
                        {passPct}% Pass Rate
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginTop: '0.5rem' }}>
                    <div style={{ width: `${passPct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '5px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // View 3: Department Examinations ONLY
  if (activeTab === 'dept-exams') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <BookOpenCheck size={22} color="#059669" />
              <span>Department Examinations Audit</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Overview of active, scheduled, and completed examinations across all semesters in CSE.
            </p>
          </div>
          <span className="badge badge-blue" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
            {exams.length} Total Exams
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {exams.map(exam => (
            <div key={exam.id} className="card" style={{ borderLeft: exam.status === 'LIVE' ? '4px solid #10b981' : '4px solid #3b82f6', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className={`badge ${exam.status === 'LIVE' ? 'badge-green' : exam.status === 'SCHEDULED' ? 'badge-blue' : 'badge-gray'}`}>
                  {exam.status}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  {exam.subjectCode}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                {exam.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                Faculty Creator: <strong>{exam.createdByName}</strong> • Batch: {exam.batch}
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                fontSize: '0.8rem'
              }}>
                <div><strong>Duration:</strong> {exam.durationMinutes} mins</div>
                <div><strong>Questions:</strong> {exam.totalQuestions} Items</div>
                <div><strong>Total Marks:</strong> {exam.totalMarks}</div>
                <div><strong>Pass Mark:</strong> {exam.passPercentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Admin Views (For EXAM_ADMIN / SUPER_ADMIN)
  if (activeTab === 'departments') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={22} color="#059669" />
              <span>Departments & Batches Management</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Click any department card below to inspect student roster, current exam statuses, and performance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAddDeptModal(true)} className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800' }}>
              <PlusCircle size={16} /> + Add New Department
            </button>
            <button onClick={() => setShowAddUserModal(true)} className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: '700' }}>
              <UserPlus size={16} /> + Add Student / User
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {deptList.map(d => (
            <div 
              key={d.id} 
              className="card card-hover" 
              onClick={() => setSelectedDeptForDetail(d)}
              style={{ borderLeft: '4px solid #059669', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>{d.code}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Active Dept</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-main)' }}>{d.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                  <span>Enrolled Students: <strong style={{ color: '#059669' }}>{d.totalStudents}</strong></span>
                  <span>Faculty: <strong>{d.totalFaculty}</strong></span>
                </div>
              </div>
              
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#059669', borderColor: '#a7f3d0' }}>
                <Eye size={14} />
                <span>View Students & Exam Status</span>
              </button>
            </div>
          ))}
        </div>

        {renderDeptDetailModal()}
        {renderAddDeptModal()}
        {renderAddUserModal()}
      </div>
    );
  }

  if (activeTab === 'users') {
    const filteredUsers = allUsers.filter(u => {
      if (selectedRoleFilter !== 'ALL' && u.role !== selectedRoleFilter) return false;
      if (selectedDeptFilter !== 'ALL' && u.department !== selectedDeptFilter) return false;
      return true;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} color="#059669" />
              <span>User Directory & Student Roster</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Add new students, faculty, or HODs and manage authentication credentials across departments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAddDeptModal(true)} className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: '700' }}>
              <PlusCircle size={16} /> + Add Department
            </button>
            <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800' }}>
              <UserPlus size={16} /> + Add Student / User
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card" style={{ padding: '0.85rem 1.25rem', backgroundColor: '#ffffff', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            <Filter size={16} color="#059669" /> Filter Roster:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Role:</span>
            <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)} className="form-select" style={{ fontSize: '0.82rem', padding: '0.3rem 0.6rem' }}>
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students Only</option>
              <option value="FACULTY">Faculty Only</option>
              <option value="HOD">HODs Only</option>
              <option value="EXAM_ADMIN">Admins Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Department:</span>
            <select value={selectedDeptFilter} onChange={(e) => setSelectedDeptFilter(e.target.value)} className="form-select" style={{ fontSize: '0.82rem', padding: '0.3rem 0.6rem' }}>
              <option value="ALL">All Departments</option>
              {deptList.map(d => (
                <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
            Showing {filteredUsers.length} Users
          </span>
        </div>

        {/* User Directory Table */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#ffffff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>User Name</th>
                  <th style={{ padding: '0.75rem' }}>Roll No / Username</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Department</th>
                  <th style={{ padding: '0.75rem' }}>Batch / Designation</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '800', color: '#059669' }}>
                      {u.rollNo || u.username}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.role === 'STUDENT' ? 'badge-green' : u.role === 'FACULTY' ? 'badge-blue' : 'badge-yellow'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{u.department}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {u.batch || u.designation || '3rd Year CSE'}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.82rem' }}>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {renderAddDeptModal()}
        {renderAddUserModal()}
      </div>
    );
  }

  if (activeTab === 'all-exams') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0 }}>Manage All Examinations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {exams.map(exam => (
            <div key={exam.id} className="card" style={{ borderLeft: '4px solid #059669', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-green">{exam.status}</span>
                <span style={{ fontWeight: '800', color: '#059669' }}>{exam.subjectCode}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.3rem' }}>{exam.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Dept: {exam.department} • Creator: {exam.createdByName}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'audit') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0 }}>System Audit Logs</h2>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '700' }}>
            ✓ Real-time CBT session integrity verified. Auto-save engine running smoothly.
          </div>
        </div>
      </div>
    );
  }

  // Default View: HOD / Admin Department Portal Overview
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
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
              <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>
                {activeRole === 'EXAM_ADMIN' ? 'Controller of Exams' : 'HOD Executive Portal'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>Department of Computer Science</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.25rem' }}>
              {currentUser?.name} — Analytics & Quality Dashboard
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#d1fae5' }}>
              Department-level pass/fail statistics, subject performance breakdown, and student roll number lookup.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAddDeptModal(true)} className="btn" style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', fontWeight: '700' }}>
              <PlusCircle size={16} />
              <span>+ Add Department</span>
            </button>
            <button onClick={() => setShowAddUserModal(true)} className="btn" style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: '700' }}>
              <UserPlus size={16} />
              <span>+ Add Student / User</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Active Departments</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#059669' }}>{deptList.length} Departments</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Department Enrolled Students</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary-600)' }}>{allUsers.filter(u => u.role === 'STUDENT').length || 340} Students</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Average Pass Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#059669' }}>92.4%</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>Total Conducted Exams</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#d97706' }}>{exams.length} Exams</div>
        </div>
      </div>

      {/* Render Roll Number Search Panel directly on HOD Dashboard */}
      {renderStudentRollNoSearchPanel()}

      {/* HOD Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('student-lookup')} 
          style={{ borderLeft: '4px solid #2563eb', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Users size={24} color="#2563eb" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Student Results & History</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Roll Number Search</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              Search student roll numbers to inspect subject-wise performance history, CGPA, and ranks.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#2563eb', borderColor: '#bfdbfe' }}>
            <span>Go to Student Search Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('analytics')} 
          style={{ borderLeft: '4px solid #059669', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BarChart2 size={24} color="#059669" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Subject & Class Analytics</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Subject-wise Pass %</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              Detailed course progress bars, student pass percentages, and subject quality stats.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#059669', borderColor: '#a7f3d0' }}>
            <span>Go to Analytics Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div 
          className="card card-hover" 
          onClick={() => setActiveTab && setActiveTab('dept-exams')} 
          style={{ borderLeft: '4px solid #d97706', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BookOpenCheck size={24} color="#d97706" />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Department Examinations</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{exams.length} Exams Managed</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
              Monitor live, scheduled, and completed exams across CSE department semesters.
            </p>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: '700', color: '#d97706', borderColor: '#fef3c7' }}>
            <span>Go to Department Exams Page</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {renderDeptDetailModal()}
      {renderAddDeptModal()}
      {renderAddUserModal()}
    </div>
  );

  // Helper Modal: Department Detail Inspector Modal (Shows Students inside Department & Status)
  function renderDeptDetailModal() {
    if (!selectedDeptForDetail) return null;

    const deptStudents = allUsers.filter(u => u.department === selectedDeptForDetail.code || selectedDeptForDetail.code === 'CSE');

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-green" style={{ background: '#d1fae5', color: '#065f46' }}>{selectedDeptForDetail.code} Department</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Roster & CBT Exam Status</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                {selectedDeptForDetail.name}
              </h3>
            </div>
            <button onClick={() => setSelectedDeptForDetail(null)} className="btn" style={{ background: 'none', border: 'none' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          {/* Quick Dept Summary Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Students</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#059669' }}>{selectedDeptForDetail.totalStudents} Students</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Faculty Team</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#2563eb' }}>{selectedDeptForDetail.totalFaculty} Professors</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Overall Dept Pass Rate</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#047857' }}>92.4%</div>
            </div>
          </div>

          {/* Department Student List & Status Table */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--accent-slate)', marginBottom: '0.65rem' }}>
              Enrolled Students Roster & Current Examination Status:
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e1', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem' }}>Roll No</th>
                  <th style={{ padding: '0.65rem' }}>Student Name</th>
                  <th style={{ padding: '0.65rem' }}>Batch / Year</th>
                  <th style={{ padding: '0.65rem' }}>Active Exam Status</th>
                  <th style={{ padding: '0.65rem' }}>Avg Score</th>
                  <th style={{ padding: '0.65rem' }}>Overall Result</th>
                  <th style={{ padding: '0.65rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { roll: '21CSE104', name: 'Rahul V. Sharma', batch: '3rd Year CSE', examStatus: 'Submitted (CS303)', avgScore: '86%', result: 'PASS' },
                  { roll: '21CSE105', name: 'Priya S. Kumar', batch: '3rd Year CSE', examStatus: 'Submitted (CS303)', avgScore: '93%', result: 'PASS' },
                  { roll: '21CSE108', name: 'Karthik R.', batch: '3rd Year CSE', examStatus: 'Submitted (CS303)', avgScore: '68%', result: 'PASS' },
                  { roll: '21CSE110', name: 'Sanjay M.', batch: '3rd Year CSE', examStatus: 'In Progress (Timer Active)', avgScore: '78%', result: 'ACTIVE' },
                  { roll: '21CSE112', name: 'Divya N.', batch: '3rd Year CSE', examStatus: 'Scheduled (Not Started)', avgScore: '85%', result: 'PENDING' }
                ].map((st, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '0.65rem', fontWeight: '800', color: '#059669' }}>{st.roll}</td>
                    <td style={{ padding: '0.65rem', fontWeight: '700' }}>{st.name}</td>
                    <td style={{ padding: '0.65rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{st.batch}</td>
                    <td style={{ padding: '0.65rem', fontSize: '0.8rem', fontWeight: '600' }}>
                      {st.examStatus.includes('Submitted') ? (
                        <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={14} /> {st.examStatus}
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} /> {st.examStatus}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.65rem', fontWeight: '800', color: '#2563eb' }}>{st.avgScore}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <span className={`badge ${st.result === 'PASS' ? 'badge-green' : st.result === 'ACTIVE' ? 'badge-yellow' : 'badge-blue'}`}>
                        {st.result}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <button 
                        onClick={() => {
                          const targetRoll = st.roll;
                          setSelectedDeptForDetail(null);
                          setSearchRollNo(targetRoll);
                          if (MOCK_STUDENT_ACADEMIC_HISTORY[targetRoll]) {
                            setActiveSearchResult(MOCK_STUDENT_ACADEMIC_HISTORY[targetRoll]);
                          }
                          if (setActiveTab) setActiveTab('student-lookup');
                        }}
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', fontWeight: '700' }}
                      >
                        Inspect History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button onClick={() => setSelectedDeptForDetail(null)} className="btn btn-secondary">
              Close Department View
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Helper Modal 1: Add New Department Modal
  function renderAddDeptModal() {
    if (!showAddDeptModal) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '540px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0 }}>
                Create New Academic Department
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Add a new engineering department (e.g. AI & Data Science, Civil Engineering) to SVGI portal.
              </p>
            </div>
            <button onClick={() => setShowAddDeptModal(false)} className="btn" style={{ background: 'none', border: 'none' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <form onSubmit={handleAddDeptSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Dept Code</label>
                <input required type="text" value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} className="form-input" placeholder="e.g. AI&DS" />
              </div>

              <div>
                <label className="form-label">Full Department Name</label>
                <input required type="text" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} className="form-input" placeholder="e.g. Artificial Intelligence & Data Science" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Student Capacity</label>
                <input required type="number" value={newDept.totalStudents} onChange={(e) => setNewDept({ ...newDept, totalStudents: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Faculty Members Count</label>
                <input required type="number" value={newDept.totalFaculty} onChange={(e) => setNewDept({ ...newDept, totalFaculty: e.target.value })} className="form-input" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowAddDeptModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800' }}>
                <PlusCircle size={16} />
                <span>Create Department</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // Helper Modal 2: Add New Student / User Modal
  function renderAddUserModal() {
    if (!showAddUserModal) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '560px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-slate)', margin: 0 }}>
                Register New Student / System User
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Add new student roll numbers or faculty credentials into the SVGI examination system.
              </p>
            </div>
            <button onClick={() => setShowAddUserModal(false)} className="btn" style={{ background: 'none', border: 'none' }}>
              <X size={20} color="#64748b" />
            </button>
          </div>

          <form onSubmit={handleAddUserSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">User Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="form-select">
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="HOD">HOD</option>
                  <option value="EXAM_ADMIN">EXAM_ADMIN</option>
                </select>
              </div>

              <div>
                <label className="form-label">Department</label>
                <select value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} className="form-select">
                  {deptList.map(d => (
                    <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input required type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="form-input" placeholder="e.g. Anitha S. Kumar" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Roll Number / Username</label>
                <input required type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value, rollNo: e.target.value })} className="form-input" placeholder="e.g. 21CSE109" />
              </div>
              <div>
                <label className="form-label">Batch / Semester</label>
                <input type="text" value={newUser.batch} onChange={(e) => setNewUser({ ...newUser, batch: e.target.value })} className="form-input" placeholder="e.g. 2021-2025 (3rd Year)" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="form-input" placeholder="e.g. student@college.edu" />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', fontWeight: '800' }}>
                <UserCheck size={16} />
                <span>Register User & Enable Login</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }
}

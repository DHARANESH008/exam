import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpenCheck, 
  Award, 
  HelpCircle, 
  PlusCircle, 
  BarChart3, 
  Users, 
  Building2, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const renderNavItems = () => {
    if (role === 'STUDENT') {
      return (
        <>
          <NavItem id="dashboard" label="Student Dashboard" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="exams" label="Upcoming & Active Exams" icon={BookOpenCheck} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="results" label="My Exam Results" icon={Award} activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      );
    }

    if (role === 'FACULTY') {
      return (
        <>
          <NavItem id="dashboard" label="Faculty Dashboard" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="questions" label="Question Bank" icon={HelpCircle} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="create-exam" label="Create New Exam" icon={PlusCircle} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="class-results" label="Student Results" icon={Award} activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      );
    }

    if (role === 'HOD') {
      return (
        <>
          <NavItem id="dashboard" label="HOD Department Portal" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="student-lookup" label="Student Results & History" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="analytics" label="Subject & Class Analytics" icon={BarChart3} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="dept-exams" label="Department Examinations" icon={BookOpenCheck} activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      );
    }

    // EXAM_ADMIN / SUPER_ADMIN
    return (
      <>
        <NavItem id="dashboard" label="Admin Cell Control" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="departments" label="Departments & Batches" icon={Building2} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="users" label="User Directory" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="all-exams" label="Manage Examinations" icon={BookOpenCheck} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="audit" label="System Audit Logs" icon={ShieldAlert} activeTab={activeTab} setActiveTab={setActiveTab} />
      </>
    );
  };

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{ padding: '0 0.75rem 0.75rem', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {role} Menu
      </div>
      {renderNavItems()}
    </aside>
  );
}

function NavItem({ id, label, icon: Icon, activeTab, setActiveTab }) {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.88rem',
        fontWeight: isActive ? '700' : '500',
        color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
        backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.15s ease'
      }}
    >
      <Icon size={18} color={isActive ? 'var(--primary-600)' : 'var(--text-muted)'} />
      <span>{label}</span>
    </button>
  );
}

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExamProvider, useExam } from './context/ExamContext';

// Components
import LoginPage from './components/auth/LoginPage';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import StudentOverview from './components/dashboard/StudentOverview';
import FacultyOverview from './components/dashboard/FacultyOverview';
import HodOverview from './components/dashboard/HodOverview';
import ExamInterfacePage from './components/exam/ExamInterfacePage';
import ExamResultView from './components/results/ExamResultView';

function MainAppContent() {
  const { currentUser } = useAuth();
  const { isExamStarted, startExam } = useExam();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeResult, setActiveResult] = useState(null);

  // If user is not logged in, render the Login Page!
  if (!currentUser) {
    return <LoginPage />;
  }

  // If student is currently taking an exam, show full-screen CBT workspace!
  if (isExamStarted) {
    return (
      <ExamInterfacePage
        onFinishExam={(resultData) => {
          setActiveResult(resultData);
          setActiveTab('result-view');
        }}
      />
    );
  }

  // Handle Starting Exam from Student Dashboard
  const handleStartExam = (examId) => {
    startExam(examId);
  };

  // Handle Viewing Result Scorecard
  const handleViewResult = (resultData) => {
    setActiveResult(resultData);
    setActiveTab('result-view');
  };

  const renderTabContent = () => {
    if (activeTab === 'result-view') {
      return (
        <ExamResultView
          resultData={activeResult}
          onBackToDashboard={() => setActiveTab('dashboard')}
        />
      );
    }

    const role = currentUser?.role;

    if (role === 'STUDENT') {
      return (
        <StudentOverview
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartExam={handleStartExam}
          onViewResult={handleViewResult}
        />
      );
    }

    if (role === 'FACULTY') {
      return <FacultyOverview activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    if (role === 'HOD') {
      return <HodOverview roleOverride="HOD" activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // EXAM_ADMIN / SUPER_ADMIN
    return <HodOverview roleOverride="EXAM_ADMIN" activeTab={activeTab} setActiveTab={setActiveTab} />;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Header currentTab={activeTab} setCurrentTab={setActiveTab} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: '1400px' }}>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <MainAppContent />
      </ExamProvider>
    </AuthProvider>
  );
}

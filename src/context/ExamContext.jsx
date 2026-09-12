import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MOCK_EXAMS, MOCK_QUESTIONS, MOCK_STUDENT_RESULTS } from '../data/mockData';

const ExamContext = createContext(null);

export const QUESTION_STATES = {
  NOT_VISITED: 'NOT_VISITED',
  UNANSWERED: 'UNANSWERED',
  ANSWERED: 'ANSWERED',
  BOOKMARKED: 'BOOKMARKED',
  ANSWERED_AND_BOOKMARKED: 'ANSWERED_AND_BOOKMARKED'
};

export function ExamProvider({ children }) {
  // Persistent Storage for Exams, Questions, and Submissions
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('svgi_exams_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_EXAMS;
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('svgi_questions_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(q => q.id));
          const missingMocks = MOCK_QUESTIONS.filter(q => !existingIds.has(q.id));
          return [...parsed, ...missingMocks];
        }
      } catch (e) {}
    }
    return MOCK_QUESTIONS;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('svgi_results_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_STUDENT_RESULTS;
  });

  useEffect(() => {
    localStorage.setItem('svgi_exams_v1', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('svgi_questions_v1', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('svgi_results_v1', JSON.stringify(results));
  }, [results]);

  // Active Exam Attempt State
  const [activeExam, setActiveExam] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answers & Palette Status Maps
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [visited, setVisited] = useState({});
  
  // Timer & Security
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const timerRef = useRef(null);

  // Start Examination Workflow
  const startExam = (examId) => {
    const targetExam = exams.find(e => e.id === examId);
    if (!targetExam) return false;

    const examQuestionsList = questions.filter(q => targetExam.questionIds.includes(q.id));

    const storageKey = `smart_attempt_${examId}`;
    const savedAttempt = localStorage.getItem(storageKey);

    let initialAnswers = {};
    let initialBookmarks = {};
    let initialVisited = { [examQuestionsList[0]?.id]: true };
    let initialSecs = targetExam.durationMinutes * 60;

    if (savedAttempt) {
      try {
        const parsed = JSON.parse(savedAttempt);
        initialAnswers = parsed.answers || {};
        initialBookmarks = parsed.bookmarks || {};
        initialVisited = parsed.visited || initialVisited;
        initialSecs = parsed.remainingSeconds ?? initialSecs;
      } catch (e) {}
    }

    setActiveExam(targetExam);
    setActiveQuestions(examQuestionsList);
    setCurrentQuestionIndex(0);
    setAnswers(initialAnswers);
    setBookmarks(initialBookmarks);
    setVisited(initialVisited);
    setRemainingSeconds(initialSecs);
    setIsExamStarted(true);

    return true;
  };

  // Real-time Draft Saver
  const saveAttemptState = (newAnswers, newBookmarks, newVisited) => {
    if (!activeExam) return;
    setAutoSaveStatus('saving');
    const storageKey = `smart_attempt_${activeExam.id}`;
    const payload = {
      answers: newAnswers,
      bookmarks: newBookmarks,
      visited: newVisited,
      remainingSeconds,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString());
    }, 200);
  };

  // Timer Tick & Auto-Submit
  useEffect(() => {
    if (!isExamStarted || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamStarted, remainingSeconds]);

  // Answer Select Handler
  const selectAnswer = (questionId, optionIndex) => {
    const updatedAnswers = { ...answers, [questionId]: optionIndex };
    const updatedVisited = { ...visited, [questionId]: true };
    setAnswers(updatedAnswers);
    setVisited(updatedVisited);
    saveAttemptState(updatedAnswers, bookmarks, updatedVisited);
  };

  // Clear Choice Handler
  const clearAnswer = (questionId) => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[questionId];
    setAnswers(updatedAnswers);
    saveAttemptState(updatedAnswers, bookmarks, visited);
  };

  // Bookmark Toggle Handler
  const toggleBookmark = (questionId) => {
    const updatedBookmarks = { ...bookmarks, [questionId]: !bookmarks[questionId] };
    setBookmarks(updatedBookmarks);
    saveAttemptState(answers, updatedBookmarks, visited);
  };

  // Navigation Handlers
  const goToQuestion = (index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentQuestionIndex(index);
      const qId = activeQuestions[index].id;
      const updatedVisited = { ...visited, [qId]: true };
      setVisited(updatedVisited);
      saveAttemptState(answers, bookmarks, updatedVisited);
    }
  };

  // Calculate Question State for Palette Legend
  const getQuestionState = (questionId) => {
    const hasAnswer = answers[questionId] !== undefined && answers[questionId] !== null;
    const isBookmarked = !!bookmarks[questionId];
    const isVisited = !!visited[questionId];

    if (hasAnswer && isBookmarked) return QUESTION_STATES.ANSWERED_AND_BOOKMARKED;
    if (hasAnswer) return QUESTION_STATES.ANSWERED;
    if (isBookmarked) return QUESTION_STATES.BOOKMARKED;
    if (isVisited) return QUESTION_STATES.UNANSWERED;
    return QUESTION_STATES.NOT_VISITED;
  };

  // Submit Examination Engine
  const submitExam = (isAutoSubmit = false, studentUser = null) => {
    if (!activeExam || !activeQuestions.length) return null;

    let obtainedMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    activeQuestions.forEach(q => {
      const selectedIndex = answers[q.id];
      if (selectedIndex === undefined || selectedIndex === null) {
        unansweredCount++;
      } else if (selectedIndex === q.correctOptionIndex) {
        correctCount++;
        obtainedMarks += q.marks;
      } else {
        wrongCount++;
        if (activeExam.negativeMarkingEnabled) {
          obtainedMarks -= (q.negativeMarks || (q.marks * 0.25));
        }
      }
    });

    const computedExamTotalMarks = activeQuestions.reduce((sum, q) => sum + Number(q.marks || 1), 0);
    const examTotalMarks = computedExamTotalMarks > 0 ? computedExamTotalMarks : (activeExam.totalMarks || 1);

    const finalMarks = Math.max(0, parseFloat(obtainedMarks.toFixed(2)));
    const percentage = Math.round((finalMarks / examTotalMarks) * 100);
    const passStatus = percentage >= activeExam.passPercentage ? 'PASS' : 'FAIL';
    const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

    const sUser = studentUser || { id: 'usr_student1', name: 'Rahul V. Sharma', rollNo: '21CSE104' };

    const newResult = {
      id: `res_${Date.now()}`,
      attemptId: `att_${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      subjectCode: activeExam.subjectCode,
      studentId: sUser.id || sUser.rollNo || 'usr_student1',
      studentName: sUser.name || 'Rahul V. Sharma',
      rollNo: sUser.rollNo || sUser.username || '21CSE104',
      totalMarks: examTotalMarks,
      obtainedMarks: finalMarks,
      percentage,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracy,
      rank: Math.floor(Math.random() * 5) + 1,
      status: passStatus,
      isAutoSubmit,
      submittedAt: new Date().toISOString(),
      questionBreakdown: activeQuestions.map(q => ({
        question: q,
        selectedOptionIndex: answers[q.id],
        isCorrect: answers[q.id] === q.correctOptionIndex,
        isUnanswered: answers[q.id] === undefined || answers[q.id] === null
      }))
    };

    setResults(prev => [newResult, ...prev]);

    localStorage.removeItem(`smart_attempt_${activeExam.id}`);
    setIsExamStarted(false);

    return newResult;
  };

  // Add new exam (Faculty/Admin feature)
  const createExam = (newExamData) => {
    const assignedQIds = newExamData.questionIds || [];
    const assignedQs = questions.filter(q => assignedQIds.includes(q.id));
    const calculatedTotalMarks = assignedQs.reduce((sum, q) => sum + Number(q.marks || 0), 0);

    const created = {
      id: `ex_${Date.now()}`,
      ...newExamData,
      totalQuestions: assignedQIds.length,
      totalMarks: calculatedTotalMarks > 0 ? calculatedTotalMarks : (newExamData.totalMarks || 50),
      status: 'SCHEDULED',
      questionIds: assignedQIds
    };
    setExams(prev => [created, ...prev]);
    return created;
  };

  // Add new question (Faculty feature)
  const addQuestion = (questionData) => {
    const created = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...questionData
    };
    setQuestions(prev => [created, ...prev]);
    return created;
  };

  // Bulk Add Questions from File Import
  const bulkAddQuestions = (questionsArray) => {
    const createdList = questionsArray.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}`,
      subjectId: q.subjectId || 'sub_cs303',
      topic: q.topic || 'General Java',
      difficulty: q.difficulty || 'MEDIUM',
      text: q.text,
      options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: q.correctOptionIndex ?? 0,
      marks: q.marks || 5,
      negativeMarks: q.negativeMarks || 1.25,
      explanation: q.explanation || 'Verified solution answer.'
    }));

    setQuestions(prev => [...createdList, ...prev]);
    return createdList;
  };

  return (
    <ExamContext.Provider value={{
      exams,
      questions,
      results,
      activeExam,
      activeQuestions,
      currentQuestionIndex,
      answers,
      bookmarks,
      visited,
      remainingSeconds,
      isExamStarted,
      autoSaveStatus,
      lastSavedTime,
      startExam,
      selectAnswer,
      clearAnswer,
      toggleBookmark,
      goToQuestion,
      getQuestionState,
      submitExam,
      createExam,
      addQuestion,
      bulkAddQuestions
    }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within an ExamProvider');
  return context;
}

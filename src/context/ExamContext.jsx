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
  const [exams, setExams] = useState(MOCK_EXAMS);
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [results, setResults] = useState(MOCK_STUDENT_RESULTS);

  // Active Exam Attempt State
  const [activeExam, setActiveExam] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answers & Palette Status Maps
  const [answers, setAnswers] = useState({}); // { [qId]: optionIndex }
  const [bookmarks, setBookmarks] = useState({}); // { [qId]: boolean }
  const [visited, setVisited] = useState({}); // { [qId]: boolean }
  
  // Timer & Security
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'saving' | 'saved' | 'error'
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const timerRef = useRef(null);

  // Start Examination Workflow
  const startExam = (examId) => {
    const targetExam = exams.find(e => e.id === examId);
    if (!targetExam) return false;

    const examQuestionsList = questions.filter(q => targetExam.questionIds.includes(q.id));

    // Restore existing draft from localStorage if present
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
      } catch (e) {
        console.error('Error loading saved attempt', e);
      }
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

  // Timer Tick
  useEffect(() => {
    if (isExamStarted && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitExam(true); // Auto-submit when time reaches zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isExamStarted, remainingSeconds]);

  // Persistence Auto-Save Engine
  const saveAttemptState = (newAnswers, newBookmarks, newVisited) => {
    if (!activeExam) return;
    setAutoSaveStatus('saving');
    
    try {
      const storageKey = `smart_attempt_${activeExam.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        examId: activeExam.id,
        answers: newAnswers,
        bookmarks: newBookmarks,
        visited: newVisited,
        remainingSeconds,
        updatedAt: new Date().toISOString()
      }));

      setTimeout(() => {
        setAutoSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString());
      }, 200);
    } catch (e) {
      setAutoSaveStatus('error');
    }
  };

  // Select Option Answer
  const selectAnswer = (questionId, optionIndex) => {
    const updatedAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(updatedAnswers);
    saveAttemptState(updatedAnswers, bookmarks, visited);
  };

  // Clear Response
  const clearAnswer = (questionId) => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[questionId];
    setAnswers(updatedAnswers);
    saveAttemptState(updatedAnswers, bookmarks, visited);
  };

  // Toggle Bookmark
  const toggleBookmark = (questionId) => {
    const updatedBookmarks = {
      ...bookmarks,
      [questionId]: !bookmarks[questionId]
    };
    setBookmarks(updatedBookmarks);
    saveAttemptState(answers, updatedBookmarks, visited);
  };

  // Navigate to Question
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
  const submitExam = (isAutoSubmit = false) => {
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

    const finalMarks = Math.max(0, parseFloat(obtainedMarks.toFixed(2)));
    const percentage = Math.round((finalMarks / activeExam.totalMarks) * 100);
    const passStatus = percentage >= activeExam.passPercentage ? 'PASS' : 'FAIL';
    const accuracy = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

    const newResult = {
      id: `res_${Date.now()}`,
      attemptId: `att_${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      subjectCode: activeExam.subjectCode,
      studentId: 'usr_student1',
      studentName: 'Rahul V. Sharma',
      rollNo: '21CSE104',
      totalMarks: activeExam.totalMarks,
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

    // Clear local storage attempt draft
    localStorage.removeItem(`smart_attempt_${activeExam.id}`);
    setIsExamStarted(false);

    return newResult;
  };

  // Add new exam (Faculty/Admin feature)
  const createExam = (newExamData) => {
    const created = {
      id: `ex_${Date.now()}`,
      ...newExamData,
      status: 'SCHEDULED',
      questionIds: newExamData.questionIds || ['q1', 'q2', 'q3', 'q4', 'q5']
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

// SmartExam Mock Repository & Initial State Engine

export const MOCK_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  EXAM_ADMIN: 'EXAM_ADMIN',
  HOD: 'HOD',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT'
};

export const MOCK_USERS = [
  {
    id: 'usr_student1',
    username: 'student1',
    name: 'Rahul V. Sharma',
    rollNo: '21CSE104',
    email: 'rahul.sharma@college.edu',
    role: MOCK_ROLES.STUDENT,
    department: 'CSE',
    batch: '2021-2025 (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr_faculty1',
    username: 'faculty1',
    name: 'Dr. Anitha Sharma',
    email: 'anitha.sharma@college.edu',
    role: MOCK_ROLES.FACULTY,
    department: 'CSE',
    designation: 'Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr_hod1',
    username: 'hod1',
    name: 'Dr. V. Meenakshi',
    email: 'hod.cse@college.edu',
    role: MOCK_ROLES.HOD,
    department: 'CSE',
    designation: 'Head of Department - CSE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr_admin1',
    username: 'admin1',
    name: 'Prof. S. K. Roy',
    email: 'examcell.head@college.edu',
    role: MOCK_ROLES.EXAM_ADMIN,
    department: 'Exam Cell',
    designation: 'Controller of Examinations',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];

export const MOCK_DEPARTMENTS = [
  { id: 'dept_cse', code: 'CSE', name: 'Computer Science & Engineering', totalStudents: 340, totalFaculty: 24 },
  { id: 'dept_ece', code: 'ECE', name: 'Electronics & Communication Engg', totalStudents: 280, totalFaculty: 20 },
  { id: 'dept_eee', code: 'EEE', name: 'Electrical & Electronics Engg', totalStudents: 210, totalFaculty: 16 },
  { id: 'dept_mech', code: 'MECH', name: 'Mechanical Engineering', totalStudents: 190, totalFaculty: 15 }
];

export const MOCK_SUBJECTS = [
  { id: 'sub_cs303', code: 'CS303', name: 'Object Oriented Programming with Java', dept: 'CSE', semester: 5 },
  { id: 'sub_cs301', code: 'CS301', name: 'Advanced Data Structures & Algorithms', dept: 'CSE', semester: 5 },
  { id: 'sub_cs302', code: 'CS302', name: 'Database Management Systems (DBMS)', dept: 'CSE', semester: 4 },
  { id: 'sub_cs304', code: 'CS304', name: 'Web Technology & Cloud Computing', dept: 'CSE', semester: 6 }
];

export const MOCK_QUESTIONS = [
  {
    id: 'q1',
    subjectId: 'sub_cs303',
    topic: 'OOP Concepts',
    difficulty: 'EASY',
    text: 'Which OOP principle allows a subclass to provide a specific implementation of a method already defined in its parent class?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'Encapsulation',
      'Method Overriding (Polymorphism)',
      'Abstraction',
      'Multiple Inheritance'
    ],
    correctOptionIndex: 1,
    explanation: 'Method Overriding is a key aspect of runtime polymorphism where a subclass overrides a method declared in the parent class to provide custom behavior.'
  },
  {
    id: 'q2',
    subjectId: 'sub_cs303',
    topic: 'Collections & Data Structures',
    difficulty: 'MEDIUM',
    text: 'What is the average time complexity of searching for an element in a balanced Java HashMap?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'O(n)',
      'O(log n)',
      'O(1)',
      'O(n log n)'
    ],
    correctOptionIndex: 2,
    explanation: 'HashMap provides O(1) constant time complexity on average for get() and put() operations assuming uniform hash distribution.'
  },
  {
    id: 'q3',
    subjectId: 'sub_cs303',
    topic: 'Memory Management',
    difficulty: 'MEDIUM',
    text: 'Where are objects allocated in Java memory space?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'Stack Memory',
      'Heap Memory',
      'Native Method Stack',
      'Program Counter Register'
    ],
    correctOptionIndex: 1,
    explanation: 'In Java, all objects and instantiations are stored in the Heap memory space, while primitive local variables and method references reside in the Stack.'
  },
  {
    id: 'q4',
    subjectId: 'sub_cs301',
    topic: 'Binary Trees',
    difficulty: 'HARD',
    text: 'In a Binary Search Tree (BST), which traversal order yields elements in strictly sorted ascending order?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'Pre-order Traversal',
      'Post-order Traversal',
      'In-order Traversal',
      'Level-order Traversal'
    ],
    correctOptionIndex: 2,
    explanation: 'In-order traversal (Left -> Node -> Right) visits nodes in ascending order in any Binary Search Tree.'
  },
  {
    id: 'q5',
    subjectId: 'sub_cs302',
    topic: 'Relational Database & SQL',
    difficulty: 'MEDIUM',
    text: 'Which SQL keyword is used to eliminate duplicate rows from a query result set?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'UNIQUE',
      'DISTINCT',
      'GROUP BY',
      'FILTER'
    ],
    correctOptionIndex: 1,
    explanation: 'The SELECT DISTINCT statement is used to return only distinct (different) values.'
  },
  {
    id: 'q6',
    subjectId: 'sub_cs303',
    topic: 'Multithreading',
    difficulty: 'HARD',
    text: 'Which Java keyword prevents race conditions by locking a method or code block for a single thread execution?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'volatile',
      'transient',
      'synchronized',
      'static'
    ],
    correctOptionIndex: 2,
    explanation: 'The synchronized keyword guarantees thread safety by enforcing mutual exclusion (mutex) on shared resource access.'
  },
  {
    id: 'q7',
    subjectId: 'sub_cs303',
    topic: 'Exception Handling',
    difficulty: 'EASY',
    text: 'Which block in Java exception handling ALWAYS executes whether an exception occurs or not?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'catch block',
      'try block',
      'finally block',
      'throw block'
    ],
    correctOptionIndex: 2,
    explanation: 'The finally block contains cleanup code and executes regardless of whether an exception was thrown or caught.'
  },
  {
    id: 'q8',
    subjectId: 'sub_cs301',
    topic: 'Algorithm Analysis',
    difficulty: 'EASY',
    text: 'What is the worst-case time complexity of QuickSort algorithm?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'O(n log n)',
      'O(n²)',
      'O(n)',
      'O(2ⁿ)'
    ],
    correctOptionIndex: 1,
    explanation: 'QuickSort has a worst-case time complexity of O(n²) when the pivot chosen is consistently the smallest or largest element (e.g., already sorted array).'
  },
  {
    id: 'q9',
    subjectId: 'sub_cs303',
    topic: 'Interfaces & Abstraction',
    difficulty: 'MEDIUM',
    text: 'Since Java 8, can interfaces contain concrete methods with implementation?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      'No, interface methods must remain purely abstract',
      'Yes, using default or static keywords',
      'Yes, but only private methods',
      'No, only abstract classes allow method implementations'
    ],
    correctOptionIndex: 1,
    explanation: 'Java 8 introduced default and static methods in interfaces to allow backwards-compatible API extensions.'
  },
  {
    id: 'q10',
    subjectId: 'sub_cs303',
    topic: 'Spring Framework',
    difficulty: 'MEDIUM',
    text: 'Which Spring annotation is used to automatically inject dependencies into a bean component?',
    type: 'SINGLE_CHOICE',
    marks: 5,
    negativeMarks: 1.25,
    options: [
      '@Component',
      '@Autowired',
      '@Service',
      '@Bean'
    ],
    correctOptionIndex: 1,
    explanation: '@Autowired enables Spring Dependency Injection (DI) by resolving and injecting collaborating beans.'
  }
];

export const MOCK_EXAMS = [
  {
    id: 'ex_midterm_java',
    title: 'Mid-Term Model Exam: Java & Data Structures',
    subjectCode: 'CS303 / CS301',
    subjectName: 'Object Oriented Programming & Data Structures',
    department: 'CSE',
    batch: '3rd Year B.Tech CSE',
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 50,
    passPercentage: 50,
    negativeMarkingEnabled: true,
    negativeMarksPerWrong: 1.25,
    startTime: '2026-09-12T09:00:00',
    endTime: '2026-09-12T18:00:00',
    status: 'LIVE',
    createdByName: 'Dr. Anitha Sharma',
    instructions: [
      'The examination duration is 30 minutes. The countdown timer starts when you click "Start Examination".',
      'Each correct answer carries +5.0 marks.',
      'Negative marking is enabled: -1.25 marks will be deducted for every incorrect attempt.',
      'You can navigate between questions freely using the Question Palette or Next/Previous buttons.',
      'You can Bookmark questions to review them before final submission.',
      'Your answers are automatically saved in real-time. Click "Submit Examination" when finished.'
    ],
    questionIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']
  },
  {
    id: 'ex_dbms_quiz',
    title: 'Semester End Assessment: DBMS & SQL Queries',
    subjectCode: 'CS302',
    subjectName: 'Database Management Systems',
    department: 'CSE',
    batch: '2nd Year B.Tech CSE',
    durationMinutes: 45,
    totalQuestions: 8,
    totalMarks: 40,
    passPercentage: 40,
    negativeMarkingEnabled: false,
    startTime: '2026-09-15T10:00:00',
    endTime: '2026-09-15T12:00:00',
    status: 'SCHEDULED',
    createdByName: 'Dr. V. Meenakshi',
    instructions: [
      'Exam duration is 45 minutes.',
      'No negative marking for incorrect answers.',
      'Ensure a stable internet connection.'
    ],
    questionIds: ['q5', 'q2', 'q3', 'q7', 'q9']
  },
  {
    id: 'ex_completed_quiz',
    title: 'Unit Test I: Core Java Fundamentals',
    subjectCode: 'CS303',
    subjectName: 'Object Oriented Programming',
    department: 'CSE',
    batch: '3rd Year B.Tech CSE',
    durationMinutes: 20,
    totalQuestions: 5,
    totalMarks: 25,
    passPercentage: 50,
    negativeMarkingEnabled: false,
    startTime: '2026-09-01T10:00:00',
    endTime: '2026-09-01T11:00:00',
    status: 'COMPLETED',
    createdByName: 'Dr. Anitha Sharma',
    instructions: ['Unit test completed.'],
    questionIds: ['q1', 'q2', 'q3', 'q7', 'q9']
  }
];

export const MOCK_STUDENT_RESULTS = [
  {
    id: 'res_101',
    attemptId: 'att_completed_1',
    examId: 'ex_completed_quiz',
    examTitle: 'Unit Test I: Core Java Fundamentals',
    subjectCode: 'CS303',
    studentId: 'usr_student1',
    studentName: 'Rahul V. Sharma',
    rollNo: '21CSE104',
    totalMarks: 25,
    obtainedMarks: 20,
    percentage: 80,
    correctCount: 4,
    wrongCount: 1,
    unansweredCount: 0,
    accuracy: 80,
    rank: 4,
    status: 'PASS',
    submittedAt: '2026-09-01T10:18:42'
  }
];

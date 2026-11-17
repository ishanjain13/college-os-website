// Initial rich default state for College OS
export const INITIAL_USER_PROFILE = {
  name: "Alex",
  college: "Stanford University / MIT",
  course: "Computer Science & Artificial Intelligence",
  year: "Sophomore (Year 2)",
  avatar: "⚡",
  streak: 12,
  longestStreak: 21,
  totalXP: 3420,
  joinedDate: "2026-09-01",
  onboardingCompleted: true,
  bootSequenceEnabled: true,
  examModeEnabled: false,
  soundEnabled: true,
  soundVolume: 0.6
};

export const INITIAL_APPEARANCE = {
  theme: "dark", // 'dark' | 'light' | 'minimalist' | 'lofi' | 'anime' | 'cyber' | 'amoled' | 'study'
  wallpaper: "aurora", // 'aurora' | 'cyber_grid' | 'lofi_room' | 'deep_space' | 'matrix' | 'minimal_gradient' | 'custom'
  customWallpaperUrl: "",
  animatedBackground: true,
  accentColor: "#6366f1",
  font: "sans", // 'sans' | 'mono' | 'display'
  blurIntensity: "16px",
  cardTransparency: 0.78,
  uiDensity: "comfortable", // 'compact' | 'comfortable' | 'spacious'
  reducedMotion: false
};

export const INITIAL_WIDGETS = [
  { id: 'clock', title: 'Clock & Status', visible: true, x: 0, y: 0, w: 2, h: 1 },
  { id: 'streak_xp', title: 'XP & Level Progress', visible: true, x: 2, y: 0, w: 2, h: 1 },
  { id: 'daily_quest', title: 'Daily Quests & Boss', visible: true, x: 4, y: 0, w: 2, h: 2 },
  { id: 'today_classes', title: "Today's Schedule", visible: true, x: 0, y: 1, w: 2, h: 2 },
  { id: 'habit_rings', title: 'Habits Tracker', visible: true, x: 2, y: 1, w: 2, h: 2 },
  { id: 'upcoming_deadlines', title: 'Upcoming Deadlines', visible: true, x: 4, y: 2, w: 2, h: 2 },
  { id: 'quote_card', title: 'Motivation of the Day', visible: true, x: 0, y: 3, w: 2, h: 1 },
  { id: 'study_hours', title: 'Study Heatmap Summary', visible: true, x: 2, y: 3, w: 2, h: 1 },
  { id: 'fitness_summary', title: 'Fitness & Health', visible: true, x: 4, y: 4, w: 2, h: 1 },
  { id: 'breathing', title: 'Deep Reset / Breathing', visible: false, x: 0, y: 4, w: 2, h: 1 },
  { id: 'weather', title: 'Campus Weather HUD', visible: true, x: 2, y: 4, w: 2, h: 1 }
];

export const INITIAL_GOALS = [
  {
    id: 'g-1',
    name: "Master Neural Networks & PyTorch",
    description: "Build 5 complete deep learning projects from scratch and understand backpropagation math.",
    category: "Academic",
    priority: "high",
    startDate: "2026-09-15",
    deadline: "2026-12-20",
    status: "Active",
    currentValue: 3,
    targetValue: 5,
    unit: "projects",
    xpReward: 500,
    color: "#6366f1",
    milestones: [
      {
        id: 'm-1-1',
        title: "Mathematical Foundations & Matrix Calculus",
        completed: true,
        tasks: [
          { id: 't-1-1-1', title: "Read 3blue1brown neural networks series", completed: true },
          { id: 't-1-1-2', title: "Derive gradient descent & backprop by hand", completed: true }
        ]
      },
      {
        id: 'm-1-2',
        title: "Build CNN & Vision Classifier",
        completed: true,
        tasks: [
          { id: 't-1-2-1', title: "Implement Conv2d from scratch in Python", completed: true },
          { id: 't-1-2-2', title: "Train ResNet-18 on CIFAR-10 achieving 92%+ accuracy", completed: true }
        ]
      },
      {
        id: 'm-1-3',
        title: "Transformer & Attention Mechanism",
        completed: false,
        tasks: [
          { id: 't-1-3-1', title: "Build nanoGPT character level model", completed: true },
          { id: 't-1-3-2', title: "Fine-tune open weights Llama on custom student notes", completed: false }
        ]
      }
    ],
    reviews: [
      {
        date: "2026-09-30",
        type: "weekly",
        worked: "Consistent 2-hour morning coding blocks before lectures.",
        didntWork: "Late night debugging was inefficient.",
        nextWeekPriority: "Finish attention layers implementation."
      }
    ]
  },
  {
    id: 'g-2',
    name: "Land Summer 2027 FAANG / AI Research Internship",
    description: "Complete 150 LeetCode problems, polish portfolio, and network with 20 engineers.",
    category: "Career",
    priority: "high",
    startDate: "2026-09-01",
    deadline: "2026-11-30",
    status: "Active",
    currentValue: 64,
    targetValue: 150,
    unit: "problems",
    xpReward: 750,
    color: "#ec4899",
    milestones: [
      {
        id: 'm-2-1',
        title: "Resume & Portfolio Refresh",
        completed: true,
        tasks: [
          { id: 't-2-1-1', title: "Format ATS-friendly LaTeX resume", completed: true },
          { id: 't-2-1-2', title: "Deploy live College OS portfolio showcase", completed: true }
        ]
      },
      {
        id: 'm-2-2',
        title: "NeetCode 150 Data Structures Grind",
        completed: false,
        tasks: [
          { id: 't-2-2-1', title: "Arrays & Dynamic Programming patterns", completed: true },
          { id: 't-2-2-2', title: "Graphs, BFS/DFS and Union-Find", completed: false },
          { id: 't-2-2-3', title: "Mock technical interview with senior student", completed: false }
        ]
      }
    ],
    reviews: []
  },
  {
    id: 'g-3',
    name: "Bench 100kg & Run 10k Under 50min",
    description: "Progressive overload 4 days/week + Saturday zone 2 cardio runs.",
    category: "Fitness",
    priority: "medium",
    startDate: "2026-09-01",
    deadline: "2026-12-31",
    status: "Active",
    currentValue: 87.5,
    targetValue: 100,
    unit: "kg",
    xpReward: 400,
    color: "#10b981",
    milestones: [
      {
        id: 'm-3-1',
        title: "Hit 85kg 5x5 Clean Reps",
        completed: true,
        tasks: [
          { id: 't-3-1-1', title: "Refine leg drive and arch technique", completed: true }
        ]
      },
      {
        id: 'm-3-2',
        title: "Cross 95kg Threshold",
        completed: false,
        tasks: [
          { id: 't-3-2-1', title: "Log 160g protein daily without fail", completed: true },
          { id: 't-3-2-2', title: "Deload week before attempting 1RM", completed: false }
        ]
      }
    ],
    reviews: []
  }
];

export const INITIAL_HABITS = [
  {
    id: 'h-1',
    name: "Morning Deep Work (90 Min)",
    icon: "Brain",
    category: "Academic",
    type: "duration", // 'checkbox' | 'number' | 'duration' | 'yes/no'
    target: 90,
    unit: "mins",
    xp: 40,
    frequency: "daily", // 'daily' | 'weekdays' | 'weekends'
    color: "#6366f1",
    currentStreak: 12,
    longestStreak: 21,
    freezeDaysAvailable: 2,
    active: true,
    mandatory: true,
    completedDates: ["2026-10-06", "2026-10-05", "2026-10-04", "2026-10-03", "2026-10-02", "2026-10-01", "2026-09-30"]
  },
  {
    id: 'h-2',
    name: "Solve 1 LeetCode Problem",
    icon: "Code2",
    category: "Skills",
    type: "number",
    target: 1,
    unit: "problem",
    xp: 35,
    frequency: "daily",
    color: "#06b6d4",
    currentStreak: 9,
    longestStreak: 15,
    freezeDaysAvailable: 1,
    active: true,
    mandatory: true,
    completedDates: ["2026-10-06", "2026-10-05", "2026-10-04", "2026-10-03", "2026-10-02"]
  },
  {
    id: 'h-3',
    name: "Gym / Resistance Training",
    icon: "Dumbbell",
    category: "Fitness",
    type: "checkbox",
    target: 1,
    unit: "session",
    xp: 45,
    frequency: "weekdays",
    color: "#10b981",
    currentStreak: 4,
    longestStreak: 14,
    freezeDaysAvailable: 2,
    active: true,
    mandatory: false,
    completedDates: ["2026-10-06", "2026-10-05", "2026-10-03"]
  },
  {
    id: 'h-4',
    name: "Drink 3.5L Water",
    icon: "Droplets",
    category: "Health",
    type: "number",
    target: 3.5,
    unit: "L",
    xp: 25,
    frequency: "daily",
    color: "#38bdf8",
    currentStreak: 12,
    longestStreak: 25,
    freezeDaysAvailable: 3,
    active: true,
    mandatory: false,
    completedDates: ["2026-10-06", "2026-10-05", "2026-10-04", "2026-10-03", "2026-10-02", "2026-10-01"]
  },
  {
    id: 'h-5',
    name: "Nightly Review & Journaling",
    icon: "BookOpen",
    category: "Personal",
    type: "checkbox",
    target: 1,
    unit: "entry",
    xp: 30,
    frequency: "daily",
    color: "#a855f7",
    currentStreak: 7,
    longestStreak: 18,
    freezeDaysAvailable: 2,
    active: true,
    mandatory: false,
    completedDates: ["2026-10-06", "2026-10-05", "2026-10-04", "2026-10-03"]
  }
];

export const INITIAL_TIMETABLE = [
  { id: 'c-1', subject: "CS 229: Machine Learning", teacher: "Prof. Andrew", room: "Turing Hall 101", day: "Monday", startTime: "09:00", endTime: "10:30", color: "#6366f1" },
  { id: 'c-2', subject: "CS 161: Design & Analysis of Algorithms", teacher: "Dr. Tarjan", room: "Gates B03", day: "Monday", startTime: "11:00", endTime: "12:30", color: "#ec4899" },
  { id: 'c-3', subject: "EE 108: Digital Systems Architecture", teacher: "Prof. Horowitz", room: "Packard 204", day: "Monday", startTime: "14:00", endTime: "15:30", color: "#06b6d4" },
  
  { id: 'c-4', subject: "MATH 104: Linear Algebra & Matrix Analysis", teacher: "Prof. Strang", room: "Math 380", day: "Tuesday", startTime: "10:00", endTime: "11:30", color: "#10b981" },
  { id: 'c-5', subject: "CS 229: ML Discussion Lab", teacher: "TA Marcus", room: "Huang Lab 4", day: "Tuesday", startTime: "13:00", endTime: "14:30", color: "#6366f1" },
  
  { id: 'c-6', subject: "CS 229: Machine Learning", teacher: "Prof. Andrew", room: "Turing Hall 101", day: "Wednesday", startTime: "09:00", endTime: "10:30", color: "#6366f1" },
  { id: 'c-7', subject: "CS 161: Design & Analysis of Algorithms", teacher: "Dr. Tarjan", room: "Gates B03", day: "Wednesday", startTime: "11:00", endTime: "12:30", color: "#ec4899" },
  
  { id: 'c-8', subject: "MATH 104: Linear Algebra & Matrix Analysis", teacher: "Prof. Strang", room: "Math 380", day: "Thursday", startTime: "10:00", endTime: "11:30", color: "#10b981" },
  { id: 'c-9', subject: "EE 108: Digital Systems Architecture", teacher: "Prof. Horowitz", room: "Packard 204", day: "Thursday", startTime: "14:00", endTime: "15:30", color: "#06b6d4" },
  
  { id: 'c-10', subject: "CS 161: Algorithm Problem Workshop", teacher: "TA Elena", room: "Gates B12", day: "Friday", startTime: "10:00", endTime: "12:00", color: "#ec4899" }
];

export const INITIAL_ATTENDANCE = [
  { id: 'att-1', subject: "CS 229: Machine Learning", totalClasses: 24, attended: 22, minimumRequired: 75 },
  { id: 'att-2', subject: "CS 161: Design & Analysis of Algorithms", totalClasses: 22, attended: 20, minimumRequired: 75 },
  { id: 'att-3', subject: "EE 108: Digital Systems Architecture", totalClasses: 20, attended: 16, minimumRequired: 75 },
  { id: 'att-4', subject: "MATH 104: Linear Algebra", totalClasses: 18, attended: 17, minimumRequired: 75 }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    subject: "CS 229: Machine Learning",
    title: "Problem Set 2: Support Vector Machines & Kernel Ridge Regression",
    description: "Derive dual formulation and implement radial basis function SVM in NumPy.",
    deadline: "2026-10-10T23:59:00",
    priority: "high",
    status: "In progress",
    progress: 60,
    notes: "Part 1 & 2 done. Need to finish empirical hyperparameter grid search plot."
  },
  {
    id: 'asg-2',
    subject: "CS 161: Algorithms",
    title: "HW 4: Dynamic Programming & Matrix Chain Multiplication",
    description: "Write recurrence relation and analyze asymptotic runtime.",
    deadline: "2026-10-14T17:00:00",
    priority: "high",
    status: "Not started",
    progress: 0,
    notes: "Review lecture 8 notes on memoization before starting."
  },
  {
    id: 'asg-3',
    subject: "EE 108: Digital Systems",
    title: "Lab 3: Verilog RISC-V 5-Stage Pipelined Datapath",
    description: "Design hazard forwarding unit and pipeline stall logic.",
    deadline: "2026-10-18T23:59:00",
    priority: "medium",
    status: "Not started",
    progress: 0,
    notes: "Team lab with partner Dave."
  }
];

export const INITIAL_EXAMS = [
  {
    id: 'ex-1',
    subject: "CS 229: Machine Learning",
    title: "Midterm Examination",
    examDate: "2026-10-24T10:00:00",
    syllabus: "Convex optimization, Logistic Regression, GDA, Naive Bayes, SVMs, PCA, Kernels",
    preparationPercent: 55,
    priority: "high"
  },
  {
    id: 'ex-2',
    subject: "CS 161: Algorithms",
    title: "Midterm Exam 1",
    examDate: "2026-10-28T14:00:00",
    syllabus: "Divide & Conquer, Master Theorem, Heaps, QuickSort, Randomized Selection, DP",
    preparationPercent: 70,
    priority: "high"
  },
  {
    id: 'ex-3',
    subject: "MATH 104: Linear Algebra",
    title: "Midterm Exam",
    examDate: "2026-11-04T09:00:00",
    syllabus: "Vector Spaces, Orthogonality, Gram-Schmidt, Eigenvalues, SVD Decomposition",
    preparationPercent: 40,
    priority: "medium"
  }
];

export const INITIAL_SYLLABUS = [
  {
    id: 'syl-1',
    subject: "CS 229: Machine Learning",
    units: [
      {
        id: 'u-1',
        title: "Unit 1: Supervised Learning Foundations",
        topics: [
          { id: 'top-1-1', title: "Linear Regression & Normal Equations", completed: true },
          { id: 'top-1-2', title: "Gradient Descent (Batch & Stochastic)", completed: true },
          { id: 'top-1-3', title: "Logistic Regression & Newton-Raphson", completed: true },
          { id: 'top-1-4', title: "Generalized Linear Models (GLMs)", completed: true }
        ]
      },
      {
        id: 'u-2',
        title: "Unit 2: Generative Models & SVMs",
        topics: [
          { id: 'top-2-1', title: "Gaussian Discriminant Analysis", completed: true },
          { id: 'top-2-2', title: "Naive Bayes Classifier & Laplace Smoothing", completed: true },
          { id: 'top-2-3', title: "Optimal Margin Classifiers & Lagrange Duality", completed: true },
          { id: 'top-2-4', title: "Kernels & Mercer's Theorem", completed: false }
        ]
      },
      {
        id: 'u-3',
        title: "Unit 3: Deep Learning & Unsupervised Learning",
        topics: [
          { id: 'top-3-1', title: "Feedforward Neural Nets & Backprop", completed: false },
          { id: 'top-3-2', title: "K-Means Clustering & EM Algorithm", completed: false },
          { id: 'top-3-3', title: "Principal Component Analysis (PCA)", completed: false },
          { id: 'top-3-4', title: "Reinforcement Learning & MDPs", completed: false }
        ]
      }
    ]
  }
];

export const INITIAL_NOTES = [
  {
    id: 'n-1',
    title: "Mastering Dynamic Programming Patterns",
    subject: "CS 161",
    pinned: true,
    tags: ["Algorithms", "LeetCode", "Exams"],
    content: `# Dynamic Programming Core Framework\n\n1. **Identify State**: What variables define a subproblem? (e.g. \`dp[i][w]\`)\n2. **Formulate Recurrence**: How does \`dp[i]\` relate to \`dp[i-1]\` or earlier states?\n3. **Base Cases**: What happens at boundaries (0, empty string, etc.)?\n4. **Optimization**: Can we reduce space from $O(N^2)$ to $O(N)$ with rolling arrays?\n\n> Key patterns: 0/1 Knapsack, Longest Common Subsequence (LCS), Interval DP, Tree DP.`,
    updatedAt: "2026-10-06T14:30:00"
  },
  {
    id: 'n-2',
    title: "Eigenvalues & Singular Value Decomposition (SVD)",
    subject: "MATH 104",
    pinned: false,
    tags: ["Linear Algebra", "Machine Learning"],
    content: `# SVD Decomposition Summary\n\nAny matrix $A \\in \\mathbb{R}^{m \\times n}$ can be factored as:\n$$A = U \\Sigma V^T$$\n\n- $U$: $m \\times m$ orthogonal matrix (eigenvectors of $AA^T$)\n- $\\Sigma$: $m \\times n$ diagonal matrix with singular values $\\sigma_i = \\sqrt{\\lambda_i}$\n- $V$: $n \\times n$ orthogonal matrix (eigenvectors of $A^TA$)`,
    updatedAt: "2026-10-04T11:20:00"
  }
];

export const INITIAL_FLASHCARDS = [
  {
    id: 'fc-1',
    deck: "CS 229 Machine Learning",
    front: "What is the difference between Generative and Discriminative models?",
    back: "Discriminative models learn $P(Y|X)$ directly (e.g. Logistic Regression, SVM). Generative models learn $P(X|Y)$ and $P(Y)$ to model how data was generated (e.g. GDA, Naive Bayes).",
    difficulty: "medium",
    reviewCount: 4,
    lastReviewed: "2026-10-05",
    tags: ["ML", "Exam"]
  },
  {
    id: 'fc-2',
    deck: "Algorithms",
    front: "What is the Master Theorem formula for $T(n) = a T(n/b) + f(n)$?",
    back: "Compare $f(n)$ with $n^{\\log_b a}$:\n1. If $f(n) = O(n^{\\log_b a - \\epsilon})$, $T(n) = \\Theta(n^{\\log_b a})$.\n2. If $f(n) = \\Theta(n^{\\log_b a} \\log^k n)$, $T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n)$.\n3. If $f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ and regularity condition holds, $T(n) = \\Theta(f(n))$.",
    difficulty: "hard",
    reviewCount: 3,
    lastReviewed: "2026-10-04",
    tags: ["Algorithms", "Complexity"]
  }
];

export const INITIAL_EXPENSES = [
  { id: 'exp-1', title: "Monthly Textbooks & O'Reilly Subscription", amount: 48.00, category: "College", type: "expense", date: "2026-10-02" },
  { id: 'exp-2', title: "Campus Grocery & Meal Prep", amount: 62.50, category: "Food", type: "expense", date: "2026-10-04" },
  { id: 'exp-3', title: "Gym Protein & Creatine Tub", amount: 45.00, category: "Fitness", type: "expense", date: "2026-10-05" },
  { id: 'exp-4', title: "TA Teaching Stipend / Research Grant", amount: 650.00, category: "Other", type: "income", date: "2026-10-01" },
  { id: 'exp-5', title: "Coffee & Study Sessions", amount: 14.20, category: "Food", type: "expense", date: "2026-10-06" }
];

export const INITIAL_BUDGETS = {
  Food: 250,
  Hostel: 500,
  Travel: 60,
  College: 120,
  Shopping: 80,
  Entertainment: 60,
  Fitness: 70,
  Other: 100
};

export const INITIAL_SKILLS = [
  { id: 'sk-1', name: "Python & PyTorch", level: 4, xp: 2400, hours: 140, category: "Software & AI", notes: "Proficient in CNNs, Transformers and multiprocessing." },
  { id: 'sk-2', name: "C++ & Systems Programming", level: 3, xp: 1600, hours: 90, category: "Software & AI", notes: "Comfortable with pointers, STL, memory layout and concurrency." },
  { id: 'sk-3', name: "Data Structures & Algorithms", level: 4, xp: 2100, hours: 120, category: "Computer Science", notes: "120+ LeetCode problems solved across graphs, trees, DP." },
  { id: 'sk-4', name: "Full-Stack Web (React / TypeScript)", level: 3, xp: 1800, hours: 105, category: "Development", notes: "Built College OS, modern responsive PWAs." },
  { id: 'sk-5', name: "Public Speaking & Pitching", level: 2, xp: 750, hours: 35, category: "Soft Skills", notes: "Presented research paper at university symposium." }
];

export const INITIAL_PROJECTS = [
  {
    id: 'prj-1',
    name: "College OS",
    description: "A futuristic personal desktop operating system for ambitious college students built with React, Tailwind, and Web Audio.",
    technology: "React, Tailwind CSS, Framer Motion, Web Audio API, LocalStorage",
    github: "https://github.com/alex/college-os",
    demo: "https://college-os.app",
    status: "Completed",
    progress: 100,
    startDate: "2026-09-10",
    completionDate: "2026-10-07"
  },
  {
    id: 'prj-2',
    name: "Autonomous Drone Path Planner in ROS2",
    description: "Real-time 3D collision avoidance using octomap voxel grids and A* trajectory smoothing.",
    technology: "C++, ROS2, Gazebo, OpenCV, Eigen",
    github: "https://github.com/alex/ros2-drone-nav",
    demo: "",
    status: "In Progress",
    progress: 65,
    startDate: "2026-08-20",
    completionDate: ""
  }
];

export const INITIAL_INTERNSHIPS = [
  { id: 'int-1', company: "Anthropic / OpenAI", role: "AI Research Engineering Intern", appliedDate: "2026-09-20", status: "Interview", interviewDate: "2026-10-16", stipend: "$65/hr", notes: "Technical round 2 on PyTorch kernels and system architecture." },
  { id: 'int-2', company: "Google DeepMind", role: "Software Engineer Intern (Accelerators)", appliedDate: "2026-09-18", status: "Assessment", interviewDate: "", stipend: "$60/hr", notes: "Completed coding assessment (100% test cases)." },
  { id: 'int-3', company: "Palantir Technologies", role: "Forward Deployed Software Engineer", appliedDate: "2026-09-25", status: "Applied", interviewDate: "", stipend: "$55/hr", notes: "Referred by alumni." }
];

export const INITIAL_CODING_PRACTICE = [
  { id: 'cp-1', platform: "LeetCode", problem: "Course Schedule II", difficulty: "Medium", topic: "Topological Sort", date: "2026-10-06", solved: true, attempts: 1, notes: "Kahn's BFS algorithm with in-degree array." },
  { id: 'cp-2', platform: "LeetCode", problem: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", date: "2026-10-05", solved: true, attempts: 2, notes: "Bottom-up 1D DP table initialized to inf." },
  { id: 'cp-3', platform: "LeetCode", problem: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", date: "2026-10-03", solved: true, attempts: 3, notes: "Two pointers keeping track of left_max and right_max." },
  { id: 'cp-4', platform: "Codeforces", problem: "Tree Diameter", difficulty: "Medium", topic: "Tree DFS", date: "2026-10-01", solved: true, attempts: 1, notes: "Two BFS passes." }
];

export const INITIAL_REWARD_SHOP = [
  { id: 'rew-1', name: "Guilt-Free Movie Night + Popcorn", xpCost: 500, icon: "Film", description: "Enjoy a weekend cinema movie or Netflix binge with zero guilt.", unlocked: true },
  { id: 'rew-2', name: "Favorite Restaurant Cheat Meal", xpCost: 1000, icon: "Utensils", description: "Order your favorite sushi or gourmet burger dinner.", unlocked: true },
  { id: 'rew-3', name: "New Tech / Desk Accessory", xpCost: 2000, icon: "Headphones", description: "Upgrade keyboard, mousepad, or book collection.", unlocked: true },
  { id: 'rew-4', name: "Uninterrupted Weekend Gaming Session", xpCost: 1500, icon: "Gamepad2", description: "4 hours of pure gaming with squad after finishing weekly goals.", unlocked: true }
];

export const INITIAL_FUTURE_LETTERS = [
  {
    id: 'fl-1',
    title: "To Future Alex at the End of Sophomore Year",
    writeDate: "2026-09-15",
    unlockDate: "2027-06-01",
    currentStruggles: "Balancing hard CS 229 assignments with internship applications and gym consistency.",
    predictions: "I predict I will have secured a top internship and passed all midterms with GPA >= 3.85.",
    letter: "Dear Future Me,\n\nIf you are reading this, sophomore year is over. Remember how much grit it took during those October nights in the library? Did you stick to the plan? Did you lift consistently? I hope you are proud of how hard we fought.\n\nNever forget why we started.",
    unlocked: false
  }
];

export const INITIAL_VISION_ITEMS = [
  { id: 'vi-1', text: "Deliver Keynote on AI Systems", type: "goal", x: 20, y: 30, color: "#6366f1", emoji: "🎙️" },
  { id: 'vi-2', text: "Dream Home Workspace with triple OLED & plants", type: "affirmation", x: 260, y: 40, color: "#10b981", emoji: "🌿" },
  { id: 'vi-3', text: "Full Financial Freedom & High Agency", type: "affirmation", x: 50, y: 220, color: "#f59e0b", emoji: "🚀" },
  { id: 'vi-4', text: "Health is the multiplier for everything else", type: "quote", x: 300, y: 200, color: "#ec4899", emoji: "⚡" }
];

export const INITIAL_DAILY_QUESTS = [
  { id: 'dq-1', text: "Complete 3 Daily Habits", target: 3, current: 3, completed: true, xp: 100 },
  { id: 'dq-2', text: "Log 60+ minutes of focused Pomodoro study", target: 60, current: 75, completed: true, xp: 120 },
  { id: 'dq-3', text: "Solve 1 LeetCode or Algorithm problem", target: 1, current: 1, completed: true, xp: 80 }
];

export const INITIAL_WEEKLY_BOSS = {
  name: "Gorgon of Procrastination (Week 6)",
  subtitle: "Midterm Preparation & Momentum Gatekeeper",
  hpTotal: 100,
  hpCurrent: 35, // 65% defeated
  requirements: [
    { id: 'br-1', text: "Hit 80% Habit Completion this week", completed: true, weight: 25 },
    { id: 'br-2', text: "Log 8 Hours of Deep Work Study", completed: true, weight: 30 },
    { id: 'br-3', text: "Complete 4 Gym / Fitness Sessions", completed: false, weight: 20 },
    { id: 'br-4', text: "Finish CS 229 Problem Set 2 Milestone", completed: true, weight: 25 }
  ],
  bonusXP: 800
};

export interface InstituteBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface InstituteUpiDetails {
  upiId: string;
  qrCodeUrl?: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface Institute {
  id: string;
  name: string;
  code: string;
  directorName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  status: "Active" | "Inactive";
  createdAt: string;
  logoUrl?: string;
  gstNumber?: string;
  bankDetails?: InstituteBankDetails;
  upiDetails?: InstituteUpiDetails;
}

export type EmployeeRole = "Admin" | "Institute Admin" | "Teacher" | "Employee" | "Staff";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  role: EmployeeRole;
  instituteId: string; // Foreign key to Institute.id
  status: "Active" | "Inactive";
  specialization?: string;
  joinDate: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: string;
  fee: string;
  startDate: string;
  endDate: string;
  instituteId: string; // Foreign key to Institute.id
  teacherId?: string; // Foreign key to Employee.id
  status: "Active" | "Inactive";
}

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  city: string;
  state: string;
  instituteId: string; // Foreign key to Institute.id
  courseId: string; // Foreign key to Course.id
  enrollmentDate: string;
  status: "Active" | "Inactive";
  attendanceRate: number;
  averageScore: number;
  guardianName?: string;
  guardianPhone?: string;
  avatarUrl?: string;
}

export interface StudentPayment {
  id: string;
  studentId: string;
  courseId: string;
  instituteId: string;
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Paid" | "Pending" | "Failed";
  transactionId?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  notes?: string;
}

export const initialInstitutes: Institute[] = [
  {
    id: "inst-1",
    name: "Apex IIT-JEE Academy",
    code: "APEX-DEL",
    directorName: "Dr. Ramesh Verma",
    phone: "+91 98765 43210",
    email: "contact@apexacademy.edu",
    address: "Plot 42, Institutional Area, Sector 14",
    city: "New Delhi",
    state: "Delhi",
    status: "Active",
    createdAt: "2023-04-10",
    logoUrl:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80",
    gstNumber: "07AAAAA0000A1Z5",
    bankDetails: {
      bankName: "HDFC Bank Ltd",
      accountName: "Apex IIT-JEE Educational Foundation",
      accountNumber: "50200088991234",
      ifscCode: "HDFC0001234",
      branch: "Institutional Area Sector 14, New Delhi",
      isVerified: true,
      verifiedAt: "2024-01-15",
    },
    upiDetails: {
      upiId: "apexacademy@hdfcbank",
      isVerified: true,
      verifiedAt: "2024-01-15",
    },
  },
  {
    id: "inst-2",
    name: "Zenith Medical & NEET Prep",
    code: "ZEN-MUM",
    directorName: "Dr. Priya Nambiar",
    phone: "+91 98112 34567",
    email: "info@zenithmedical.org",
    address: "B-Wing, Mindspace Tech Park, Malad",
    city: "Mumbai",
    state: "Maharashtra",
    status: "Active",
    createdAt: "2023-06-15",
    logoUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    gstNumber: "27BBBBB1111B1Z2",
    bankDetails: {
      bankName: "ICICI Bank Ltd",
      accountName: "Zenith Healthcare & Medical Ed",
      accountNumber: "102938475612",
      ifscCode: "ICIC0000987",
      branch: "Mindspace Malad West, Mumbai",
      isVerified: true,
      verifiedAt: "2024-02-10",
    },
    upiDetails: {
      upiId: "zenithmedical@icici",
      isVerified: true,
      verifiedAt: "2024-02-10",
    },
  },
  {
    id: "inst-3",
    name: "Scholars Foundation & Boards",
    code: "SCH-BLR",
    directorName: "Prof. Rajesh Kulkarni",
    phone: "+91 99001 88223",
    email: "admissions@scholarsblr.in",
    address: "88 Outer Ring Road, HSR Layout",
    city: "Bengaluru",
    state: "Karnataka",
    status: "Active",
    createdAt: "2023-08-20",
    logoUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80",
    gstNumber: "29CCCCC2222C1Z8",
    bankDetails: {
      bankName: "State Bank of India",
      accountName: "Scholars Foundation Society",
      accountNumber: "389201928312",
      ifscCode: "SBIN0004521",
      branch: "HSR Layout Sector 2, Bengaluru",
      isVerified: false,
    },
    upiDetails: {
      upiId: "scholarsblr@sbi",
      isVerified: false,
    },
  },
];

export const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    fullName: "Dr. Ramesh Verma",
    email: "ramesh.verma@apexacademy.edu",
    phone: "+91 98765 43210",
    employeeId: "EMP-APEX-01",
    role: "Institute Admin",
    instituteId: "inst-1",
    status: "Active",
    specialization: "Academic Administration & Physics",
    joinDate: "2023-04-10",
  },
  {
    id: "emp-2",
    fullName: "Dr. Ananya Sen",
    email: "ananya.sen@apexacademy.edu",
    phone: "+91 98765 11223",
    employeeId: "EMP-APEX-02",
    role: "Teacher",
    instituteId: "inst-1",
    status: "Active",
    specialization: "Advanced Mechanics & Electrodynamics",
    joinDate: "2023-05-01",
  },
  {
    id: "emp-3",
    fullName: "Prof. Vikram Malhotra",
    email: "vikram.m@apexacademy.edu",
    phone: "+91 98765 33445",
    employeeId: "EMP-APEX-03",
    role: "Teacher",
    instituteId: "inst-1",
    status: "Active",
    specialization: "Calculus & Coordinate Geometry",
    joinDate: "2023-05-15",
  },
  {
    id: "emp-4",
    fullName: "Dr. Priya Nambiar",
    email: "priya.nambiar@zenithmedical.org",
    phone: "+91 98112 34567",
    employeeId: "EMP-ZEN-01",
    role: "Institute Admin",
    instituteId: "inst-2",
    status: "Active",
    specialization: "Human Physiology & Genetics",
    joinDate: "2023-06-15",
  },
  {
    id: "emp-5",
    fullName: "Dr. Aditi Singhania",
    email: "aditi.s@zenithmedical.org",
    phone: "+91 98112 77889",
    employeeId: "EMP-ZEN-02",
    role: "Teacher",
    instituteId: "inst-2",
    status: "Active",
    specialization: "Organic Chemistry & Biochemistry",
    joinDate: "2023-07-01",
  },
  {
    id: "emp-6",
    fullName: "Manoj Joshi",
    email: "manoj.j@scholarsblr.in",
    phone: "+91 99001 55443",
    employeeId: "EMP-SCH-01",
    role: "Staff",
    instituteId: "inst-3",
    status: "Active",
    specialization: "Examination Controller & Admissions",
    joinDate: "2023-08-25",
  },
  {
    id: "emp-7",
    fullName: "Prof. Rajesh Kulkarni",
    email: "rajesh.k@scholarsblr.in",
    phone: "+91 99001 88223",
    employeeId: "EMP-SCH-02",
    role: "Institute Admin",
    instituteId: "inst-3",
    status: "Active",
    specialization: "Foundation Mathematics & Science",
    joinDate: "2023-08-20",
  },
];

export const initialCourses: Course[] = [
  {
    id: "crs-1",
    name: "Class 12 Advanced Physics & Mechanics",
    code: "PHY-12-ADV",
    description:
      "Rigorous preparation for JEE Advanced physics including rotational dynamics, thermodynamics, and optics.",
    duration: "12 Months",
    fee: "₹45,000",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    instituteId: "inst-1",
    teacherId: "emp-2",
    status: "Active",
  },
  {
    id: "crs-2",
    name: "Class 11 IIT-JEE Mathematics Masterclass",
    code: "MATH-11-JEE",
    description:
      "Deep-dive into algebra, trigonometry, vectors and foundation calculus for competitive engineering entrance.",
    duration: "12 Months",
    fee: "₹42,000",
    startDate: "2024-05-01",
    endDate: "2025-04-30",
    instituteId: "inst-1",
    teacherId: "emp-3",
    status: "Active",
  },
  {
    id: "crs-3",
    name: "NEET Comprehensive Biology & Genetics",
    code: "BIO-NEET-PRE",
    description:
      "Extensive NCERT line-by-line coverage, diagram mastery, and chapter-wise mock tests for NEET aspirants.",
    duration: "10 Months",
    fee: "₹38,000",
    startDate: "2024-06-01",
    endDate: "2025-03-15",
    instituteId: "inst-2",
    teacherId: "emp-5",
    status: "Active",
  },
  {
    id: "crs-4",
    name: "Class 10 Foundation Science & Mathematics",
    code: "FND-10-SCI",
    description:
      "Board exam preparation with Olympiad enrichment, conceptual clarity and hands-on problem sessions.",
    duration: "9 Months",
    fee: "₹28,000",
    startDate: "2024-07-01",
    endDate: "2025-02-28",
    instituteId: "inst-3",
    teacherId: "emp-7",
    status: "Active",
  },
];

export const initialStudents: Student[] = [
  {
    id: "stu-1",
    fullName: "Rahul Kumar",
    studentId: "STU-2024-001",
    email: "rahul.kumar@gmail.com",
    phone: "+91 98711 00223",
    dob: "2007-03-14",
    gender: "Male",
    address: "44 Model Town, Phase 2",
    city: "New Delhi",
    state: "Delhi",
    instituteId: "inst-1",
    courseId: "crs-1",
    enrollmentDate: "2024-04-05",
    status: "Active",
    attendanceRate: 96,
    averageScore: 92,
  },
  {
    id: "stu-2",
    fullName: "Aarav Sharma",
    studentId: "STU-2024-002",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98711 33445",
    dob: "2007-08-22",
    gender: "Male",
    address: "12 Mayur Vihar, Pocket 1",
    city: "New Delhi",
    state: "Delhi",
    instituteId: "inst-1",
    courseId: "crs-2",
    enrollmentDate: "2024-05-02",
    status: "Active",
    attendanceRate: 98,
    averageScore: 94,
  },
  {
    id: "stu-3",
    fullName: "Ishita Sen",
    studentId: "STU-2024-003",
    email: "ishita.sen@gmail.com",
    phone: "+91 98200 44556",
    dob: "2007-11-05",
    gender: "Female",
    address: "702 Sea View Apartments, Bandra",
    city: "Mumbai",
    state: "Maharashtra",
    instituteId: "inst-2",
    courseId: "crs-3",
    enrollmentDate: "2024-06-03",
    status: "Active",
    attendanceRate: 94,
    averageScore: 89,
  },
  {
    id: "stu-4",
    fullName: "Rohan Verma",
    studentId: "STU-2024-004",
    email: "rohan.verma@gmail.com",
    phone: "+91 99011 77665",
    dob: "2008-01-19",
    gender: "Male",
    address: "33 Koramangala 4th Block",
    city: "Bengaluru",
    state: "Karnataka",
    instituteId: "inst-3",
    courseId: "crs-4",
    enrollmentDate: "2024-07-05",
    status: "Active",
    attendanceRate: 91,
    averageScore: 84,
  },
  {
    id: "stu-5",
    fullName: "Priya Patel",
    studentId: "STU-2024-005",
    email: "priya.patel@gmail.com",
    phone: "+91 98711 88990",
    dob: "2007-05-30",
    gender: "Female",
    address: "88 Rohini Sector 9",
    city: "New Delhi",
    state: "Delhi",
    instituteId: "inst-1",
    courseId: "crs-1",
    enrollmentDate: "2024-04-10",
    status: "Active",
    attendanceRate: 95,
    averageScore: 90,
  },
  {
    id: "stu-6",
    fullName: "Aditya Joshi",
    studentId: "STU-2024-006",
    email: "aditya.joshi@gmail.com",
    phone: "+91 98200 11223",
    dob: "2007-09-12",
    gender: "Male",
    address: "15 Andheri East, MIDC Road",
    city: "Mumbai",
    state: "Maharashtra",
    instituteId: "inst-2",
    courseId: "crs-3",
    enrollmentDate: "2024-06-10",
    status: "Inactive",
    attendanceRate: 78,
    averageScore: 72,
  },
];

export const initialStudentPayments: StudentPayment[] = [
  {
    id: "pay-1",
    studentId: "stu-1", // Rahul Kumar
    courseId: "crs-1",
    instituteId: "inst-1",
    title: "Class 12 Physics - Term 1 Admission & Tuition",
    amount: 22500,
    dueDate: "2024-04-10",
    paidDate: "2024-04-05",
    status: "Paid",
    transactionId: "TXN-APEX-9823101",
    paymentMethod: "UPI (apexacademy@hdfcbank)",
    receiptNumber: "REC-APEX-2024-001",
    notes: "Online UPI payment received and verified.",
  },
  {
    id: "pay-2",
    studentId: "stu-1", // Rahul Kumar
    courseId: "crs-1",
    instituteId: "inst-1",
    title: "Class 12 Physics - Term 2 Examination & Lab Fee",
    amount: 22500,
    dueDate: "2024-10-15",
    status: "Pending",
    notes: "Due before the second semester commencement.",
  },
  {
    id: "pay-3",
    studentId: "stu-2", // Aarav Sharma
    courseId: "crs-2",
    instituteId: "inst-1",
    title: "Class 11 JEE Maths - Full Academic Year Fee",
    amount: 42000,
    dueDate: "2024-05-10",
    paidDate: "2024-05-02",
    status: "Paid",
    transactionId: "TXN-APEX-8761244",
    paymentMethod: "Net Banking (SBI)",
    receiptNumber: "REC-APEX-2024-002",
    notes: "One-time full payment discount applied.",
  },
  {
    id: "pay-4",
    studentId: "stu-3", // Ishita Sen
    courseId: "crs-3",
    instituteId: "inst-2",
    title: "NEET Comprehensive Biology - Installment 1",
    amount: 19000,
    dueDate: "2024-06-10",
    paidDate: "2024-06-03",
    status: "Paid",
    transactionId: "TXN-ZEN-5544211",
    paymentMethod: "UPI (zenithmedical@icici)",
    receiptNumber: "REC-ZEN-2024-089",
    notes: "Initial installment processed successfully.",
  },
  {
    id: "pay-5",
    studentId: "stu-3", // Ishita Sen
    courseId: "crs-3",
    instituteId: "inst-2",
    title: "NEET Comprehensive Biology - Installment 2",
    amount: 19000,
    dueDate: "2024-11-01",
    status: "Pending",
    notes: "Second installment due in November.",
  },
  {
    id: "pay-6",
    studentId: "stu-4", // Rohan Verma
    courseId: "crs-4",
    instituteId: "inst-3",
    title: "Class 10 Foundation Science - Term 1 Fee",
    amount: 14000,
    dueDate: "2024-07-15",
    status: "Failed",
    transactionId: "TXN-FL-330192",
    paymentMethod: "Debit Card",
    notes: "Bank network timeout during authorization. Retry available.",
  },
];

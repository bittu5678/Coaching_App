import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type Institute,
  type Employee,
  type Course,
  type Student,
  type StudentPayment,
  initialInstitutes,
  initialEmployees,
  initialCourses,
  initialStudents,
  initialStudentPayments,
} from "./managementData";

interface ManagementContextType {
  institutes: Institute[];
  employees: Employee[];
  courses: Course[];
  students: Student[];
  payments: StudentPayment[];
  currentInstituteId: string | null;
  setCurrentInstituteId: (id: string | null) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  // Institute CRUD & Profile
  addInstitute: (inst: Omit<Institute, "id" | "createdAt">) => Institute;
  updateInstitute: (id: string, inst: Partial<Institute>) => void;
  deleteInstitute: (id: string) => void;
  toggleInstituteStatus: (id: string) => void;
  verifyInstitutePayout: (
    instituteId: string,
    enteredOtp: string,
  ) => { success: boolean; message: string };
  // Employee CRUD
  addEmployee: (emp: Omit<Employee, "id">) => Employee;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;
  // Course CRUD
  addCourse: (crs: Omit<Course, "id">) => Course;
  updateCourse: (id: string, crs: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;
  // Student CRUD & Profile
  addStudent: (stu: Omit<Student, "id">) => Student;
  updateStudent: (id: string, stu: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleStudentStatus: (id: string) => void;
  // Payments
  addPayment: (payment: Omit<StudentPayment, "id">) => StudentPayment;
  updatePayment: (id: string, payment: Partial<StudentPayment>) => void;
  processStudentPayment: (
    paymentId: string,
    method: string,
    enteredOtp: string,
  ) => { success: boolean; message: string; receiptNumber?: string };
  simulateFailedPayment: (paymentId: string, reason?: string) => void;
  // Helpers
  getInstitute: (id: string) => Institute | undefined;
  getCourse: (id: string) => Course | undefined;
  getEmployee: (id: string) => Employee | undefined;
  getStudent: (id: string) => Student | undefined;
  getCoursesByInstitute: (instituteId: string) => Course[];
  getEmployeesByInstitute: (instituteId: string) => Employee[];
  getStudentsByInstitute: (instituteId: string) => Student[];
  getStudentsByCourse: (courseId: string) => Student[];
  getPaymentsByStudent: (studentId: string) => StudentPayment[];
  getPaymentsByInstitute: (instituteId: string) => StudentPayment[];
}

const ManagementContext = createContext<ManagementContextType | null>(null);

export function ManagementProvider({ children }: { children: React.ReactNode }) {
  const [institutes, setInstitutes] = useState<Institute[]>(() => {
    try {
      const stored = window.localStorage.getItem("coachingapp-institutes");
      return stored ? JSON.parse(stored) : initialInstitutes;
    } catch {
      return initialInstitutes;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = window.localStorage.getItem("coachingapp-employees");
      return stored ? JSON.parse(stored) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const stored = window.localStorage.getItem("coachingapp-courses");
      return stored ? JSON.parse(stored) : initialCourses;
    } catch {
      return initialCourses;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = window.localStorage.getItem("coachingapp-students");
      return stored ? JSON.parse(stored) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [payments, setPayments] = useState<StudentPayment[]>(() => {
    try {
      const stored = window.localStorage.getItem("coachingapp-payments");
      return stored ? JSON.parse(stored) : initialStudentPayments;
    } catch {
      return initialStudentPayments;
    }
  });

  const [currentInstituteId, setCurrentInstituteId] = useState<string | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<string>("stu-1");

  useEffect(() => {
    try {
      window.localStorage.setItem("coachingapp-institutes", JSON.stringify(institutes));
    } catch (e) {
      console.warn("Could not persist institutes", e);
    }
  }, [institutes]);

  useEffect(() => {
    try {
      window.localStorage.setItem("coachingapp-employees", JSON.stringify(employees));
    } catch (e) {
      console.warn("Could not persist employees", e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      window.localStorage.setItem("coachingapp-courses", JSON.stringify(courses));
    } catch (e) {
      console.warn("Could not persist courses", e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      window.localStorage.setItem("coachingapp-students", JSON.stringify(students));
    } catch (e) {
      console.warn("Could not persist students", e);
    }
  }, [students]);

  useEffect(() => {
    try {
      window.localStorage.setItem("coachingapp-payments", JSON.stringify(payments));
    } catch (e) {
      console.warn("Could not persist payments", e);
    }
  }, [payments]);

  // Institute Actions
  const addInstitute = (inst: Omit<Institute, "id" | "createdAt">): Institute => {
    const newInst: Institute = {
      ...inst,
      id: `inst-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setInstitutes((prev) => [newInst, ...prev]);
    return newInst;
  };

  const updateInstitute = (id: string, updated: Partial<Institute>) => {
    setInstitutes((prev) => prev.map((inst) => (inst.id === id ? { ...inst, ...updated } : inst)));
  };

  const deleteInstitute = (id: string) => {
    setInstitutes((prev) => prev.filter((inst) => inst.id !== id));
  };

  const toggleInstituteStatus = (id: string) => {
    setInstitutes((prev) =>
      prev.map((inst) =>
        inst.id === id
          ? { ...inst, status: inst.status === "Active" ? "Inactive" : "Active" }
          : inst,
      ),
    );
  };

  const verifyInstitutePayout = (
    instituteId: string,
    enteredOtp: string,
  ): { success: boolean; message: string } => {
    // Demo OTP is 123456
    const cleanOtp = enteredOtp.trim();
    if (cleanOtp !== "123456" && cleanOtp !== "000000") {
      return {
        success: false,
        message:
          "Invalid OTP code. Please enter the demo code 123456 to verify settlement credentials.",
      };
    }

    const today = new Date().toISOString().split("T")[0];
    setInstitutes((prev) =>
      prev.map((inst) => {
        if (inst.id === instituteId) {
          return {
            ...inst,
            bankDetails: inst.bankDetails
              ? { ...inst.bankDetails, isVerified: true, verifiedAt: today }
              : undefined,
            upiDetails: inst.upiDetails
              ? { ...inst.upiDetails, isVerified: true, verifiedAt: today }
              : undefined,
          };
        }
        return inst;
      }),
    );

    return {
      success: true,
      message: "Institute bank and UPI settlement payout details successfully verified with OTP.",
    };
  };

  // Employee Actions
  const addEmployee = (emp: Omit<Employee, "id">): Employee => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    return newEmp;
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" } : emp,
      ),
    );
  };

  // Course Actions
  const addCourse = (crs: Omit<Course, "id">): Course => {
    const newCrs: Course = {
      ...crs,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [newCrs, ...prev]);
    return newCrs;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) => prev.map((crs) => (crs.id === id ? { ...crs, ...updated } : crs)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((crs) => crs.id !== id));
  };

  const toggleCourseStatus = (id: string) => {
    setCourses((prev) =>
      prev.map((crs) =>
        crs.id === id ? { ...crs, status: crs.status === "Active" ? "Inactive" : "Active" } : crs,
      ),
    );
  };

  // Student Actions
  const addStudent = (stu: Omit<Student, "id">): Student => {
    const newStu: Student = {
      ...stu,
      id: `stu-${Date.now()}`,
    };
    setStudents((prev) => [newStu, ...prev]);
    return newStu;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => prev.map((stu) => (stu.id === id ? { ...stu, ...updated } : stu)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
  };

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === id ? { ...stu, status: stu.status === "Active" ? "Inactive" : "Active" } : stu,
      ),
    );
  };

  // Payment Actions
  const addPayment = (payment: Omit<StudentPayment, "id">): StudentPayment => {
    const newPayment: StudentPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const updatePayment = (id: string, updated: Partial<StudentPayment>) => {
    setPayments((prev) => prev.map((pay) => (pay.id === id ? { ...pay, ...updated } : pay)));
  };

  const processStudentPayment = (
    paymentId: string,
    method: string,
    enteredOtp: string,
  ): { success: boolean; message: string; receiptNumber?: string } => {
    const cleanOtp = enteredOtp.trim();
    if (cleanOtp !== "123456" && cleanOtp !== "000000") {
      return {
        success: false,
        message: "Invalid OTP code. For demo simulation, please enter 123456.",
      };
    }

    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionId = `TXN-DEMO-${Date.now().toString().slice(-8)}`;
    const today = new Date().toISOString().split("T")[0];

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "Paid",
              paidDate: today,
              paymentMethod: method,
              transactionId,
              receiptNumber,
              notes: "Payment verified via OTP authentication.",
            }
          : p,
      ),
    );

    return {
      success: true,
      message: "Payment successfully verified and completed.",
      receiptNumber,
    };
  };

  const simulateFailedPayment = (
    paymentId: string,
    reason = "Transaction declined by issuing bank during authentication.",
  ) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "Failed",
              transactionId: `TXN-FL-${Date.now().toString().slice(-6)}`,
              notes: reason,
            }
          : p,
      ),
    );
  };

  // Helpers
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const getInstitute = (id: string) => institutes.find((i) => i.id === id);
  const getCourse = (id: string) => courses.find((c) => c.id === id);
  const getEmployee = (id: string) => employees.find((e) => e.id === id);
  const getStudent = (id: string) => students.find((s) => s.id === id);

  const getCoursesByInstitute = (instituteId: string) =>
    courses.filter((c) => c.instituteId === instituteId);

  const getEmployeesByInstitute = (instituteId: string) =>
    employees.filter((e) => e.instituteId === instituteId);

  const getStudentsByInstitute = (instituteId: string) =>
    students.filter((s) => s.instituteId === instituteId);

  const getStudentsByCourse = (courseId: string) => students.filter((s) => s.courseId === courseId);

  const getPaymentsByStudent = (studentId: string) =>
    payments.filter((p) => p.studentId === studentId);

  const getPaymentsByInstitute = (instituteId: string) =>
    payments.filter((p) => p.instituteId === instituteId);

  return (
    <ManagementContext.Provider
      value={{
        institutes,
        employees,
        courses,
        students,
        payments,
        currentInstituteId,
        setCurrentInstituteId,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        addInstitute,
        updateInstitute,
        deleteInstitute,
        toggleInstituteStatus,
        verifyInstitutePayout,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        addPayment,
        updatePayment,
        processStudentPayment,
        simulateFailedPayment,
        getInstitute,
        getCourse,
        getEmployee,
        getStudent,
        getCoursesByInstitute,
        getEmployeesByInstitute,
        getStudentsByInstitute,
        getStudentsByCourse,
        getPaymentsByStudent,
        getPaymentsByInstitute,
      }}
    >
      {children}
    </ManagementContext.Provider>
  );
}

export function useManagement() {
  const context = useContext(ManagementContext);
  if (!context) {
    throw new Error("useManagement must be used within a ManagementProvider");
  }
  return context;
}

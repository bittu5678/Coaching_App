import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
  IndianRupee,
  Building2,
  Calendar,
  Lock,
  KeyRound,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  X,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type StudentPayment } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StudentPaymentsView() {
  const {
    currentStudent,
    courses,
    institutes,
    getPaymentsByStudent,
    processStudentPayment,
    simulateFailedPayment,
  } = useManagement();

  const studentPayments = currentStudent ? getPaymentsByStudent(currentStudent.id) : [];

  const enrolledCourse = courses.find((c) => c.id === currentStudent?.courseId) || courses[0];
  const institute = institutes.find((i) => i.id === enrolledCourse?.instituteId);

  // Totals
  const totalAmount = studentPayments.reduce((acc, p) => acc + p.amount, 0);
  const paidAmount = studentPayments
    .filter((p) => p.status === "Paid")
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = studentPayments
    .filter((p) => p.status === "Pending")
    .reduce((acc, p) => acc + p.amount, 0);

  // Next pending payment
  const nextPending = studentPayments.find((p) => p.status === "Pending");

  // Checkout & OTP Modal
  const [selectedPayment, setSelectedPayment] = useState<StudentPayment | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Net Banking" | "Debit Card">("UPI");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Receipt Modal
  const [receiptPayment, setReceiptPayment] = useState<StudentPayment | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Open Checkout
  const handleOpenPay = (payment: StudentPayment) => {
    setSelectedPayment(payment);
    setEnteredOtp("");
    setOtpError(null);
    setCheckoutModalOpen(true);
  };

  // Open Receipt
  const handleOpenReceipt = (payment: StudentPayment) => {
    setReceiptPayment(payment);
    setReceiptModalOpen(true);
  };

  // Handle Verify Payment OTP
  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsProcessing(true);
    setOtpError(null);

    setTimeout(() => {
      setIsProcessing(false);
      const res = processStudentPayment(selectedPayment.id, paymentMethod, enteredOtp);

      if (res.success) {
        setCheckoutModalOpen(false);
        // Automatically open receipt
        const updated = {
          ...selectedPayment,
          status: "Paid" as const,
          paidDate: new Date().toISOString().split("T")[0],
          paymentMethod,
          transactionId: `TXN-DEMO-${Date.now().toString().slice(-8)}`,
          receiptNumber: res.receiptNumber,
        };
        setReceiptPayment(updated);
        setReceiptModalOpen(true);
      } else {
        setOtpError(res.message);
      }
    }, 700);
  };

  // Simulate Failure
  const handleSimulateFail = () => {
    if (!selectedPayment) return;
    simulateFailedPayment(selectedPayment.id);
    setCheckoutModalOpen(false);
  };

  return (
    <div className="animate-rise space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Fee & Payment Management
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          View tuition schedule, download tax invoices, and complete pending fee installments
          securely.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Course Fee</span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Enrolled Course: {enrolledCourse?.name || "Academic Program"}
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Fee Paid</span>
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            ₹{paidAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Cleared & verified against institute records
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pending Balance</span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock3 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {nextPending ? `Due by ${nextPending.dueDate}` : "All installments cleared"}
          </div>
        </div>
      </div>

      {/* Next Due Fee Callout */}
      {nextPending && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[11px] font-bold">
                Upcoming Installment
              </span>
              <span className="text-xs text-muted-foreground">Due on: {nextPending.dueDate}</span>
            </div>
            <h3 className="text-base font-bold text-foreground">{nextPending.title}</h3>
            <p className="text-xs text-muted-foreground">
              Payable to: <strong className="text-foreground">{institute?.name}</strong> · Amount:{" "}
              <strong className="text-foreground text-sm">
                ₹{nextPending.amount.toLocaleString("en-IN")}
              </strong>
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleOpenPay(nextPending)}
            className="btn-gradient h-10 px-5 text-xs font-bold rounded-xl shadow-brand shrink-0"
          >
            Pay Now with OTP <ArrowRight className="size-3.5 ml-1.5" />
          </Button>
        </div>
      )}

      {/* Payment Records Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/80">
        <div className="p-4 sm:p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground">Tuition Fee Ledger & Invoices</h3>
            <p className="text-xs text-muted-foreground">
              Official records of your tuition milestones, payment receipts, and settlement status.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Student:{" "}
            <strong className="text-foreground">{currentStudent?.fullName || "Rahul Kumar"}</strong>{" "}
            ({currentStudent?.studentId || "STU-2024-001"})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border/60">
              <tr>
                <th className="px-4 py-3">Fee Installment / Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Transaction Info</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {studentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No payment records available.
                  </td>
                </tr>
              ) : (
                studentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-foreground">{payment.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {payment.notes || "Standard curriculum enrollment"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold font-mono text-foreground">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {payment.paidDate ? (
                        <span>
                          Paid on: <strong className="text-foreground">{payment.paidDate}</strong>
                        </span>
                      ) : (
                        <span>Due: {payment.dueDate}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {payment.status === "Paid" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 font-semibold text-[11px]">
                          <CheckCircle2 className="size-3" /> Paid
                        </span>
                      )}
                      {payment.status === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 font-semibold text-[11px]">
                          <Clock3 className="size-3" /> Pending
                        </span>
                      )}
                      {payment.status === "Failed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 text-destructive px-2.5 py-0.5 font-semibold text-[11px]">
                          <AlertCircle className="size-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {payment.transactionId ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] text-foreground font-semibold block">
                            {payment.transactionId}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {payment.paymentMethod || "Online Transfer"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">
                          Pending settlement
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {payment.status === "Paid" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReceipt(payment)}
                          className="h-8 rounded-lg text-xs font-semibold gap-1.5"
                        >
                          <FileText className="size-3.5" /> View Receipt
                        </Button>
                      )}
                      {payment.status === "Pending" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleOpenPay(payment)}
                          className="btn-gradient h-8 rounded-lg text-xs font-bold px-3 shadow-brand"
                        >
                          Pay Now
                        </Button>
                      )}
                      {payment.status === "Failed" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleOpenPay(payment)}
                          className="h-8 rounded-lg bg-destructive hover:bg-destructive/90 text-white text-xs font-bold px-3"
                        >
                          <RotateCw className="size-3 mr-1" /> Retry Payment
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Checkout & OTP Verification Modal */}
      {checkoutModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-border/80 animate-rise bg-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Secure Student Fee Payment</h3>
                  <span className="text-[10px] text-muted-foreground">
                    OTP Payment Verification
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyPayment} className="space-y-4 pt-4">
              {/* Order summary */}
              <div className="rounded-xl bg-muted/40 p-4 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-bold text-foreground">{enrolledCourse?.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Installment</span>
                  <span className="font-medium text-foreground">{selectedPayment.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Receiving Campus</span>
                  <span className="font-medium text-foreground">{institute?.name}</span>
                </div>
                <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                  <span className="font-bold text-foreground text-xs">Total Payable Amount</span>
                  <span className="font-bold text-base text-primary font-mono">
                    ₹{selectedPayment.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-[11px] text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Sparkles className="size-3.5 text-blue-500" /> Demo Payment Gateway Simulation
                </div>
                This checkout simulates an RBI/NPCI-compliant gateway flow. No actual money will be
                charged.
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={cn(
                      "p-3 rounded-xl border text-center text-xs transition-all",
                      paymentMethod === "UPI"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <QrCode className="size-4 mx-auto mb-1" />
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Net Banking")}
                    className={cn(
                      "p-3 rounded-xl border text-center text-xs transition-all",
                      paymentMethod === "Net Banking"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <Building2 className="size-4 mx-auto mb-1" />
                    Net Banking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Debit Card")}
                    className={cn(
                      "p-3 rounded-xl border text-center text-xs transition-all",
                      paymentMethod === "Debit Card"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <CreditCard className="size-4 mx-auto mb-1" />
                    Debit Card
                  </button>
                </div>
              </div>

              {/* OTP Payment Verification Step */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    OTP Payment Verification Code
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Enter the 6-digit payment confirmation OTP sent to your registered phone number (
                  <strong className="text-foreground">
                    {currentStudent?.phone || "+91 98711 00223"}
                  </strong>
                  ).
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <Sparkles className="size-3" /> Demo Simulation OTP: <strong>123456</strong>
                </div>

                <div>
                  <Input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    autoFocus
                    className="rounded-xl text-center text-lg font-mono tracking-[0.5em] h-11 bg-card"
                  />
                  {otpError && (
                    <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="size-3.5" /> {otpError}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSimulateFail}
                  className="text-xs text-muted-foreground hover:text-destructive h-9 px-2"
                >
                  Simulate Failed Payment
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="h-9 rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing || enteredOtp.length < 6}
                    className="btn-gradient h-9 rounded-xl text-xs font-bold px-5 shadow-brand"
                  >
                    {isProcessing ? "Verifying..." : "Verify & Authorize Fee"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Tax Invoice / Receipt Modal */}
      {receiptModalOpen && receiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-border/80 animate-rise bg-card max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:p-0">
            {/* Top Close / Actions bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60 print:hidden">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="size-4" /> Official Tuition Receipt
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-8 rounded-lg text-xs gap-1.5"
                >
                  <Printer className="size-3.5" /> Print / PDF
                </Button>
                <button
                  type="button"
                  onClick={() => setReceiptModalOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="pt-4 space-y-5">
              {/* Institute Branding Header */}
              <div className="text-center space-y-1 pb-4 border-b border-border/60">
                <h3 className="text-lg font-bold text-foreground">
                  {institute?.name || "Apex IIT-JEE Academy"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {institute?.address}, {institute?.city}, {institute?.state}
                </p>
                <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground font-mono">
                  <span>GSTIN: {institute?.gstNumber || "07AAAAA0000A1Z5"}</span>
                  <span>·</span>
                  <span>Reg: {institute?.code || "APEX-DEL"}</span>
                </div>
              </div>

              {/* Receipt & Student Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Receipt Number
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {receiptPayment.receiptNumber || "REC-2024-001"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Payment Date
                  </span>
                  <span className="font-medium text-foreground">
                    {receiptPayment.paidDate || new Date().toISOString().split("T")[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Student Name
                  </span>
                  <span className="font-bold text-foreground">
                    {currentStudent?.fullName || "Rahul Kumar"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Student ID
                  </span>
                  <span className="font-mono text-foreground">
                    {currentStudent?.studentId || "STU-2024-001"}
                  </span>
                </div>
              </div>

              {/* Line item */}
              <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                <div className="bg-muted/40 p-2.5 font-semibold flex justify-between text-muted-foreground text-[11px]">
                  <span>Item Description</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-foreground">{receiptPayment.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Course: {enrolledCourse?.name}
                    </div>
                  </div>
                  <div className="font-bold font-mono text-foreground text-sm">
                    ₹{receiptPayment.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-primary/5 p-3 flex justify-between items-center border-t border-border/60">
                  <span className="font-bold text-foreground">Total Fee Received</span>
                  <span className="font-bold font-mono text-primary text-base">
                    ₹{receiptPayment.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Transaction Proof */}
              <div className="text-xs space-y-1 bg-muted/20 p-3 rounded-xl text-muted-foreground">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-foreground font-semibold">
                    {receiptPayment.transactionId || "TXN-DEMO-9823101"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="text-foreground">{receiptPayment.paymentMethod || "UPI"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> OTP Authenticated
                  </span>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="text-center pt-2">
                <span className="text-[10px] text-muted-foreground block">
                  This is a computer-generated tax invoice verified electronically through
                  CoachingApp.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

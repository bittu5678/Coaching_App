import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  Save,
  KeyRound,
  AlertTriangle,
  ExternalLink,
  Upload,
  Lock,
  X,
  Sparkles,
} from "lucide-react";
import { useManagement } from "@/lib/ManagementContext";
import { type Institute } from "@/lib/managementData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InstituteProfileView({
  selectedInstituteId,
}: {
  selectedInstituteId?: string | null;
}) {
  const { institutes, updateInstitute, verifyInstitutePayout } = useManagement();

  // Pick institute: selectedInstituteId or first institute
  const currentInst = institutes.find((i) => i.id === selectedInstituteId) || institutes[0];

  const [activeTab, setActiveTab] = useState<"general" | "legal_bank" | "upi">("general");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: currentInst?.name || "",
    code: currentInst?.code || "",
    directorName: currentInst?.directorName || "",
    phone: currentInst?.phone || "",
    email: currentInst?.email || "",
    address: currentInst?.address || "",
    city: currentInst?.city || "",
    state: currentInst?.state || "",
    logoUrl: currentInst?.logoUrl || "",
    gstNumber: currentInst?.gstNumber || "",
    // Bank
    bankName: currentInst?.bankDetails?.bankName || "",
    accountName: currentInst?.bankDetails?.accountName || "",
    accountNumber: currentInst?.bankDetails?.accountNumber || "",
    ifscCode: currentInst?.bankDetails?.ifscCode || "",
    branch: currentInst?.bankDetails?.branch || "",
    // UPI
    upiId: currentInst?.upiDetails?.upiId || "",
  });

  // OTP Verification Modal State
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!currentInst) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        No institute selected or available.
      </div>
    );
  }

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitute(currentInst.id, {
      name: formData.name,
      code: formData.code,
      directorName: formData.directorName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      logoUrl: formData.logoUrl,
    });
    setSuccessMessage("Institute general profile updated successfully.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSavePaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitute(currentInst.id, {
      gstNumber: formData.gstNumber,
      bankDetails: {
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        branch: formData.branch,
        isVerified: currentInst.bankDetails?.isVerified || false,
      },
      upiDetails: {
        upiId: formData.upiId,
        isVerified: currentInst.upiDetails?.isVerified || false,
      },
    });
    setSuccessMessage(
      "Bank, GST and UPI details updated. Please verify with OTP to activate fee settlements.",
    );
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenOtpModal = () => {
    setEnteredOtp("");
    setOtpError(null);
    setOtpModalOpen(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError(null);

    setTimeout(() => {
      setIsVerifying(false);
      const res = verifyInstitutePayout(currentInst.id, enteredOtp);
      if (res.success) {
        setOtpModalOpen(false);
        setSuccessMessage(res.message);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setOtpError(res.message);
      }
    }, 600);
  };

  const isBankVerified = currentInst.bankDetails?.isVerified;
  const isUpiVerified = currentInst.upiDetails?.isVerified;

  return (
    <div className="animate-rise space-y-6">
      {/* Header Banner */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-7 border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-16 sm:size-20 rounded-2xl bg-white p-2 shadow-md ring-1 ring-border/50 shrink-0 flex items-center justify-center overflow-hidden">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt={formData.name}
                  className="size-full object-cover rounded-xl"
                />
              ) : (
                <Building2 className="size-8 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary flex items-center gap-1">
                  <Building2 className="size-3" /> {formData.code || currentInst.code}
                </span>
                {isBankVerified && isUpiVerified ? (
                  <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Payout Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                    <AlertTriangle className="size-3" /> OTP Verification Pending
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {formData.name || currentInst.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Director: <strong className="text-foreground">{formData.directorName}</strong> ·{" "}
                {formData.city}, {formData.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              onClick={handleOpenOtpModal}
              className={cn(
                "h-10 rounded-xl px-4 text-xs font-semibold shadow-xs flex items-center gap-2",
                isBankVerified
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white animate-pulse",
              )}
            >
              <KeyRound className="size-4" />
              {isBankVerified ? "Re-verify Settlement OTP" : "Verify Payout with OTP"}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-rise">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-border/80 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={cn(
            "pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px",
            activeTab === "general"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <Building2 className="size-4" /> Institute Profile & Branding
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("legal_bank")}
          className={cn(
            "pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px",
            activeTab === "legal_bank"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <CreditCard className="size-4" /> Bank Account & GST Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upi")}
          className={cn(
            "pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px",
            activeTab === "upi"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <QrCode className="size-4" /> UPI Collection Settings
        </button>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="glass-card p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-base font-bold text-foreground">Institute Identity & Contact</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update brand logo, registered legal name, director contact, and campus address.
              </p>
            </div>
            <Button
              type="submit"
              className="btn-gradient inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
            >
              <Save className="size-3.5" /> Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Institute Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="e.g., Apex IIT-JEE Academy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Institute Code / ID *
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="rounded-xl text-xs h-10 font-mono"
                placeholder="e.g., APEX-DEL"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Owner / Director Name *
              </label>
              <Input
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="e.g., Dr. Ramesh Verma"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Institute Logo URL
              </label>
              <Input
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="rounded-xl text-xs h-10"
                placeholder="https://... (direct image link)"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Official Mobile Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="rounded-xl text-xs h-10 font-mono"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Official Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="contact@apexacademy.edu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Campus / Institute Address *
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="Plot 42, Institutional Area, Sector 14"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">City *</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="New Delhi"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">State *</label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="Delhi"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Bank & GST Details */}
      {activeTab === "legal_bank" && (
        <form onSubmit={handleSavePaymentDetails} className="glass-card p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Receiving Bank & GST Info</h3>
                {isBankVerified ? (
                  <span className="rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                    Verified for Payouts
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5">
                    Unverified
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bank account used for receiving student course fee collections directly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleOpenOtpModal}
                variant="outline"
                className="h-9 rounded-xl px-3 text-xs font-semibold gap-1.5"
              >
                <KeyRound className="size-3.5" /> OTP Verify
              </Button>
              <Button
                type="submit"
                className="btn-gradient inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
              >
                <Save className="size-3.5" /> Save Details
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                GSTIN / GST Registration Number
              </label>
              <Input
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })
                }
                className="rounded-xl text-xs h-10 font-mono tracking-wider"
                placeholder="e.g., 07AAAAA0000A1Z5"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Appears on official GST fee tax invoices issued to students.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Bank Name *
              </label>
              <Input
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="e.g., HDFC Bank Ltd"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Beneficiary / Account Holder Name *
              </label>
              <Input
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
                className="rounded-xl text-xs h-10"
                placeholder="Apex Educational Foundation"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Account Number *
              </label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
                className="rounded-xl text-xs h-10 font-mono"
                placeholder="50200088991234"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                IFSC Code *
              </label>
              <Input
                value={formData.ifscCode}
                onChange={(e) =>
                  setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                }
                required
                className="rounded-xl text-xs h-10 font-mono"
                placeholder="HDFC0001234"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Branch Location
              </label>
              <Input
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="rounded-xl text-xs h-10"
                placeholder="Sector 14, New Delhi"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: UPI Collection Details */}
      {activeTab === "upi" && (
        <form onSubmit={handleSavePaymentDetails} className="glass-card p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  UPI Payment Receiving Settings
                </h3>
                {isUpiVerified ? (
                  <span className="rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                    UPI Active
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5">
                    Verification Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enable instant UPI fee collection via Google Pay, PhonePe, and Paytm.
              </p>
            </div>
            <Button
              type="submit"
              className="btn-gradient inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold shadow-brand"
            >
              <Save className="size-3.5" /> Save UPI ID
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Institute Merchant UPI ID *
                </label>
                <Input
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  required
                  className="rounded-xl text-xs h-10 font-mono"
                  placeholder="e.g., apexacademy@hdfcbank"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Students can pay through dynamic UPI intent or QR scan using this address.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Instant Settlement Protection
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Incoming fees are cleared directly to your verified bank account. Verification
                  requires director OTP authentication.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenOtpModal}
                  className="h-8 text-xs font-medium rounded-lg mt-2"
                >
                  Verify UPI with OTP
                </Button>
              </div>
            </div>

            {/* UPI QR Mock Box */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/80 shadow-xs text-center">
              <div className="size-40 bg-white p-3 rounded-2xl shadow-inner border border-border/40 flex flex-col items-center justify-center">
                <QrCode className="size-28 text-slate-800" />
                <span className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                  BHIM UPI QR
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-foreground mt-3">
                {formData.upiId || "institute@bank"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Accepted: Google Pay · PhonePe · Paytm · CRED
              </span>
            </div>
          </div>
        </form>
      )}

      {/* OTP Payment / Payout Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-border/80 animate-rise bg-card">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">OTP Payout Verification</h3>
                  <span className="text-[10px] text-muted-foreground">Security Authorization</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
              <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs space-y-1">
                <span className="font-bold text-primary block">Verification Code Sent</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  A 6-digit confirmation code was dispatched to director mobile:{" "}
                  <strong className="text-foreground">{formData.phone || currentInst.phone}</strong>
                  .
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <Sparkles className="size-3" /> Demo OTP: <strong>123456</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Enter 6-Digit OTP *
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  autoFocus
                  className="rounded-xl text-center text-lg font-mono tracking-[0.5em] h-12"
                />
                {otpError && (
                  <p className="text-xs text-destructive font-medium mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="size-3.5" /> {otpError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOtpModalOpen(false)}
                  className="h-9 rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying || enteredOtp.length < 6}
                  className="btn-gradient h-9 rounded-xl text-xs font-bold px-5 shadow-brand"
                >
                  {isVerifying ? "Verifying..." : "Confirm & Verify Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

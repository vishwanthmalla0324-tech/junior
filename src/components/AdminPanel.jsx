import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  Building2, 
  UserCheck, 
  Clock, 
  IndianRupee, 
  Sparkles,
  Search,
  Check,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPanel({ applications, workers, jobs, employers, onApprove, onReject }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('All government documents verified. Background check clear.');
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending', 'all', 'approved', 'rejected'

  // Filter pending verification applications (paid ₹499 waiting for admin action)
  const pendingApps = applications.filter(a => a.status === 'paid_pending_admin');
  const approvedApps = applications.filter(a => a.status === 'verified_unlocked');
  const rejectedApps = applications.filter(a => a.status === 'rejected_refunded');

  const displayedApps = applications.filter(app => {
    if (filterStatus === 'pending') return app.status === 'paid_pending_admin';
    if (filterStatus === 'approved') return app.status === 'verified_unlocked';
    if (filterStatus === 'rejected') return app.status === 'rejected_refunded';
    return true;
  });

  const handleApproveAction = (appId) => {
    onApprove(appId, adminNotes);
    setSelectedApp(null);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    onReject(selectedApp.id, rejectReason || 'Document information mismatch or candidate unavailable.');
    setRejectReasonModal(false);
    setSelectedApp(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Admin Panel Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 amber-glow">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Admin Verification Console
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                  Step 5 & 6 Controls
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Review ₹499 verification payment requests, audit worker identity proofs & trade credentials. Once approved, contact phone numbers and exact workplace map routes unlock automatically for both parties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center flex-1 md:flex-none">
              <span className="text-[11px] text-slate-400 block font-medium">Pending Verifications</span>
              <span className="text-xl font-extrabold text-amber-400">{pendingApps.length}</span>
            </div>
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center flex-1 md:flex-none">
              <span className="text-[11px] text-slate-400 block font-medium">Verified & Unlocked</span>
              <span className="text-xl font-extrabold text-emerald-400">{approvedApps.length}</span>
            </div>
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center flex-1 md:flex-none">
              <span className="text-[11px] text-slate-400 block font-medium">₹499 Escrow Volume</span>
              <span className="text-xl font-extrabold text-sky-400">₹{(applications.filter(a => a.verificationFeePaid).length * 499).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingApps.length})</span>
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approved & Unlocked ({approvedApps.length})</span>
          </button>

          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Refunded ({rejectedApps.length})</span>
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Applications Verification Queue */}
      {displayedApps.length === 0 ? (
        <div className="bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Applications in this Queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Switch to Employer Mode to pay a ₹499 verification fee for an applicant to test the Admin Verification Queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayedApps.map((app) => {
            const worker = workers.find(w => w.id === app.workerId);
            const job = jobs.find(j => j.id === app.jobId);
            const employer = employers.find(e => e.id === job?.employerId);

            if (!worker || !job) return null;

            return (
              <div
                key={app.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 space-y-4 transition-all ${
                  app.status === 'paid_pending_admin'
                    ? 'border-amber-500/60 shadow-lg shadow-amber-500/10 shimmer-bg'
                    : app.status === 'verified_unlocked'
                    ? 'border-emerald-500/40 bg-slate-900/70'
                    : 'border-slate-800 opacity-80'
                }`}
              >
                {/* Application Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-400 font-mono">App #{app.id}</span>
                      {app.status === 'paid_pending_admin' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" /> Pending Admin Review
                        </span>
                      )}
                      {app.status === 'verified_unlocked' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Verified & Unlocked
                        </span>
                      )}
                      {app.status === 'rejected_refunded' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected & Refunded
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{job.title}</h3>
                    <p className="text-xs text-sky-400 font-medium">Employer: {employer?.name}</p>
                  </div>

                  {app.paymentDetails && (
                    <div className="text-right bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Verification Fee</span>
                      <span className="text-sm font-extrabold text-amber-400">₹{app.paymentDetails.amount} Paid</span>
                    </div>
                  )}
                </div>

                {/* Worker Profile Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{worker.name}</h4>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        ★ {worker.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{worker.tradeTitleEn}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Experience: <strong className="text-slate-200">{worker.experienceYears} Years</strong> | Wage: <strong className="text-slate-200">₹{worker.expectedPay}/{worker.payType}</strong>
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Government ID & Background Documents Preview */}
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/60 pb-1.5">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <FileText className="w-4 h-4" /> Identity & Document Verification Proof
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Doc Ref: {worker.idDocNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block">ID Document Type:</span>
                      <span className="font-semibold text-slate-200">{worker.idProofType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Residential City:</span>
                      <span className="font-semibold text-slate-200">{worker.location}</span>
                    </div>
                  </div>

                  {/* ID Proof Thumbnail */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 h-28 group">
                    <img
                      src={worker.idDocImage}
                      alt="ID Proof Document"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                        <Award className="w-3 h-3" /> Official Government ID Verified Seal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Audit Checklist */}
                <div className="space-y-1.5 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Admin Verification Audit Checklist:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Government Aadhaar Match
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> ITI / Trade License Check
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Police Background Clean
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Contact Phone Active
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                {app.status === 'paid_pending_admin' && (
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleApproveAction(app.id)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve Verification (Unlock Contact)</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setRejectReasonModal(true);
                      }}
                      className="py-3 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/40 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Refund ₹499</span>
                    </button>
                  </div>
                )}

                {app.status === 'verified_unlocked' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Verification Approved on {new Date(app.adminVerification?.verifiedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <span className="font-bold text-emerald-400">Phone & Location Unlocked</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectReasonModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Reject Verification & Issue Refund</h3>
            </div>
            <p className="text-xs text-slate-300">
              Rejecting this verification will return the ₹499 fee back to the employer's original payment method and notify the applicant.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Document photo unclear, trade license expired, or worker unavailable."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectReasonModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Confirm Rejection & Refund ₹499
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

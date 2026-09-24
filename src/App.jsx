import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmployerView from './components/EmployerView';
import WorkerView from './components/WorkerView';
import AdminPanel from './components/AdminPanel';
import PaymentModal from './components/PaymentModal';
import DemoGuideModal from './components/DemoGuideModal';
import AuthModal from './components/AuthModal';
import { 
  INITIAL_JOBS, 
  INITIAL_WORKERS, 
  INITIAL_EMPLOYERS, 
  INITIAL_APPLICATIONS 
} from './data/mockData';
import { 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  User, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function App() {
  // Persistence via localStorage
  const [currentPersona, setCurrentPersona] = useState(() => {
    return localStorage.getItem('jc_persona') || 'employer';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('jc_lang') || 'en';
  });

  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('jc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jc_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('jc_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [employers, setEmployers] = useState(() => {
    const saved = localStorage.getItem('jc_employers');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYERS;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('jc_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [selectedEmployerId, setSelectedEmployerId] = useState('emp-1');
  const [selectedWorkerId, setSelectedWorkerId] = useState('wrk-1');

  // Modals state
  const [paymentModalApp, setPaymentModalApp] = useState(null); // { application, worker, job }
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jc_persona', currentPersona);
  }, [currentPersona]);

  useEffect(() => {
    localStorage.setItem('jc_lang', language);
  }, [language]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('jc_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('jc_user');
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('jc_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jc_applications', JSON.stringify(applications));
  }, [applications]);

  const showNotification = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handlers
  const handlePostJob = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
    showNotification(`Job "${newJob.title}" posted successfully!`);
  };

  const handleApplyJob = (jobId, workerId, pitchNote) => {
    const newApp = {
      id: 'app-' + Date.now(),
      jobId,
      workerId,
      appliedDate: new Date().toISOString(),
      status: 'applied', // Step 2-3
      verificationFeePaid: false,
      paymentDetails: null,
      adminVerification: { status: 'none' },
      pitchNote
    };

    setApplications(prev => [newApp, ...prev]);
    showNotification('Application submitted to employer! Employer will review profile and pay ₹499 verification fee.');
  };

  const handleInitiatePayment = (app, worker, job) => {
    setPaymentModalApp({ app, worker, job });
  };

  const handlePaymentSuccess = (appId, paymentDetails) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'paid_pending_admin', // Step 4 complete, waiting for Step 5
          verificationFeePaid: true,
          paymentDetails
        };
      }
      return app;
    }));

    setPaymentModalApp(null);
    showNotification('₹499 Paid! Application moved to Admin Verification Console. Switch to Admin Panel to verify worker ID & unlock contacts.');
  };

  const handleApproveAdmin = (appId, adminNotes) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'verified_unlocked', // Step 6 & 7 Complete!
          adminVerification: {
            verifiedAt: new Date().toISOString(),
            adminId: 'admin-01',
            status: 'approved',
            verifierNotes: adminNotes
          }
        };
      }
      return app;
    }));

    showNotification('Worker Verification Approved! Private phone numbers & exact Google Maps workplace route unlocked for both parties.', 'emerald');
  };

  const handleRejectAdmin = (appId, reason) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'rejected_refunded',
          adminVerification: {
            verifiedAt: new Date().toISOString(),
            adminId: 'admin-01',
            status: 'rejected',
            verifierNotes: reason
          }
        };
      }
      return app;
    }));

    showNotification('Verification Rejected. ₹499 fee refunded to employer source account.', 'rose');
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setJobs(INITIAL_JOBS);
    setWorkers(INITIAL_WORKERS);
    setEmployers(INITIAL_EMPLOYERS);
    setApplications(INITIAL_APPLICATIONS);
    setAuthUser(null);
    showNotification('Platform demo seed data reset successfully!');
  };

  const pendingAdminCount = applications.filter(a => a.status === 'paid_pending_admin').length;
  const verifiedHiresCount = applications.filter(a => a.status === 'verified_unlocked').length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header Bar */}
      <Header
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        language={language}
        setLanguage={setLanguage}
        pendingAdminCount={pendingAdminCount}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
        totalJobsCount={jobs.length}
        verifiedHiresCount={verifiedHiresCount}
        user={authUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-md">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
            toastMessage.type === 'emerald'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : toastMessage.type === 'rose'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200'
              : 'bg-sky-950/90 border-sky-500 text-sky-200'
          }`}>
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">{toastMessage.msg}</p>
          </div>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Persona Banner Indicator */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Current Active Workspace:</span>
            {currentPersona === 'employer' && (
              <span className="font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <Building2 className="w-3.5 h-3.5" /> Employer Management Mode
              </span>
            )}
            {currentPersona === 'worker' && (
              <span className="font-extrabold text-sky-400 flex items-center gap-1 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                <User className="w-3.5 h-3.5" /> Blue-Collar Worker Job Search Mode
              </span>
            )}
            {currentPersona === 'admin' && (
              <span className="font-extrabold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <ShieldAlert className="w-3.5 h-3.5" /> Platform Admin Verification Console
              </span>
            )}
          </div>

          <button
            onClick={() => setShowDemoGuide(true)}
            className="text-amber-400 hover:underline font-bold text-xs flex items-center gap-1 hidden sm:flex cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> View 7-Step Lifecycle Guide
          </button>
        </div>

        {/* View Component Rendering */}
        {currentPersona === 'employer' && (
          <EmployerView
            employers={employers}
            selectedEmployerId={selectedEmployerId}
            setSelectedEmployerId={setSelectedEmployerId}
            jobs={jobs}
            workers={workers}
            applications={applications}
            onPostJob={handlePostJob}
            onInitiatePayment={handleInitiatePayment}
          />
        )}

        {currentPersona === 'worker' && (
          <WorkerView
            workers={workers}
            selectedWorkerId={selectedWorkerId}
            setSelectedWorkerId={setSelectedWorkerId}
            jobs={jobs}
            employers={employers}
            applications={applications}
            onApplyJob={handleApplyJob}
          />
        )}

        {currentPersona === 'admin' && (
          <AdminPanel
            applications={applications}
            workers={workers}
            jobs={jobs}
            employers={employers}
            onApprove={handleApproveAdmin}
            onReject={handleRejectAdmin}
          />
        )}
      </main>

      {/* ₹499 Payment Gateway Modal */}
      {paymentModalApp && (
        <PaymentModal
          application={paymentModalApp.app}
          worker={paymentModalApp.worker}
          job={paymentModalApp.job}
          onClose={() => setPaymentModalApp(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Firebase Auth Modal */}
      {showAuthModal && (
        <AuthModal
          user={authUser}
          setUser={setAuthUser}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(usr) => showNotification(`Welcome, ${usr.displayName}! Signed in with Google via Firebase.`)}
        />
      )}

      {/* 7-Step Demo Guide Walkthrough Modal */}
      {showDemoGuide && (
        <DemoGuideModal
          onClose={() => setShowDemoGuide(false)}
          onJumpPersona={(persona) => setCurrentPersona(persona)}
          onResetDemoData={handleResetDemoData}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          JobConnect – Verified Blue-Collar Recruitment Platform
        </p>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
          Directly connecting employers with verified electricians, welders, drivers, cooks, security guards & factory workers with ₹499 verification payment escrow & admin verification gate.
        </p>
      </footer>
    </div>
  );
}



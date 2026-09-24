import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  IndianRupee, 
  ArrowRight,
  User,
  Building2,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export default function DemoGuideModal({ onClose, onJumpPersona, onResetDemoData }) {
  const steps = [
    {
      num: 1,
      title: 'Employer Posts a Job',
      desc: 'Employers create job postings with trade category, daily wage / monthly salary, shift timing, vacancies, and workplace address.',
      persona: 'employer',
      badge: 'Step 1'
    },
    {
      num: 2,
      title: 'Worker Finds & Applies',
      desc: 'Workers browse jobs by trade (Electrician, Welder, Driver, Cook), view pay details, and submit quick job applications.',
      persona: 'worker',
      badge: 'Step 2'
    },
    {
      num: 3,
      title: 'Employer Reviews Applications',
      desc: 'Employers review worker profiles, experience, skills, and ratings. Worker phone and address are strictly MASKED & LOCKED.',
      persona: 'employer',
      badge: 'Step 3'
    },
    {
      num: 4,
      title: '₹499 Verification Payment',
      desc: 'When employer wants to proceed, employer pays ₹499 fee. Payment is held in verification escrow while pending Admin Audit.',
      persona: 'employer',
      badge: 'Step 4'
    },
    {
      num: 5,
      title: 'Admin Verification Panel',
      desc: 'Admin inspects worker Aadhaar ID proof, trade ITI certificate, and background check checklist in the Admin Console.',
      persona: 'admin',
      badge: 'Step 5'
    },
    {
      num: 6,
      title: 'Payment & Verification Status',
      desc: 'Admin approves (Status -> Successful) or rejects with reason (Status -> Refunded back to employer).',
      persona: 'admin',
      badge: 'Step 6'
    },
    {
      num: 7,
      title: 'Contact & GPS Route Unlocked!',
      desc: 'Upon approval: Employer gets worker direct phone + WhatsApp chat. Worker gets employer verified workplace location + Google Maps route!',
      persona: 'worker',
      badge: 'Step 7'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                JobConnect 7-Step Workflow Guide
              </h3>
              <p className="text-xs text-slate-400">Complete verification & contact unlock lifecycle</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Steps List */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-start gap-4 hover:border-slate-700 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-400 font-black text-sm flex items-center justify-center shrink-0">
                {step.num}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {step.title}
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {step.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  onJumpPersona(step.persona);
                  onClose();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Try Mode</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Shortcuts Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetDemoData();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-sky-600/25 cursor-pointer"
          >
            Close Guide & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

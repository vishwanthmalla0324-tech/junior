import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Lock, 
  Unlock, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Star, 
  Sparkles,
  ChevronRight,
  Send,
  Navigation
} from 'lucide-react';
import { TRADE_CATEGORIES } from '../data/mockData';
import InteractiveMap from './InteractiveMap';

export default function EmployerView({ 
  employers, 
  selectedEmployerId, 
  setSelectedEmployerId, 
  jobs, 
  workers, 
  applications, 
  onPostJob, 
  onInitiatePayment 
}) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState('all');

  // Form State for New Job
  const [jobTitle, setJobTitle] = useState('');
  const [tradeCategory, setTradeCategory] = useState('electrician');
  const [salary, setSalary] = useState(850);
  const [salaryType, setSalaryType] = useState('daily');
  const [vacancies, setVacancies] = useState(2);
  const [location, setLocation] = useState('Peenya Industrial Area, Phase II, Bengaluru');
  const [shift, setShift] = useState('Day Shift (8:30 AM - 5:30 PM)');
  const [requirements, setRequirements] = useState('Minimum 2 years factory experience required.');
  const [description, setDescription] = useState('Hiring skilled workers for factory unit operations.');

  const currentEmployer = employers.find(e => e.id === selectedEmployerId) || employers[0];

  // Filter jobs posted by this employer
  const myJobs = jobs.filter(j => j.employerId === currentEmployer.id);

  // Filter applications received for my jobs
  const myApplications = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    if (job?.employerId !== currentEmployer.id) return false;
    if (selectedJobIdFilter !== 'all' && app.jobId !== selectedJobIdFilter) return false;
    return true;
  });

  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      id: 'job-' + Date.now(),
      employerId: currentEmployer.id,
      title: jobTitle,
      tradeCategory,
      salary: Number(salary),
      salaryType,
      vacancies: Number(vacancies),
      location,
      coordinates: currentEmployer.coordinates || { lat: 13.0324, lng: 77.5218 },
      shift,
      workingHours: salaryType === 'daily' ? '8 Hours' : '9 Hours',
      requirements,
      description,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open',
      benefits: ['PF & ESIC Covered', 'Overtime Bonus']
    };

    onPostJob(newJob);
    setShowPostModal(false);
    // Reset form
    setJobTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Employer Selector & Action Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <img
            src={currentEmployer.logo}
            alt={currentEmployer.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Active Employer:</label>
              <select
                value={selectedEmployerId}
                onChange={(e) => setSelectedEmployerId(e.target.value)}
                className="bg-slate-950 text-sky-400 font-extrabold text-sm border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500"
              >
                {employers.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {currentEmployer.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPostModal(true)}
            className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Job</span>
          </button>
        </div>
      </div>

      {/* Posted Jobs Horizontal Bar */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-sky-400" /> Active Job Postings ({myJobs.length})
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Applicants by Job:</span>
            <select
              value={selectedJobIdFilter}
              onChange={(e) => setSelectedJobIdFilter(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs border border-slate-700 rounded-lg px-2 py-1"
            >
              <option value="all">All Jobs ({myJobs.length})</option>
              {myJobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {myJobs.map(job => {
            const jobApps = applications.filter(a => a.jobId === job.id);
            const verifiedApps = jobApps.filter(a => a.status === 'verified_unlocked');

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobIdFilter(job.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedJobIdFilter === job.id
                    ? 'bg-slate-800/90 border-sky-500 shadow-md'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{job.title}</h4>
                  <span className="text-xs font-extrabold text-amber-400">
                    ₹{job.salary}/{job.salaryType === 'daily' ? 'day' : 'mo'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Vacancies: <strong>{job.vacancies}</strong></span>
                  <span className="text-sky-400 font-semibold">{jobApps.length} Applicants</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applications Received Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Applications Received for Your Openings ({myApplications.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click <strong>"Pay ₹499 Verification Fee"</strong> to request admin verification & unlock contact info.
          </span>
        </div>

        {myApplications.length === 0 ? (
          <div className="bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No applications received yet for this job</h4>
            <p className="text-xs text-slate-500">Switch to <strong>Worker View</strong> and click "Apply Now" to test applying for jobs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {myApplications.map((app) => {
              const worker = workers.find(w => w.id === app.workerId);
              const job = jobs.find(j => j.id === app.jobId);
              if (!worker || !job) return null;

              const isUnlocked = app.status === 'verified_unlocked';
              const isPendingAdmin = app.status === 'paid_pending_admin';
              const isUnpaid = app.status === 'applied';
              const isRejected = app.status === 'rejected_refunded';

              return (
                <div
                  key={app.id}
                  className={`bg-slate-900/90 rounded-2xl p-5 border space-y-4 shadow-xl transition-all ${
                    isUnlocked
                      ? 'border-emerald-500/50 bg-gradient-to-b from-slate-900 to-emerald-950/20 emerald-glow'
                      : isPendingAdmin
                      ? 'border-amber-500/50 shimmer-bg'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-slate-400 font-mono">Applied for: </span>
                      <strong className="text-sky-300 font-bold">{job.title}</strong>
                    </div>

                    {isUnpaid && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> ₹499 Unpaid (Contact Locked)
                      </span>
                    )}

                    {isPendingAdmin && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> ₹499 Paid - Pending Admin Verification
                      </span>
                    )}

                    {isUnlocked && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Verified & Contact Unlocked
                      </span>
                    )}

                    {isRejected && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px] flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" /> Rejected (₹499 Refunded)
                      </span>
                    )}
                  </div>

                  {/* Worker Profile Overview */}
                  <div className="flex items-start gap-4">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-white truncate">{worker.name}</h4>
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {worker.rating}
                        </span>
                      </div>
                      <p className="text-xs text-sky-400 font-semibold">{worker.tradeTitleEn}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Experience: <strong className="text-slate-200">{worker.experienceYears} Years</strong> | Expected Pay: <strong className="text-amber-300">₹{worker.expectedPay}/{worker.payType}</strong>
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {worker.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Worker Pitch Note */}
                  {app.pitchNote && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                      <span className="text-slate-500 not-italic font-bold block mb-0.5">Worker Note:</span>
                      "{app.pitchNote}"
                    </div>
                  )}

                  {/* GATED CONTACT & LOCATION INFORMATION SECTION (Step 4 & 7) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                        Worker Private Contact & Address
                      </span>

                      {isUnlocked && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                          ID: {worker.idDocNumber}
                        </span>
                      )}
                    </div>

                    {!isUnlocked ? (
                      /* LOCKED STATE PREVIEW */
                      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-3 relative overflow-hidden">
                        <div className="filter blur-xs select-none pointer-events-none space-y-1 opacity-40">
                          <p className="text-xs text-slate-300 font-mono">Phone: +91 98765 43210</p>
                          <p className="text-xs text-slate-300 font-mono">Address: House #42, Main Road, Peenya</p>
                        </div>

                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                            <Lock className="w-4 h-4" />
                            <span>Private Details Masked by Platform</span>
                          </div>
                          <p className="text-[11px] text-slate-400 max-w-xs">
                            Pay ₹499 verification fee to send worker background & ID proof to Admin Verification. Phone number & GPS location will unlock immediately after approval.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* UNLOCKED CONTACT STATE */
                      <div className="space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Verified Direct Phone:</span>
                            <span className="text-sm font-extrabold text-emerald-400 font-mono">{worker.phone}</span>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Verified Resident Address:</span>
                            <span className="text-xs font-semibold text-slate-200">{worker.location}</span>
                          </div>
                        </div>

                        {/* Interactive Route Map */}
                        <InteractiveMap
                          workerLoc={worker}
                          workplaceLoc={job}
                          workerName={worker.name}
                          workplaceName={job.title}
                          height="200px"
                        />

                        {/* Call & WhatsApp Trigger Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`tel:${worker.phone}`}
                            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
                          >
                            <PhoneCall className="w-4 h-4" />
                            <span>Call Worker ({worker.phone})</span>
                          </a>

                          <a
                            href={`https://wa.me/${worker.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp Chat</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Trigger Action */}
                  {isUnpaid && (
                    <button
                      onClick={() => onInitiatePayment(app, worker, job)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-5 h-5 text-slate-950" />
                      <span>Proceed to ₹499 Verification Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {isPendingAdmin && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        <Clock className="w-4 h-4 animate-spin text-amber-400" />
                        Verification in Progress by Admin...
                      </span>
                      <span className="text-[11px] text-slate-400">Switch to Admin View to approve</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post a Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <PlusCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Create New Job Posting</h3>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Industrial Electrician or CNC Lathe Operator"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Trade Category</label>
                  <select
                    value={tradeCategory}
                    onChange={(e) => setTradeCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {TRADE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nameEn} ({cat.nameHi})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vacancies Count</label>
                  <input
                    type="number"
                    min="1"
                    value={vacancies}
                    onChange={(e) => setVacancies(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Offered Salary Amount (₹)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Pay Frequency</label>
                  <select
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="daily">Daily Wage (दिहाड़ी)</option>
                    <option value="monthly">Monthly Salary (मासिक)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Workplace Address / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Shift & Working Hours</label>
                <input
                  type="text"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  placeholder="e.g. Day Shift (8:30 AM - 5:30 PM)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Required Skills & Experience</label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

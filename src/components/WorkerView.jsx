import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  CheckCircle, 
  Lock, 
  Unlock, 
  PhoneCall, 
  Navigation, 
  ExternalLink, 
  Sparkles,
  Zap,
  Flame,
  Car,
  Truck,
  ShieldCheck,
  Factory,
  Utensils,
  Droplet,
  Hammer,
  Wrench,
  User,
  Building2,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { TRADE_CATEGORIES } from '../data/mockData';
import InteractiveMap from './InteractiveMap';

const ICON_MAP = {
  Wrench, Zap, Flame, Car, Truck, ShieldCheck, Factory, Utensils, Droplet, Hammer
};

export default function WorkerView({ 
  workers, 
  selectedWorkerId, 
  setSelectedWorkerId, 
  jobs, 
  employers, 
  applications, 
  onApplyJob 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [payTypeFilter, setPayTypeFilter] = useState('all'); // 'all', 'daily', 'monthly'
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'applications'
  const [applyingJob, setApplyingJob] = useState(null);
  const [pitchNote, setPitchNote] = useState('');

  const currentWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // Filter jobs based on search, category, and salary type
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.requirements.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedTrade === 'all' || job.tradeCategory === selectedTrade;
    const matchesPayType = payTypeFilter === 'all' || job.salaryType === payTypeFilter;
    return matchesSearch && matchesCategory && matchesPayType;
  });

  // Filter applications submitted by this worker
  const myApplications = applications.filter(a => a.workerId === currentWorker.id);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    onApplyJob(applyingJob.id, currentWorker.id, pitchNote || 'I am ready to join immediately.');
    setApplyingJob(null);
    setPitchNote('');
    setActiveTab('applications');
  };

  return (
    <div className="space-y-6">
      {/* Worker Switcher & Profile Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <img
            src={currentWorker.avatar}
            alt={currentWorker.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500/40 shrink-0 sky-glow"
          />
          <div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Logged in Worker:</label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="bg-slate-950 text-sky-400 font-extrabold text-sm border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500"
              >
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.tradeTitleEn})</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Target Wage: <strong className="text-amber-400">₹{currentWorker.expectedPay}/{currentWorker.payType}</strong> | Location: <strong className="text-slate-200">{currentWorker.location}</strong>
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Browse Openings ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'applications'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Applications ({myApplications.length})
            {myApplications.some(a => a.status === 'verified_unlocked') && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search & Category Filter Section */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title (e.g. Electrician, Welder, Driver), skills, or locality..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
                />
              </div>

              {/* Pay Type Filter */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPayTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    payTypeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                  }`}
                >
                  All Pay
                </button>
                <button
                  onClick={() => setPayTypeFilter('daily')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    payTypeFilter === 'daily' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
                  }`}
                >
                  Daily Wage (दिहाड़ी)
                </button>
                <button
                  onClick={() => setPayTypeFilter('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    payTypeFilter === 'monthly' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
                  }`}
                >
                  Monthly Salary (मासिक)
                </button>
              </div>
            </div>

            {/* Trade Categories Carousel Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {TRADE_CATEGORIES.map(cat => {
                const IconComponent = ICON_MAP[cat.icon] || Wrench;
                const isSelected = selectedTrade === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTrade(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md border border-sky-400/30'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.nameEn} ({cat.nameHi})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const employer = employers.find(e => e.id === job.employerId);
              const existingApp = applications.find(a => a.jobId === job.id && a.workerId === currentWorker.id);

              return (
                <div
                  key={job.id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700/90 space-y-4 shadow-xl glass-card-hover"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={employer?.logo}
                        alt={employer?.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-extrabold text-white">{job.title}</h3>
                        <p className="text-xs text-sky-400 font-semibold">{employer?.name}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-amber-400">
                        ₹{job.salary}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {job.salaryType === 'daily' ? 'Per Day (दिहाड़ी)' : 'Per Month (मासिक)'}
                      </span>
                    </div>
                  </div>

                  {/* Shift & Vacancies Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" /> {job.shift}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                      Vacancies: <strong className="text-emerald-400">{job.vacancies} Positions</strong>
                    </span>
                  </div>

                  {/* Requirements & Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                    <strong className="text-slate-300 block mb-1">Key Requirements:</strong>
                    {job.requirements}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {existingApp ? (
                      <div className="p-3 bg-sky-950/60 border border-sky-500/40 rounded-xl text-xs text-sky-300 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold">
                          <CheckCircle className="w-4 h-4 text-sky-400" />
                          Application Submitted
                        </span>
                        <span className="text-[11px] font-mono capitalize text-amber-400">
                          Status: {existingApp.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setApplyingJob(job)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Apply for Job ({currentWorker.name})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* MY APPLICATIONS TRACKER VIEW (Step 2 to 7 Workflow) */
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-sky-400" />
            Track Your Submitted Applications ({myApplications.length})
          </h3>

          {myApplications.length === 0 ? (
            <div className="bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">You haven't applied for any jobs yet</h4>
              <p className="text-xs text-slate-500">Switch to the "Browse Openings" tab above to explore jobs and apply.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {myApplications.map((app) => {
                const job = jobs.find(j => j.id === app.jobId);
                const employer = employers.find(e => e.id === job?.employerId);
                if (!job || !employer) return null;

                const isUnlocked = app.status === 'verified_unlocked';
                const isPendingAdmin = app.status === 'paid_pending_admin';

                return (
                  <div
                    key={app.id}
                    className={`bg-slate-900/90 rounded-2xl p-6 border space-y-5 shadow-xl ${
                      isUnlocked
                        ? 'border-emerald-500/60 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 emerald-glow'
                        : isPendingAdmin
                        ? 'border-amber-500/50 shimmer-bg'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={employer.logo}
                          alt={employer.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <h4 className="text-base font-extrabold text-white">{job.title}</h4>
                          <p className="text-xs text-sky-400 font-bold">{employer.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-amber-400">
                          ₹{job.salary}/{job.salaryType === 'daily' ? 'day' : 'mo'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* 5-Step Progress Bar Lifecycle */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Verification & Hiring Lifecycle Tracker:
                      </span>

                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                        {/* Step 1 */}
                        <div className="p-2 rounded-lg bg-sky-950 text-sky-300 border border-sky-500/40">
                          1. Applied ✓
                        </div>

                        {/* Step 2 */}
                        <div className="p-2 rounded-lg bg-sky-950 text-sky-300 border border-sky-500/40">
                          2. Employer Review ✓
                        </div>

                        {/* Step 3 */}
                        <div className={`p-2 rounded-lg ${
                          app.verificationFeePaid ? 'bg-sky-950 text-sky-300 border border-sky-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          3. ₹499 Paid {app.verificationFeePaid ? '✓' : ''}
                        </div>

                        {/* Step 4 */}
                        <div className={`p-2 rounded-lg ${
                          isPendingAdmin || isUnlocked ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          4. Admin Audit {isUnlocked ? '✓' : ''}
                        </div>

                        {/* Step 5 */}
                        <div className={`p-2 rounded-lg ${
                          isUnlocked ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-black' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          5. Unlocked! 🎉
                        </div>
                      </div>
                    </div>

                    {/* WORKPLACE & CONTACT UNLOCKED VIEW (Step 7 Requirement) */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-2 text-sky-400">
                          {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                          Employer Workplace Address & Contact Details
                        </span>

                        {isUnlocked && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                            Verified Employer Site
                          </span>
                        )}
                      </div>

                      {!isUnlocked ? (
                        /* MASKED WORKPLACE VIEW BEFORE VERIFICATION */
                        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-2 relative overflow-hidden">
                          <div className="filter blur-xs select-none opacity-40 text-xs font-mono space-y-1">
                            <p>Contact: Mr. Rajesh Sharma (+91 98230 *****)</p>
                            <p>Address: Peenya Industrial Area Phase II, Bengaluru</p>
                          </div>

                          <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-3 text-center space-y-1">
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                              <Lock className="w-4 h-4" /> Workplace GPS & Contact Details Locked
                            </span>
                            <p className="text-[11px] text-slate-400 max-w-md">
                              When the employer pays the ₹499 verification fee and Admin approves your background check, the exact factory location map route and direct phone contact will unlock here automatically!
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* UNLOCKED WORKPLACE LOCATION & ROUTE MAP */
                        <div className="space-y-4 animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 text-[10px] block">Verified Contact Person:</span>
                              <span className="text-sm font-extrabold text-white">{employer.contactPerson}</span>
                              <span className="text-xs text-emerald-400 block font-mono mt-0.5">{employer.phone}</span>
                            </div>

                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 text-[10px] block">Exact Factory / Workplace Address:</span>
                              <span className="text-xs font-semibold text-slate-200">{employer.location}</span>
                            </div>
                          </div>

                          {/* Interactive Workplace Route Map */}
                          <InteractiveMap
                            workerLoc={currentWorker}
                            workplaceLoc={job}
                            workerName={currentWorker.name}
                            workplaceName={job.title}
                            height="240px"
                          />

                          {/* Quick Navigation Action */}
                          <div className="flex items-center gap-3">
                            <a
                              href={`tel:${employer.phone}`}
                              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span>Call Employer ({employer.contactPerson})</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Apply Confirmation Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Apply for {applyingJob.title}</h3>
            <p className="text-xs text-slate-300">
              Applying as <strong>{currentWorker.name}</strong> ({currentWorker.tradeTitleEn}). Your profile, experience rating (★{currentWorker.rating}), and trade badge will be sent to the employer.
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Pitch Note / Availability (Optional)</label>
                <textarea
                  rows={3}
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  placeholder="e.g. I have 6 years experience in Peenya industrial area and can join immediately."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-600/30"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

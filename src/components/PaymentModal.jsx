import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Building, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentModal({ application, worker, job, onClose, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'qr', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('employer@okicici');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!application || !worker || !job) return null;

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 1.8s payment processing API call
    setTimeout(() => {
      const generatedTxn = 'TXN-PAY-' + Math.floor(1000000 + Math.random() * 9000000);
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback if canvas confetti fails
      }

      // Dispatch state update to parent
      setTimeout(() => {
        onPaymentSuccess(application.id, {
          amount: 499,
          paidAt: new Date().toISOString(),
          txnId: generatedTxn,
          paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod.toUpperCase()
        });
      }, 1400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Worker Verification Payment
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Razorpay Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">Secure ₹499 Platform Verification Fee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto emerald-glow">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">Payment Received!</h4>
              <p className="text-sm text-slate-300 font-medium">
                ₹499.00 held securely in JobConnect Verification Escrow
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-sky-400">{txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-white">{worker.name} ({worker.tradeTitleEn})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Step:</span>
                <span className="font-bold text-amber-400">Pending Admin Background Verification</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Redirecting to Admin Verification Queue... Phone & exact map location will unlock as soon as Admin approves.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-6">
            {/* Applicant Summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{worker.name}</h4>
                  <p className="text-xs text-sky-400">{worker.tradeTitleEn}</p>
                  <p className="text-[11px] text-slate-400">For Job: <strong className="text-slate-200">{job.title}</strong></p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Verification Fee</span>
                <span className="text-2xl font-black text-amber-400">₹499</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-sky-950/70 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="text-xs font-bold block">UPI Apps</span>
                    <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'qr'
                      ? 'bg-sky-950/70 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold block">Scan QR Code</span>
                    <span className="text-[10px] text-slate-400">Instant Camera Scan</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-sky-950/70 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold block">Card / ATM</span>
                    <span className="text-[10px] text-slate-400">Debit & Credit Cards</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-sky-950/70 border-sky-500 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold block">NetBanking</span>
                    <span className="text-[10px] text-slate-400">SBI, HDFC, ICICI</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Method Details Input */}
            {paymentMethod === 'upi' && (
              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300">Enter UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or name@okicici"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=jobconnect@icici&pn=JobConnect&am=499.00"
                  alt="UPI QR Code"
                  className="w-32 h-32 mx-auto rounded-lg border-2 border-slate-700 p-1 bg-white"
                />
                <p className="text-xs text-slate-400">Scan using any UPI app (GPay / PhonePe / Paytm / BHIM)</p>
              </div>
            )}

            {/* Refund Guarantee Badge */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% Platform Guarantee:</strong> If Admin verification rejects candidate background or worker is unavailable, your ₹499 is automatically refunded to your payment source.
              </span>
            </div>

            {/* Submit Payment Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment ₹499...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹499 & Proceed to Admin Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

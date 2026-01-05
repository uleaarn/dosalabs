import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { calculatePrice } from '../lib/pricing.ts';
import { submitBooking, resendBookingEmail } from '../lib/mockApi.ts';
import { BookingState } from '../types.ts';

import classesData from '../data/classes.ts';
import kitsData from '../data/kits.ts';

const ONLINE_SLOTS = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];
const INHOME_SLOTS = ["11:00 AM", "2:00 PM", "5:00 PM"];

export const ContactBooking = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'SENT' | 'FAILED' | 'QUEUED' | 'PENDING'>('PENDING');
  const [finalBookingId, setFinalBookingId] = useState('');
  
  // Permanent unique ID for this specific session/booking attempt
  const bookingRequestId = useMemo(() => `req_${Math.random().toString(36).substr(2, 12)}_${Date.now()}`, []);

  const [form, setForm] = useState<BookingState>({
    step: 1,
    bookingId: '',
    contact: { fullName: '', email: '', phone: '', audienceType: 'individual', organizationName: '' },
    selection: { classId: 'c1', date: '', format: 'online', timeSlot: ONLINE_SLOTS[0], timeZone: 'Eastern Time (ET)', selectedKits: [] },
    details: { 
      headcount: 2, 
      zipCode: '', 
      address: '', 
      kitchenNotes: '', 
      allergies: '', 
      pickupSlot: 'Saturday 9am - 11am', 
      consent: false,
      participantAgeGroup: 'adults',
      parentalSupervisionConsent: false,
      safetyToolsConsent: false
    },
    pricing: { base: 89, addons: 0, total: 89 }
  });

  const isKidsSession = form.details.participantAgeGroup === 'kids' || form.selection.classId === 'c7';

  // Available slots based on format
  const availableSlots = form.selection.format === 'online' ? ONLINE_SLOTS : INHOME_SLOTS;

  // Reset timeSlot if format changes to an invalid one
  useEffect(() => {
    if (!availableSlots.includes(form.selection.timeSlot)) {
      updateField('selection', 'timeSlot', availableSlots[0]);
    }
  }, [form.selection.format, availableSlots]);

  useEffect(() => {
    const updatedPricing = calculatePrice(form);
    setForm(prev => ({ ...prev, pricing: updatedPricing }));
  }, [form.selection.classId, form.selection.date, form.selection.format, form.details.headcount, form.details.zipCode, form.selection.selectedKits, form.details.participantAgeGroup]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleDownloadChecklist = () => {
    const selectedClass = classesData.find(c => c.id === form.selection.classId);
    const content = `
DOSALABS PREP CHECKLIST
Lab: ${selectedClass?.name || 'Dosa Mastery Lab'}
Booking ID: ${finalBookingId}

EQUIPMENT NEEDED:
${selectedClass?.equipment.map(e => `- [ ] ${e}`).join('\n') || '- [ ] Heavy-duty blender\n- [ ] Non-stick/Cast-iron tawa\n- [ ] Spatula'}

INGREDIENTS TO SOURCE:
${selectedClass?.ingredients.map(i => `- [ ] ${i}`).join('\n') || '- [ ] Idli/Dosa Rice\n- [ ] Urad Dal\n- [ ] Fenugreek Seeds'}

CRITICAL PRE-LAB TASKS:
1. Soak Grains: 6-8 hours before session (if applicable).
2. Wash Dal: Rinse until water runs clear.
3. Clean Tawa: Scrub and season as per "Seasoning Guide" in the lab library.

QUESTIONS?
Email: lab@dosalabs.io
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dosalabs_prep_checklist_${finalBookingId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      handleNext();
    } else {
      if (isKidsSession && (!form.details.parentalSupervisionConsent || !form.details.safetyToolsConsent)) {
        alert("Please acknowledge parental supervision and safety requirements for Kids sessions.");
        return;
      }
      setIsSubmitting(true);
      try {
        const selectedClass = classesData.find(c => c.id === form.selection.classId);
        const response = await submitBooking({
          ...form,
          labName: selectedClass?.name || 'Dosa Mastery Lab',
          bookingRequestId
        });
        
        if (response.success) {
          setFinalBookingId(response.bookingId);
          setEmailStatus(response.emailStatus as any);
          setSuccess(true);
          window.scrollTo(0, 0);
        } else {
          alert(response.error || "Submission failed. Please try again.");
        }
      } catch (error) {
        alert("Network error. Please check your connection.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetryEmail = async () => {
    setIsRetryingEmail(true);
    const result = await resendBookingEmail(bookingRequestId);
    if (result.success) {
      setEmailStatus('SENT');
    } else {
      alert(result.error || "Retry failed. Limit may have been reached.");
    }
    setIsRetryingEmail(false);
  };

  const updateField = (section: keyof BookingState, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  if (success) {
    const selectedClass = classesData.find(c => c.id === form.selection.classId);
    
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-grayBorder p-12 rounded-card shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Lab Confirmed!</h1>
          <p className="text-grayMedium mb-2 font-medium">Booking ID: <span className="font-mono font-bold text-ink">{finalBookingId}</span></p>
          
          <div className="mb-10 p-6 bg-graySubtle rounded-2xl border border-grayBorder inline-flex flex-col items-center gap-4 w-full">
            {emailStatus === 'SENT' || emailStatus === 'QUEUED' ? (
              <p className="text-green-600 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                Confirmation Sent to {form.contact.email}
              </p>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-red-500 text-[11px] font-bold uppercase tracking-[0.2em]">⚠ Email Queue Error</p>
                <button 
                  onClick={handleRetryEmail}
                  disabled={isRetryingEmail}
                  className="px-8 py-3 bg-white border border-grayBorder rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-grayLight disabled:opacity-50 transition-all shadow-sm"
                >
                  {isRetryingEmail ? "Retrying..." : "Resend Confirmation"}
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-graySubtle p-10 rounded-2xl text-left mb-12 border border-grayBorder">
            <h3 className="font-bold mb-6 text-[10px] uppercase tracking-[0.3em] text-accent">Laboratory Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-grayMedium">Module:</span> <span className="font-bold text-ink">{selectedClass?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayMedium">Session:</span> <span className="font-bold text-ink">{form.selection.date} ({form.selection.timeSlot})</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-grayBorder">
                <span className="font-bold">Amount Paid:</span> <span className="font-bold text-lg text-ink">${form.pricing.total}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to={`/guest?bid=${bookingRequestId}`} 
                className="flex-1 px-8 py-5 bg-ink text-white rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg text-sm uppercase tracking-widest text-center"
              >
                Access Lab Prep
              </Link>
              <button 
                onClick={handleDownloadChecklist}
                className="flex-1 px-8 py-5 bg-accent text-white rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg text-sm uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download Checklist
              </button>
            </div>
            <a 
              href="https://chat.whatsapp.com/example-dosalabs-community" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full px-8 py-5 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#1ebd59] transition-all shadow-lg text-sm uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join WhatsApp Updates
            </a>
          </div>

          <Link to="/" className="text-xs font-bold uppercase tracking-widest text-grayMedium hover:text-ink transition-colors underline decoration-accent underline-offset-4">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 min-h-[800px]">
      <div className="flex-grow">
        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1 flex-grow rounded-full transition-colors ${s <= step ? 'bg-ink' : 'bg-grayLight'}`}></div>
            ))}
          </div>
          <h1 className="text-3xl font-bold">
            {step === 1 && "Who’s Booking"}
            {step === 2 && "Lab Details"}
            {step === 3 && "Kitchen & Add-Ons"}
            {step === 4 && "Consent & Payment"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
                  <input required minLength={2} value={form.contact.fullName} onChange={e => updateField('contact', 'fullName', e.target.value)} type="text" placeholder="Sarah Jenkins" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">Email Address</label>
                    <input required value={form.contact.email} onChange={e => updateField('contact', 'email', e.target.value)} type="email" placeholder="sarah@example.com" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">Mobile Number</label>
                    <input required value={form.contact.phone} onChange={e => updateField('contact', 'phone', e.target.value)} type="tel" placeholder="(973) 000-0000" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Lab Selection</label>
                  <select value={form.selection.classId} onChange={e => updateField('selection', 'classId', e.target.value)} className="w-full p-4 border border-grayBorder rounded-xl outline-none appearance-none bg-white">
                    {classesData.map(c => <option key={c.id} value={c.id}>{c.name} {c.category === 'kids' ? '(KIDS)' : ''}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider block">Format</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['online', 'in-home'].map((f) => (
                      <label key={f} className={`cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all ${form.selection.format === f ? 'border-ink bg-graySubtle' : 'border-grayBorder hover:bg-white'}`}>
                        <input type="radio" name="format" checked={form.selection.format === f} onChange={() => updateField('selection', 'format', f)} className="accent-ink" />
                        <span className="capitalize text-sm font-medium">{f} Lab</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">Preferred Date</label>
                    <input required min={new Date().toISOString().split('T')[0]} value={form.selection.date} onChange={e => updateField('selection', 'date', e.target.value)} type="date" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">Time Slot</label>
                    <select 
                      disabled={!form.selection.date}
                      value={form.selection.timeSlot} 
                      onChange={e => updateField('selection', 'timeSlot', e.target.value)} 
                      className="w-full p-4 border border-grayBorder rounded-xl outline-none appearance-none bg-white focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:bg-graySubtle"
                    >
                      {!form.selection.date ? (
                        <option value="">Select date first</option>
                      ) : (
                        availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Kitchen Notes</label>
                  <textarea value={form.details.kitchenNotes} onChange={e => updateField('details', 'kitchenNotes', e.target.value)} placeholder="e.g. Induction stove..." className="w-full p-4 border border-grayBorder rounded-xl outline-none min-h-[80px] focus:ring-1 focus:ring-accent" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Allergies</label>
                  <textarea required value={form.details.allergies} onChange={e => updateField('details', 'allergies', e.target.value)} placeholder="List allergies or 'None'." className="w-full p-4 border border-grayBorder rounded-xl outline-none min-h-[80px] focus:ring-1 focus:ring-accent" />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="space-y-8">
                <div className="p-8 bg-graySubtle rounded-2xl border border-grayBorder shadow-inner">
                  <h3 className="text-lg font-bold mb-6">Final Review</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-grayBorder pb-2">
                      <span className="text-grayMedium">Lab:</span>
                      <span className="font-bold">{classesData.find(c => c.id === form.selection.classId)?.name}</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <span className="text-lg font-bold">Total Due</span>
                      <span className="text-2xl font-bold text-ink">${form.pricing.total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" required checked={form.details.consent} onChange={e => updateField('details', 'consent', e.target.checked)} className="w-5 h-5 accent-ink mt-0.5" />
                    <label className="text-sm font-medium">I agree to the Lab Policies.</label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-ink text-white rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : `Confirm & Book Lab`}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-8 border-t border-grayBorder">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-8 py-3 text-sm font-bold border border-grayBorder rounded-full hover:bg-graySubtle transition-all">Back</button>
            )}
            {step < 4 && (
              <button type="submit" className="ml-auto px-12 py-3 bg-ink text-white rounded-full font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">Next Step</button>
            )}
          </div>
        </form>
      </div>

      <div className="w-full lg:w-80">
        <div className="sticky top-32 bg-white border border-grayBorder rounded-card p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Price Summary</h3>
          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between">
              <span className="text-grayMedium">Base Rate</span>
              <span className="font-bold">${form.pricing.base}</span>
            </div>
            {form.pricing.addons > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Add-Ons & Fees</span>
                <span className="font-bold">+${form.pricing.addons}</span>
              </div>
            )}
          </div>
          <div className="border-t border-grayBorder pt-6 flex justify-between items-end">
            <span className="text-sm font-medium">Total</span>
            <span className="text-3xl font-bold">${form.pricing.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
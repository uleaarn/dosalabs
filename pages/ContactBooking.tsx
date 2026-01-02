import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { calculatePrice } from '../lib/pricing.ts';
import { generateICSFromBooking } from '../lib/ics.ts';
import { submitBooking } from '../lib/mockApi.ts';
import { BookingState, ClassItem, BookingRecord } from '../types.ts';

import classesData from '../data/classes.ts';
import kitsData from '../data/kits.ts';

const TIME_ZONES = [
  "Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)", "Alaska Time (AKT)", "Hawaii-Aleutian Time (HAT)"
];

const PICKUP_SLOTS = [
  "Friday 4pm - 6pm", "Saturday 9am - 11am", "Saturday 4pm - 6pm", "Sunday 9am - 11am"
];

export const ContactBooking = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finalBookingId, setFinalBookingId] = useState('');
  
  // Memoized ID for idempotency during the session
  const sessionBookingId = useMemo(() => `DL-${Math.floor(100000 + Math.random() * 900000)}`, []);

  const [form, setForm] = useState<BookingState>({
    step: 1,
    bookingId: sessionBookingId,
    contact: { fullName: '', email: '', phone: '', audienceType: 'individual', organizationName: '' },
    selection: { classId: 'c1', date: '', format: 'online', timeSlot: 'afternoon', timeZone: 'Eastern Time (ET)', selectedKits: [] },
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

  useEffect(() => {
    const updatedPricing = calculatePrice(form);
    setForm(prev => ({ ...prev, pricing: updatedPricing }));
  }, [form.selection.classId, form.selection.date, form.selection.format, form.details.headcount, form.details.zipCode, form.selection.selectedKits, form.details.participantAgeGroup]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const downloadPrepChecklist = (selectedClass: ClassItem) => {
    const content = `DOSALABS PREP CHECKLIST: ${selectedClass.name}
Booking ID: ${finalBookingId}

EQUIPMENT NEEDED:
${selectedClass.equipment.map(e => `- [ ] ${e}`).join('\n')}

INGREDIENTS TO SOURCE:
${selectedClass.ingredients.map(i => `- [ ] ${i}`).join('\n')}

DIETARY NOTES:
${form.details.allergies || 'None specified'}

IMPORTANT LAB NOTES:
${selectedClass.goodToKnow.map(g => `* ${g}`).join('\n')}

See you in the Lab!
- Dosalabs Team`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dosalabs_Prep_Checklist_${finalBookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        const response = await submitBooking(form);
        if (response.success) {
          setFinalBookingId(response.bookingId);
          setSuccess(true);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        alert("Booking failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
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

  const toggleKit = (kitId: string) => {
    setForm(prev => {
      const kits = prev.selection.selectedKits.includes(kitId)
        ? prev.selection.selectedKits.filter(id => id !== kitId)
        : [...prev.selection.selectedKits, kitId];
      return {
        ...prev,
        selection: { ...prev.selection, selectedKits: kits }
      };
    });
  };

  if (success) {
    const selectedClass = classesData.find(c => c.id === form.selection.classId);
    const selectedClassName = selectedClass?.name || 'Dosa Lab';
    
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-grayBorder p-12 rounded-card shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Confirmed!</h1>
          <p className="text-grayMedium mb-2">Booking ID: <span className="font-mono font-bold text-ink">{finalBookingId}</span></p>
          <p className="text-grayMedium mb-10 max-w-md mx-auto">Confirmation sent to <strong>{form.contact.email}</strong>.</p>
          
          <div className="bg-graySubtle p-8 rounded-xl text-left mb-10 border border-grayBorder">
            <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-accent">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-grayMedium">Lab:</span> <span className="font-bold text-right">{selectedClassName}</span>
              <span className="text-grayMedium">Date:</span> <span className="font-bold text-right">{form.selection.date} ({form.selection.timeSlot})</span>
              <span className="text-grayMedium border-t border-grayBorder pt-2">Total Paid:</span> <span className="font-bold text-right border-t border-grayBorder pt-2 text-lg">${form.pricing.total}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => selectedClass && downloadPrepChecklist(selectedClass)}
              className="px-10 py-4 bg-ink text-white rounded-full font-bold hover:bg-opacity-90 transition-all"
            >
              Download Prep Checklist
            </button>
            <Link to="/" className="px-10 py-4 border border-ink text-ink rounded-full font-bold hover:bg-graySubtle transition-all">
              Return Home
            </Link>
          </div>
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
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider block">Audience Type</label>
                  <div className="flex flex-wrap gap-4">
                    {['individual', 'family', 'organization'].map((type) => (
                      <label key={type} className={`flex-grow cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all ${form.contact.audienceType === type ? 'border-ink bg-graySubtle' : 'border-grayBorder hover:bg-white'}`}>
                        <input type="radio" name="audienceType" checked={form.contact.audienceType === type} onChange={() => updateField('contact', 'audienceType', type)} className="accent-ink" />
                        <span className="capitalize text-sm font-medium">{type}</span>
                      </label>
                    ))}
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
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider block">Participant Age Group</label>
                  <div className="flex gap-4">
                    {['kids', 'teens', 'adults'].map((age) => (
                      <label key={age} className={`flex-grow cursor-pointer p-4 border rounded-xl flex items-center justify-center gap-3 transition-all ${form.details.participantAgeGroup === age ? 'border-ink bg-graySubtle' : 'border-grayBorder hover:bg-white'}`}>
                        <input type="radio" name="ageGroup" checked={form.details.participantAgeGroup === age} onChange={() => updateField('details', 'participantAgeGroup', age)} className="accent-ink" />
                        <span className="capitalize text-xs font-bold tracking-widest">
                          {age === 'kids' ? 'Kids (5-12)' : age}
                        </span>
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
                    <select value={form.selection.timeSlot} onChange={e => updateField('selection', 'timeSlot', e.target.value)} className="w-full p-4 border border-grayBorder rounded-xl outline-none appearance-none bg-white focus:ring-1 focus:ring-accent">
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>
                {form.selection.format === 'in-home' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">ZIP Code (NJ/NY Only)</label>
                    <input required pattern="[0-9]{5}" maxLength={5} value={form.details.zipCode} onChange={e => updateField('details', 'zipCode', e.target.value)} placeholder="07042" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                )}
                {isKidsSession && (
                  <div className="bg-accent/5 p-4 rounded-xl border border-accent/20">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-relaxed">Safety Notice: Sessions for ages 5-12 require active adult supervision. Heat-controlled surfaces and kid-safe tools only.</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Kitchen Notes</label>
                  <textarea value={form.details.kitchenNotes} onChange={e => updateField('details', 'kitchenNotes', e.target.value)} placeholder="e.g. Induction stove, specific equipment..." className="w-full p-4 border border-grayBorder rounded-xl outline-none min-h-[80px] focus:ring-1 focus:ring-accent" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Allergies</label>
                  <textarea required value={form.details.allergies} onChange={e => updateField('details', 'allergies', e.target.value)} placeholder="Please list any allergies or 'None'." className="w-full p-4 border border-grayBorder rounded-xl outline-none min-h-[80px] focus:ring-1 focus:ring-accent" />
                </div>
                <div className="pt-4 border-t border-grayBorder">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-4">Add-Ons</label>
                  <div className="space-y-3">
                    {kitsData.map(kit => (
                      <div key={kit.id} onClick={() => toggleKit(kit.id)} className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${form.selection.selectedKits.includes(kit.id) ? 'border-ink bg-graySubtle' : 'border-grayBorder hover:bg-white'}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={form.selection.selectedKits.includes(kit.id)} readOnly className="accent-ink" />
                          <span className="text-sm font-bold">{kit.name}</span>
                        </div>
                        <span className="text-sm font-bold">+${kit.price}</span>
                      </div>
                    ))}
                  </div>
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
                    <div className="flex justify-between border-b border-grayBorder pb-2">
                      <span className="text-grayMedium">Age Group:</span>
                      <span className="font-bold capitalize">{form.details.participantAgeGroup === 'kids' ? 'Kids (5-12)' : form.details.participantAgeGroup}</span>
                    </div>
                    <div className="flex justify-between border-b border-grayBorder pb-2">
                      <span className="text-grayMedium">Format:</span>
                      <span className="font-bold capitalize">{form.selection.format} Lab</span>
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
                  {isKidsSession && (
                    <>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" required checked={form.details.parentalSupervisionConsent} onChange={e => updateField('details', 'parentalSupervisionConsent', e.target.checked)} className="w-5 h-5 accent-ink mt-0.5" />
                        <label className="text-sm font-medium">I acknowledge that an adult (18+) must be supervising for the duration of this Kids Lab.</label>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" required checked={form.details.safetyToolsConsent} onChange={e => updateField('details', 'safetyToolsConsent', e.target.checked)} className="w-5 h-5 accent-ink mt-0.5" />
                        <label className="text-sm font-medium">I agree to provide kid-safe tools and maintain safety around hot surfaces.</label>
                      </div>
                    </>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-ink text-white rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all"
                >
                  {isSubmitting ? "Processing..." : `Pay $${form.pricing.total}`}
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
          {isKidsSession && (
            <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
               <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Kids Session: 60-min duration</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
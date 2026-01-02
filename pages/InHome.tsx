import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SwirlIcon } from '../constants.tsx';

// Animation Preset
const revealVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.24, 
      // Explicitly cast as tuple to satisfy Framer Motion's Easing type
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    } 
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

const QuoteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zip: '',
    headcount: '2-4',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-graySubtle rounded-full transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="p-10 sm:p-12">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold mb-4">Request a Quote</h2>
                <p className="text-grayMedium mb-8">For labs beyond our 40-mile radius or large-scale private events.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-grayMedium">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" 
                        placeholder="Sarah J."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-grayMedium">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" 
                        placeholder="sarah@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-grayMedium">Event Zip Code</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.zip}
                        onChange={e => setFormData({...formData, zip: e.target.value})}
                        className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" 
                        placeholder="07042"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-grayMedium">Expected Headcount</label>
                      <select 
                        className="w-full p-4 border border-grayBorder rounded-xl outline-none appearance-none bg-white"
                        value={formData.headcount}
                        onChange={e => setFormData({...formData, headcount: e.target.value})}
                      >
                        <option>2-4</option>
                        <option>5-10</option>
                        <option>11-20</option>
                        <option>20+</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-grayMedium">Additional Details</label>
                    <textarea 
                      className="w-full p-4 border border-grayBorder rounded-xl outline-none min-h-[100px] focus:border-accent"
                      placeholder="Tell us about your event goals, kitchen setup, or specific menu requests..."
                      value={formData.details}
                      onChange={e => setFormData({...formData, details: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-ink text-white rounded-full font-bold shadow-xl hover:scale-[1.01] transition-transform"
                  >
                    Submit Quote Request
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">Request Sent</h3>
                <p className="text-grayMedium mb-10">Our Chef will review your details and reach out with a custom quote within 24 hours.</p>
                <button 
                  onClick={onClose}
                  className="px-10 py-4 border border-ink rounded-full font-bold hover:bg-graySubtle transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const InHome = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen pb-32 font-sans">
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 block">Premium Experience</span>
            <h1 className="text-h1 font-bold leading-tight mb-8">
              Bring Dosalabs to Your Kitchen
            </h1>

            {/* Mobile-only Image */}
            <div className="block md:hidden mb-8">
              <div className="aspect-[4/3] rounded-card overflow-hidden bg-grayLight border border-grayBorder shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1470&auto=format&fit=crop" 
                  alt="Chef teaching in a home kitchen mobile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-body text-grayMedium mb-10 max-w-xl">
              We now offer In-Home Dosa Labs across New York & New Jersey. Our chef comes to your home and guides you step-by-step in your own kitchen — no guesswork, no mess, just perfect dosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact-booking" className="bg-ink text-white px-10 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all text-center shadow-xl">
                Book In-Home Dosa Lab
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block order-2"
          >
            <div className="aspect-[4/3] rounded-card overflow-hidden bg-grayLight border border-grayBorder shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1470&auto=format&fit=crop" 
                alt="Chef teaching in a home kitchen" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-6 bg-darkSurface text-white p-8 rounded-card border border-gray-800 shadow-2xl max-w-[280px] hidden lg:block">
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2">Coverage Area</p>
              <p className="text-sm leading-relaxed">Serving residential kitchens across the tri-state area with a focus on NJ & NY.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Birthday Special Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 bg-graySubtle rounded-card border border-grayBorder mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 block">Birthday Specials</span>
          <h2 className="text-h2 font-bold mb-8">Birthday Dosa Party 🎉</h2>
          <p className="text-body text-grayMedium mb-12">
            Turn your child’s birthday into a dosa-making adventure. We bring the lab to your kitchen with kid-safe tools, guided fun, and hands-on learning that tastes amazing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-12">
            {[
              "Mini dosa station",
              "Chef-led cooking session",
              "Creative plating challenge",
              "Group photo + Certificate"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-grayBorder">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-bold text-ink">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-block bg-ink text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
            >
              Plan a Birthday Dosa Party
            </button>
            <p className="text-[11px] text-grayMedium uppercase tracking-widest font-bold">
              All kids sessions require active adult supervision. Heat-controlled surfaces and kid-safe tools only.
            </p>
          </div>
        </div>
      </section>

      {/* Travel Fees Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-grayBorder">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
          <div className="lg:col-span-1">
            <h2 className="text-h2 font-bold mb-6">Travel & Transit Fees</h2>
            <p className="text-grayMedium mb-8">
              Transit fees are automatically calculated at checkout based on your ZIP code relative to our primary lab in Montclair, NJ.
            </p>
            <div className="p-6 bg-graySubtle rounded-card border border-grayBorder inline-block">
              <p className="text-xs font-bold text-ink flex items-center gap-2">
                <SwirlIcon className="w-4 h-4 text-accent" /> Auto-calculated at checkout
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="overflow-x-auto border border-grayBorder rounded-card">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-graySubtle border-b border-grayBorder">
                  <tr>
                    <th className="px-8 py-5 text-sm font-bold text-ink">Distance from Montclair, NJ</th>
                    <th className="px-8 py-5 text-sm font-bold text-ink">Transit Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grayBorder">
                  <tr>
                    <td className="px-8 py-5 text-sm text-grayMedium">0–10 miles</td>
                    <td className="px-8 py-5 text-sm font-bold text-green-600">Free</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-5 text-sm text-grayMedium">10–25 miles</td>
                    <td className="px-8 py-5 text-sm font-bold">+$25</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-5 text-sm text-grayMedium">25–40 miles</td>
                    <td className="px-8 py-5 text-sm font-bold">+$50</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-5 text-sm text-grayMedium">Beyond 40 miles</td>
                    <td className="px-8 py-5 text-sm font-bold">
                      <button 
                        onClick={() => setIsQuoteModalOpen(true)}
                        className="text-accent underline hover:opacity-80 transition-opacity"
                      >
                        Request a Quote
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements & What We Bring */}
      <section className="bg-graySubtle py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Requirements */}
          <div className="bg-white p-8 md:p-12 rounded-card border border-grayBorder shadow-sm">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm">1</div>
              Lab Requirements
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-body text-grayMedium font-medium">A standard kitchen with stovetop access (Gas, Electric, or Induction).</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-body text-grayMedium font-medium">Clean counter space for ingredient prep and batter spreading.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                <p className="text-body text-grayMedium font-medium">Maximum 12 participants per session for optimal safety and focus.</p>
              </li>
            </ul>
            <div className="mt-12 pt-8 border-t border-grayBorder">
              <p className="text-sm text-grayMedium italic mb-4">Planning for a larger party?</p>
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="text-ink font-bold underline underline-offset-4 hover:text-accent transition-colors"
              >
                Request Quote for 12+
              </button>
            </div>
          </div>

          {/* Kits Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-darkSurface text-white p-8 md:p-10 rounded-card border border-gray-800">
              <h3 className="text-xl font-bold mb-6 text-accent">What We Bring</h3>
              <ul className="space-y-4 text-grayLight">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Premium pre-fermented lab batter</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Specialty Spice Kit for the session</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Printed Dosa Lab Technique Guide</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-accent rounded-full" />
                  <span>Fermentation & batter troubleshooting charts</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-card border border-grayBorder">
              <h3 className="text-xl font-bold mb-6 text-ink">What You Provide</h3>
              <ul className="space-y-4 text-grayMedium">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-grayLight rounded-full" />
                  <span>Stove access & electricity</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-grayLight rounded-full" />
                  <span>Basic utensils (Detailed checklist sent after booking)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-grayLight rounded-full" />
                  <span>Basic pantry staples: Neutral oil & Salt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Book CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <h2 className="text-h2 font-bold mb-8">Ready to Crack the Code?</h2>
        <p className="text-body text-grayMedium mb-12">
          Book your private in-home session today and transform your kitchen into a South Indian culinary lab.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/contact-booking" 
            className="inline-block bg-ink text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Request In-Home Dosa Lab
          </Link>
          <button
             onClick={() => setIsQuoteModalOpen(true)}
             className="inline-block bg-white border border-grayBorder text-ink px-12 py-5 rounded-full font-bold text-lg hover:bg-graySubtle transition-all"
          >
            Custom Quote
          </button>
        </div>
        <p className="mt-8 text-sm text-grayMedium">Serving residential homes across New York & New Jersey.</p>
      </section>
    </div>
  );
};
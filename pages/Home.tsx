
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SwirlIcon, PARTNER_LOGOS } from '../constants.tsx';

// Production Motion Tokens
const durationBase = 0.24;
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const staggerChildren = 0.06;

const DISHES = [
  {
    name: 'Dosa',
    color: '#BF9264',
    eyebrow: 'FERMENTATION • HEAT • SPREAD',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Idli',
    color: '#BF9264',
    eyebrow: 'GRIND • FERMENT • STEAM',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Chutney',
    color: '#BF9264',
    eyebrow: 'ROAST • BLEND • TEMPER',
    image: 'https://images.unsplash.com/photo-1645177623570-2a938faec021?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Sambar',
    color: '#BF9264',
    eyebrow: 'AROMATICS • LENTILS • TEMPER',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Medu Vada',
    color: '#BF9264',
    eyebrow: 'SOAK • GRIND • SHAPE • FRY',
    image: 'https://images.unsplash.com/photo-1626132646529-500637532537?q=80&w=2070&auto=format&fit=crop',
  }
];

const FAQ_DATA = [
  {
    question: "Do I need a high-end blender?",
    answer: "While a dedicated wet grinder is gold standard, a high-speed blender (like a Vitamix or Ninja) works perfectly. We teach specific techniques to prevent overheating the motor and the batter."
  },
  {
    question: "What if my kitchen is cold?",
    answer: "Fermentation in colder climates (like NJ winters) is the #1 challenge. We cover the 'Oven-Light Method' and 'Thermal Wrapping' to ensure your batter rises regardless of the outside temp."
  },
  {
    question: "Is this suitable for beginners?",
    answer: "Absolutely. Our Labs are designed to build from first principles. If you've never touched a tawa, we'll start with the mechanics of the spread before moving to advanced texture control."
  }
];

// --- Shared Components ---

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

const InViewReveal: React.FC<RevealProps> = ({ children, className = "", stagger = true }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        animate: { transition: { staggerChildren: stagger ? staggerChildren : 0 } }
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={{
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0, transition: { duration: durationBase, ease: easeOut } }
        }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

const BorderBeamButton: React.FC<{ to: string; primary?: boolean; children: React.ReactNode; className?: string }> = ({ to, primary, children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <Link to={to} className={`btn-beam-container group relative px-10 py-4 rounded-full font-bold transition-all text-sm flex items-center justify-center gap-2 ${primary ? 'bg-ink text-white' : 'bg-white border border-grayBorder text-ink hover:bg-graySubtle'} ${className}`}>
      {!shouldReduceMotion && <div className="btn-beam-path" aria-hidden="true"><div className="btn-beam-moving-part" /></div>}
      {children}
    </Link>
  );
};

const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion || window.matchMedia('(pointer: coarse)').matches || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} className={`spotlight-card relative bg-white border border-grayBorder rounded-card transition-all group overflow-hidden ${shouldReduceMotion ? '' : 'hover:border-gray-300'} ${className}`}>
      {!shouldReduceMotion && <div className="spotlight-gradient absolute inset-0 pointer-events-none z-0" aria-hidden="true" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DISHES.length);
    }, 7000); // 7s per slide
    return () => clearInterval(interval);
  }, [shouldReduceMotion, isPaused]);

  const currentDish = DISHES[currentIndex];

  return (
    <div className="space-y-0 mb-32 overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative pt-6 md:pt-12 pb-16 md:pb-32 px-6 min-h-[90vh] flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {!shouldReduceMotion && (
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none px-6 max-w-7xl mx-auto opacity-[0.03]" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <motion.div key={i} className="border-l border-ink h-full last:border-r" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.2, delay: i * 0.08, ease: easeOut }} />
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center relative z-10 w-full">
          <div className="flex flex-col space-y-8 md:space-y-12">
            <div className="space-y-6 md:space-y-12">
              <div className="h-6 overflow-hidden flex items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.span key={currentDish.eyebrow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent block">
                    {currentDish.eyebrow}
                  </motion.span>
                </AnimatePresence>
                <div className="h-4 w-[1px] bg-grayBorder"></div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentDish.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/library" className="text-[10px] font-bold uppercase tracking-widest text-grayMedium hover:text-accent transition-colors">
                      {currentDish.name} Preview Available
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <h1 className="text-h1 font-bold leading-[1.05] tracking-tight text-ink">
                Crack the <br />
                <div className="inline-block min-w-[200px] md:min-w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.span key={currentDish.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.18 }} className="inline-block text-accent">
                      {currentDish.name}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <br />Code
              </h1>
            </div>

            <div className="block md:hidden relative w-full">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="aspect-[4/3] rounded-card overflow-hidden shadow-xl bg-grayLight border border-grayBorder relative z-10">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentDish.image} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.6 }} 
                    src={currentDish.image} 
                    className="w-full h-full object-cover" 
                    alt={`Technical cooking skill for ${currentDish.name}`} 
                    loading="lazy"
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="space-y-8">
              <p className="text-body text-grayMedium max-w-lg leading-relaxed">
                Master South Indian cooking through technique-first labs. Learn fermentation chemistry, batter mechanics, and heat mastery—online or in your kitchen. <Link to="/library" className="text-ink font-bold border-b border-accent hover:text-accent transition-colors">Watch our free preview.</Link>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <BorderBeamButton to="/contact-booking" primary className="w-full sm:w-auto">Book Your Lab</BorderBeamButton>
                <BorderBeamButton to="/classes" className="w-full sm:w-auto">Explore Classes</BorderBeamButton>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative h-full w-full min-h-[400px]">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="aspect-[4/5] rounded-card overflow-hidden shadow-2xl bg-grayLight border border-grayBorder relative z-10">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentDish.image} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.6 }} 
                  src={currentDish.image} 
                  className="w-full h-full object-cover" 
                  alt={`Dosalabs hero highlight for ${currentDish.name}`} 
                  loading="lazy"
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <div className="marquee-mask relative overflow-hidden py-16 md:py-24 border-y border-graySubtle" aria-hidden="true">
        <motion.div 
          className="flex gap-12 md:gap-24 whitespace-nowrap w-max" 
          animate={shouldReduceMotion ? {} : { x: [0, -1000] }} 
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
            <span key={i} className="text-sm md:text-xl font-black text-ink opacity-20 tracking-tighter hover:opacity-100 transition-opacity cursor-default uppercase">{logo}</span>
          ))}
        </motion.div>
      </div>

      {/* Principles Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <InViewReveal className="text-center mb-16 md:mb-24">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Principles</h2>
          <h3 className="text-h2 font-bold max-w-2xl mx-auto">Beyond recipes. We teach the system behind South Indian cooking.</h3>
        </InViewReveal>
        
        <InViewReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              title: 'Fermentation & Flavor', 
              desc: 'Understand pH, soaking times, wild cultures, and how climate changes your batter — so dosa and idli rise perfectly every time.' 
            },
            { 
              title: 'Grinding & Texture', 
              desc: 'Master grain-to-water ratios, blender vs grinder behavior, and how to read batter by sight and feel.' 
            },
            { 
              title: 'Heat, Steam & Oil Control', 
              desc: 'Learn temperature zones for crisp dosa, fluffy idli steaming, golden medu vadas, and oil that never soaks.' 
            },
            { 
              title: 'Shaping, Spreading & Tempering', 
              desc: 'From dosa spreading arcs to medu vada shaping and chutney tempering — technique that transforms outcomes.' 
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-grayBorder rounded-card p-8 md:p-10 flex flex-col h-full">
              <div className="text-accent mb-8" aria-hidden="true"><SwirlIcon className="w-10 h-10" /></div>
              <h4 className="text-xl font-bold mb-6">{item.title}</h4>
              <p className="text-grayMedium text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </InViewReveal>
      </section>

      {/* Featured Labs Section - Redesigned Dynamic Layout */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <InViewReveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
          <div className="max-w-xl">
             <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-4">The Selection</h2>
             <h3 className="text-h2 font-bold leading-tight">Elite Culinary Modules.</h3>
          </div>
          <Link to="/classes" className="text-xs font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors flex items-center gap-2 pb-1 border-b border-grayBorder">
            View All Labs
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </InViewReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Main Large Card (Dosa Mastery) */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="lg:col-span-7 group cursor-pointer"
          >
            <Link to="/classes/dosa-mastery-lab" className="block h-full relative overflow-hidden rounded-card border border-grayBorder bg-white shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500">
              <div className="aspect-[16/10] lg:aspect-auto lg:h-[600px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1200&auto=format&fit=crop" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  alt="Dosa Mastery Lab" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              </div>
              <div className="absolute top-8 left-8">
                <span className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Technique Foundation</span>
              </div>
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <h4 className="text-4xl font-bold mb-4 tracking-tight">Dosa Mastery Lab</h4>
                <p className="text-gray-300 max-w-md leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  The flagship module. Crack the science of batter density and lattice formation using our calibrated home-kitchen system.
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                   <span>120 Mins</span>
                   <div className="w-1 h-1 bg-accent rounded-full" />
                   <span>Starting $89</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Column Stack */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Kids Card */}
            <motion.div whileHover={{ x: 10 }} className="group">
              <Link to="/classes/kids-dosa-lab" className="flex flex-col sm:flex-row bg-graySubtle rounded-card border border-grayBorder overflow-hidden h-full sm:h-64 hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="sm:w-2/5 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                    alt="Kids Dosa Lab" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">KIDS</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center sm:w-3/5">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Junior Lab</h4>
                  <p className="text-sm text-grayMedium leading-relaxed mb-6">
                    Sensory-focused kitchen skills for ages 5-12. Learn real physics through flip-drills.
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    Book Junior Lab <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* In-Home Private Card */}
            <motion.div whileHover={{ x: 10 }} className="group flex-grow">
              <Link to="/in-home" className="flex flex-col sm:flex-row bg-darkSurface text-white rounded-card border border-gray-800 overflow-hidden h-full sm:h-auto min-h-64 relative hover:shadow-[0_40px_80px_-20px_rgba(191,146,100,0.1)] transition-all">
                <div className="p-10 flex flex-col justify-center sm:w-2/3 relative z-10">
                  <SwirlIcon className="w-8 h-8 text-accent mb-6" />
                  <h4 className="text-2xl font-bold mb-3 tracking-tight">In-Home Private Labs</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Customized technical guidance tailored to your specific stove and equipment.
                  </p>
                </div>
                <div className="sm:w-1/3 h-48 sm:h-auto bg-gray-900 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#BF9264" strokeWidth="0.5" fill="none" />
                        <circle cx="50" cy="50" r="30" stroke="#BF9264" strokeWidth="0.5" fill="none" />
                        <circle cx="50" cy="50" r="20" stroke="#BF9264" strokeWidth="0.5" fill="none" />
                      </svg>
                   </div>
                   <span className="text-accent font-black text-6xl opacity-10 uppercase -rotate-12 group-hover:rotate-0 transition-transform duration-700">LAB</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <InViewReveal>
          <div className="bg-white border border-grayBorder rounded-card overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-80 lg:h-auto bg-grayLight overflow-hidden border-b lg:border-b-0 lg:border-r border-grayBorder">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1470&auto=format&fit=crop" 
                  alt="Training demonstration of batter mechanics" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:p-16 lg:p-20">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6">THE DOSALABS METHOD</h4>
                <h3 className="text-h2 font-bold mb-8 leading-[1.1] tracking-tight">Hands-On Cooking Beats Reading Recipes. Every Time.</h3>
                <div className="space-y-8 text-grayMedium leading-relaxed mb-12">
                  <p>
                    South Indian cooking is a sensory craft. The difference between okay and restaurant-level comes from what you feel in real time — batter thickness, pan heat, steam behavior, and timing. That’s why Dosalabs is built as a hands-on lab, not a lecture.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Use your senses — learn what “right” looks and feels like",
                      "Master the building blocks — fermentation, heat, shaping",
                      "Fix your kitchen variables — your stove, pan, and climate",
                      "Cook once, learn forever — results you can repeat weekly"
                    ].map((bullet, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm font-medium">
                        <span className="text-accent mt-1" aria-hidden="true">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <BorderBeamButton to="/contact-booking" primary className="w-full sm:w-auto">Book Your Lab</BorderBeamButton>
                  <BorderBeamButton to="/classes" className="w-full sm:w-auto">See All Labs</BorderBeamButton>
                </div>
              </div>
            </div>
          </div>
        </InViewReveal>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <InViewReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">FAQ</h2>
          <h3 className="text-h2 font-bold">Technical Queries</h3>
        </InViewReveal>
        <InViewReveal className="border-t border-grayBorder">
          {FAQ_DATA.map((item, index) => (
            <div key={index} className="border-b border-grayBorder">
              <button 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)} 
                className="w-full py-8 md:py-10 flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                aria-expanded={activeFaq === index}
              >
                <span className={`text-lg font-bold transition-colors ${activeFaq === index ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>{item.question}</span>
                <motion.div animate={{ rotate: activeFaq === index ? 45 : 0 }} className={`flex-shrink-0 ml-4 ${activeFaq === index ? 'text-accent' : 'text-grayMedium'}`} aria-hidden="true">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: easeOut }}>
                    <div className="pb-10 text-grayMedium leading-relaxed text-body max-w-2xl">{item.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </InViewReveal>
      </section>

      {/* Sticky Booking Bar (Mobile Only) */}
      <div className="fixed bottom-6 left-6 right-6 z-[80] lg:hidden">
         <Link to="/contact-booking" className="block w-full text-center bg-ink text-white py-4 rounded-full font-bold shadow-2xl active:scale-[0.98] transition-transform">Book Dosa Lab</Link>
      </div>
    </div>
  );
};

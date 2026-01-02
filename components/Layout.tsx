import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo, NAV_LINKS, FOOTER_LINKS } from '../constants.tsx';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const durationBase = 0.24;
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MaintenanceBanner = () => {
  // Pattern stub for maintenance toggles
  const isMaintenance = false; 
  if (!isMaintenance) return null;
  return (
    <div className="bg-accent text-white py-2 text-center text-xs font-bold uppercase tracking-[0.2em] relative z-[100]">
      Lab Schedule Update: New In-Home slots for November now open
    </div>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    // Dynamic SEO Titles
    const currentLink = NAV_LINKS.find(l => l.path === location.pathname);
    if (currentLink) {
      document.title = `${currentLink.name} | Dosalabs — Crack the Dosa Code`;
    } else if (location.pathname === '/') {
      document.title = "Dosalabs — Technique-First Dosa Cooking Labs";
    }
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <MaintenanceBanner />
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          scrolled || mobileMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between" aria-label="Global Navigation">
          <Link to="/" className="text-ink hover:opacity-80 transition-opacity relative z-[70]" aria-label="Dosalabs Home">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} className={`text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors ${location.pathname === link.path ? 'text-accent' : 'text-grayMedium'}`}>
                {link.name}
              </Link>
            ))}
            <Link to="/contact-booking" className="bg-ink text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
              Book Dosa Lab
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-ink relative z-[70] p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
              <motion.span 
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 9 : 0 }}
                className="w-full h-0.5 bg-ink origin-center transition-transform"
              />
              <motion.span 
                animate={{ opacity: mobileMenuOpen ? 0 : 1, x: mobileMenuOpen ? 20 : 0 }}
                className="w-full h-0.5 bg-ink transition-all"
              />
              <motion.span 
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -9 : 0 }}
                className="w-full h-0.5 bg-ink origin-center transition-transform"
              />
            </div>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : durationBase, ease: easeOut }}
            className="fixed inset-0 z-[50] bg-white flex flex-col"
          >
            <div className="flex-grow flex flex-col justify-center px-6 pt-24 pb-12">
              <motion.div 
                initial="initial"
                animate="animate"
                variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
                className="space-y-6"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.path}
                    variants={{
                      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                      animate: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: durationBase, ease: easeOut }}
                  >
                    <Link 
                      to={link.path} 
                      className={`text-4xl font-bold tracking-tight block ${
                        location.pathname === link.path ? 'text-accent' : 'text-ink'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                    animate: { opacity: 1, y: 0 }
                  }}
                  className="pt-8"
                >
                  <Link 
                    to="/contact-booking" 
                    className="block w-full text-center bg-ink text-white py-5 rounded-full font-bold text-lg shadow-xl"
                  >
                    Book Dosa Lab
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="bg-darkSurface text-white pt-32 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="text-white mb-6" aria-hidden="true"><Logo /></div>
          <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed uppercase tracking-wider font-medium">
            Technique-first South Indian cooking labs. Based in Montclair, NJ.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Explore</h4>
          <ul className="space-y-4 text-gray-400 text-xs font-bold tracking-widest uppercase">
            {NAV_LINKS.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-white transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-accent">Support</h4>
          <ul className="space-y-4 text-gray-400 text-xs font-bold tracking-widest uppercase">
            {FOOTER_LINKS.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-white transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 gap-4">
        <p>© 2024 Dosalabs.io. Montclair, NJ.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">YouTube</a>
          <a href="#" className="hover:text-white transition-colors">Email</a>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

import React from 'react';

export const Logo = () => (
  <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(2, 2)">
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.1" />
      <path d="M14 2C20.6274 2 26 7.37258 26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 6C18.4183 6 22 9.58172 22 14C22 18.4183 18.4183 22 14 22C9.58172 22 6 18.4183 6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.5" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    </g>
    <text x="38" y="23" fontFamily="Inter" fontWeight="800" fontSize="21" letterSpacing="-0.04em" fill="currentColor">
      dosalabs
    </text>
  </svg>
);

export const PARTNER_LOGOS = [
  "THE NEW YORK TIMES", "EATER", "BON APPÉTIT", "FOOD & WINE", "GRUB STREET", "SAVEUR", "VOGUE", "THE WALL STREET JOURNAL", "CONDÉ NAST TRAVELER"
];

export const SwirlIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M12 12C10 10 8 12 10 14C12 16 14 14 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NAV_LINKS = [
  { name: 'Classes', path: '/classes' },
  { name: 'In-Home', path: '/in-home' },
  { name: 'Shop Kits', path: '/subscriptions-kits' },
  { name: 'Library', path: '/library' },
  { name: 'About', path: '/about' },
];

export const FOOTER_LINKS = [
  { name: 'Blog', path: '/blog' },
  { name: 'Experiences', path: '/experiences' },
  { name: 'Policies', path: '/policies' },
  { name: 'Legal', path: '/legal' },
];

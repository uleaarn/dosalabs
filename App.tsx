import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { About } from './pages/About.tsx';
import { ContactBooking } from './pages/ContactBooking.tsx';
import { Library } from './pages/Library.tsx';
import { Policies } from './pages/Policies.tsx';
import { Legal } from './pages/Legal.tsx';
import { ClassDetail } from './pages/ClassDetail.tsx';
import { InHome } from './pages/InHome.tsx';
import { BlogPostDetail } from './pages/BlogPostDetail.tsx';
import { KitCheckout } from './pages/KitCheckout.tsx';
import { ClaimDashboard } from './pages/ClaimDashboard.tsx';
import { GuestDashboard } from './pages/GuestDashboard.tsx';
import AuthAction from './pages/AuthAction.tsx';
import { ClassItem, KitItem, BlogPost } from './types.ts';

import kitsData from './data/kits.ts';
import blogData from './data/blog.ts';
import classesData from './data/classes.ts';

const classImages: Record<string, string> = {
  'c1': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
  'c2': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop',
  'c3': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  'c4': 'https://images.unsplash.com/photo-1645177623570-2a938faec021?q=80&w=600&auto=format&fit=crop',
  'c5': 'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?q=80&w=600&auto=format&fit=crop',
  'c6': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop',
  'c7': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop'
};

const Classes = () => {
  const [filter, setFilter] = useState<'all' | 'adults' | 'kids'>('all');

  const filteredClasses = classesData.filter(cls => {
    if (filter === 'all') return true;
    return cls.category === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <h1 className="text-h2 font-bold mb-4">Cooking Labs</h1>
          <p className="text-grayMedium">Technique-first South Indian culinary experiences.</p>
        </div>
        <div className="flex bg-graySubtle p-1 rounded-full border border-grayBorder">
          {(['all', 'adults', 'kids'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-ink text-white shadow-md' : 'text-grayMedium hover:text-ink'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClasses.map(cls => (
          <div key={cls.id} className="border border-grayBorder rounded-card hover:shadow-lg transition-shadow bg-white flex flex-col group overflow-hidden">
            <div className="h-48 bg-grayLight overflow-hidden relative">
              <img src={classImages[cls.id] || `https://picsum.photos/seed/${cls.id}/600/400`} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {cls.category === 'kids' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">KIDS</span>
                </div>
              )}
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">{cls.name}</h2>
                <div className="text-right">
                   <span className="font-bold text-accent block">${cls.price}</span>
                   <span className="text-[10px] text-grayMedium uppercase font-bold">Starting</span>
                </div>
              </div>
              <p className="text-grayMedium mb-8 flex-grow line-clamp-3">{cls.description}</p>
              <div className="flex gap-4 items-center mb-8 text-xs font-bold uppercase tracking-widest text-grayMedium">
                <span className="bg-grayLight px-2 py-1 rounded">{cls.type}</span>
                <span>{cls.duration}</span>
              </div>
              <div className="space-y-3 mt-auto">
                <Link to={`/classes/${cls.slug}`} className="block w-full text-center py-3 border border-ink text-ink rounded-full font-bold hover:bg-graySubtle transition-all text-sm flex items-center justify-center gap-2 group/btn">
                  Learn More
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover/btn:translate-x-0.5 transition-transform"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link to="/contact-booking" className="block w-full text-center py-3 bg-ink text-white rounded-full font-bold hover:bg-opacity-90 transition-all text-sm">
                  Book {cls.category === 'kids' ? 'Kids' : 'Quick'} Lab
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filter === 'kids' && (
        <div className="mt-20 p-8 border border-accent/20 bg-accent/5 rounded-card text-center">
           <p className="text-sm font-medium text-accent italic">"Great for screen-free sensory play and foundational kitchen skills. All kids sessions require active adult supervision."</p>
        </div>
      )}
    </div>
  );
};

const Kits = () => (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="text-center mb-20">
      <h1 className="text-h1 font-bold mb-6">Shop Dosa Lab Kits</h1>
      <p className="text-body text-grayMedium max-w-2xl mx-auto italic">Everything you need to crack the dosa code at home.</p>
      <div className="mt-8 bg-accent/5 border border-accent/20 p-6 rounded-card inline-block max-w-lg">
        <p className="text-sm font-medium text-accent leading-relaxed">
          Each lab includes a prep packet. For best results, pair your class with our Dosa Starter Pan Kit or Chutney Spice Kit.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {kitsData.map(kit => (
        <div key={kit.id} className="relative p-[1.5px] rounded-card bg-gradient-to-br from-grayBorder via-accent/20 to-grayBorder hover:from-accent hover:via-[#D4A77C] hover:to-accent transition-all duration-700 group shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(191,146,100,0.3)]">
          <div className="flex flex-col h-full rounded-[19px] bg-white overflow-hidden">
            <div className="h-64 overflow-hidden bg-grayLight border-b border-grayBorder relative">
              <img src={kit.image} alt={kit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {kit.recommended && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] bg-accent text-white px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg">Highly Recommended</span>
                </div>
              )}
            </div>
            <div className="p-10 flex-grow">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold group-hover:text-accent transition-colors duration-300">{kit.name}</h2>
                <p className="text-xl font-bold text-accent">${kit.price}</p>
              </div>
              <p className="text-grayMedium text-sm mb-8 leading-relaxed line-clamp-3">{kit.description}</p>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-accent" />
                  What's Inside
                </h4>
                <ul className="space-y-3">
                  {kit.details?.map((detail, idx) => (
                    <li key={idx} className="text-sm text-grayMedium flex items-start gap-3 group/li">
                      <div className="w-1.5 h-1.5 bg-accent/30 rounded-full mt-1.5 flex-shrink-0 group-hover/li:bg-accent transition-colors" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-10 pt-0">
               <Link to={`/kit-checkout/${kit.id}`} className="block w-full text-center py-4 bg-ink text-white rounded-full font-bold hover:bg-accent transition-all shadow-md active:scale-[0.98] text-sm uppercase tracking-widest">
                 {kit.delivery === 'pickup' ? 'Reserve for Pickup' : 'Order for Delivery'}
               </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="mt-24 bg-graySubtle p-12 rounded-card text-center border border-grayBorder shadow-sm relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
       <h3 className="text-2xl font-bold mb-4">Precision Engineering for your Plate</h3>
       <p className="text-grayMedium max-w-2xl mx-auto leading-relaxed">
         Most dosas fail because of uneven heat and sticky surfaces. Our specialized tools, including the Rosh Cookwares inspired cast-iron tawas, are calibrated for home kitchens to fix exactly that.
       </p>
    </div>
  </div>
);

const Blog = () => (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="mb-20">
      <h1 className="text-h2 font-bold mb-4">Lab Notes</h1>
      <p className="text-grayMedium">Technique breakthroughs and field reports from the lab.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {blogData.map(post => (
        <Link key={post.id} to={`/blog/${post.slug}`} className="group cursor-pointer block">
          <div className="aspect-video bg-grayLight rounded-card mb-6 overflow-hidden border border-grayBorder">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <p className="text-xs font-bold text-accent mb-2 uppercase tracking-widest">{post.date}</p>
          <h2 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{post.title}</h2>
          <p className="text-grayMedium mb-6 leading-relaxed line-clamp-2">{post.excerpt}</p>
          <span className="font-bold border-b-2 border-ink pb-1 group-hover:border-accent transition-colors">Read full entry</span>
        </Link>
      ))}
    </div>
  </div>
);

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-6 py-32 text-center">
    <h1 className="text-9xl font-bold text-grayLight mb-8">404</h1>
    <h2 className="text-3xl font-bold mb-6">Lab unreachable.</h2>
    <p className="text-grayMedium mb-12">The page you're looking for has fermented into a different path.</p>
    <a href="#/" className="bg-ink text-white px-10 py-4 rounded-full font-bold">Return Home</a>
  </div>
);

const SEO = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dosalabs",
    "image": "https://dosalabs.io/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Montclair",
      "addressLocality": "Montclair",
      "addressRegion": "NJ",
      "postalCode": "07042",
      "addressCountry": "US"
    },
    "url": "https://dosalabs.io"
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default function App() {
  return (
    <Router>
      <SEO />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:slug" element={<ClassDetail />} />
          <Route path="/in-home" element={<InHome />} />
          <Route path="/contact-booking" element={<ContactBooking />} />
          <Route path="/subscriptions-kits" element={<Kits />} />
          <Route path="/kit-checkout/:kitId" element={<KitCheckout />} />
          <Route path="/library" element={<Library />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/claim" element={<ClaimDashboard />} />
          <Route path="/dashboard" element={<GuestDashboard />} />
          <Route path="/auth/action" element={<AuthAction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
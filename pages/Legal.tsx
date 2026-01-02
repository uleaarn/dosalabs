
import React from 'react';

export const Legal = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <h1 className="text-h2 font-bold mb-12">Legal Information</h1>
    <div className="space-y-12 text-sm text-grayMedium leading-relaxed">
      <section>
        <h2 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider">Terms of Service</h2>
        <p>Welcome to Dosalabs.io. By booking a lab, you agree to follow our safety protocols. We are not responsible for injuries occurring in your own home kitchen during our online or in-home sessions. Use of high-heat equipment carries inherent risks.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider">Privacy Policy</h2>
        <p>We value your data. We only collect information necessary to process your booking and communicate lab details. We never sell your data to third parties. Payments are handled securely via Stripe.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider">Business Info</h2>
        <p>Dosalabs LLC<br />Montclair, NJ 07042<br />Contact: lab@dosalabs.io</p>
      </section>
    </div>
  </div>
);

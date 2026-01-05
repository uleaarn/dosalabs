
import React from 'react';

export const Policies = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <h1 className="text-h2 font-bold mb-12">Lab Policies & Logistics</h1>
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-bold mb-4">Cancellations</h2>
        <p className="text-grayMedium">Labs can be rescheduled up to 48 hours before the start time. Cancellations within 48 hours are non-refundable but can be gifted to a friend.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4">In-Home Travel Fees</h2>
        <ul className="list-disc pl-5 text-grayMedium space-y-2">
          <li>0–10 miles from Montclair, NJ: Free</li>
          <li>10–25 miles: $25 Travel Fee</li>
          <li>25–40 miles: $50 Travel Fee</li>
          <li>40+ miles: Contact for custom quote</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4">Allergens</h2>
        <p className="text-grayMedium">Our standard labs utilize rice, lentils, fenugreek, and ghee (dairy). Many recipes are vegan-friendly. We do not use peanuts in the main lab batter, but some chutneys contain peanuts. Please specify allergies during booking.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4">Ingredient Sourcing</h2>
        <p className="text-grayMedium">For Online Labs, we send a shopping list 7 days in advance. For In-Home Labs, the chef brings specialty grains and spices, but we ask you to provide basic pantry staples like oil and salt.</p>
      </section>
    </div>
  </div>
);

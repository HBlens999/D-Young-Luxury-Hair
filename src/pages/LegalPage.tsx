import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <div className="border-b border-[#EAE2D7] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C6A48] font-semibold block">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#291C16]">
          {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs text-[#8C6A48]">
          Last Updated: September 2026 · D YOUNG LUXURY HAIRS
        </p>
      </div>

      <div className="bg-white border border-[#EAE2D7] p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-[#4A3326] font-light leading-relaxed">
        {isPrivacy ? (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">1. Information We Collect</h2>
              <p>
                D YOUNG LUXURY HAIRS collects minimal personal information necessary to fulfill client orders and communications. This includes your name, phone number, WhatsApp contact number, and delivery location. We do not store sensitive payment card details on our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">2. Use of WhatsApp for Order Confirmation</h2>
              <p>
                To provide a high-touch luxury concierge experience, order specifications and delivery updates are coordinated via our official WhatsApp business channel. Your phone number is utilized strictly for order verification, dispatch tracking, and concierge consultations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">3. Data Security & Storage</h2>
              <p>
                Customer orders are securely transmitted and stored using Supabase database infrastructure adhering to rigorous enterprise security standards. We do not sell, rent, or lease customer data to third-party advertisers.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">1. Quality & Product Authenticity</h2>
              <p>
                D YOUNG LUXURY HAIRS warrants that all human hair products supplied are 100% genuine single-donor or double-drawn human hair as specified. Technical specifications regarding lengths, textures, and frontal sizes are meticulously verified prior to dispatch.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">2. Order Placement & WhatsApp Confirmation</h2>
              <p>
                Orders initiated on the website constitute a formal quotation request. The purchase agreement is finalized once our concierge verifies stock availability on WhatsApp, issues official invoice banking coordinates, and payment is acknowledged.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-[#291C16] font-semibold">3. Returns & Inspection Protocol</h2>
              <p>
                Due to the intimate and hygiene-sensitive nature of luxury human hair extensions and custom wigs, returns are only accepted if the hair remains uncombed, unworn, unbleached, and in its original security packaging with tags intact within 48 hours of receipt. Pre-dispatch video inspection is provided to ensure complete buyer satisfaction prior to shipping.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

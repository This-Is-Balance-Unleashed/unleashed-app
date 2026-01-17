'use client';

import { useState } from 'react';
import Link from 'next/link';

// Reusable checkmark icon component to avoid repeated inline SVGs
function CheckIcon() {
  return (
    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    partnershipType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-melo">
            Partnership Request Received!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in partnering with us. Our partnerships team will review your
            application and get back to you within 48 hours.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white text-sm mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-melo">Partner With Us</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Join Hit Refresh 2026 in empowering 1,000+ mid-to-senior professionals, entrepreneurs, and leaders through career growth, financial wellness, and sustainable success.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Why Partner Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-melo">Benefits of Partnering With Us</h2>
          <p className="text-gray-600 mb-6">
            Hit Refresh 2026 brings together 1,000+ mid-to-senior professionals, entrepreneurs, and leaders (ages 25-45)
            seeking high performance without burnout. With this partnership, we can help reshape how the next generation
            of African professionals and leaders build long-term, globally diversified wealth.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">Category Leadership in Global Wealth & Financial Wellbeing</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">High-Value User Acquisition</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">On-site Product Adoption And Onboarding</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">Stronger Brand Trust & Emotional Equity</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">Lifetime User Value Over One-Time Signups</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckIcon />
              <p className="text-gray-700">Cultural & Thought Leadership in Modern Wealth Building</p>
            </div>
          </div>
        </div>

        {/* Sponsorship Packages */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-melo">Sponsorship Packages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Platinum */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 rounded-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                PLATINUM
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold mb-4">₦7.5M</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    Opening keynote + Masterclass speaking slot
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    7 VIP passes
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    3 General Access Tickets
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    Premium brand visibility across all channels
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    Full page ad in post-event workbook
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    Prime exhibition booth
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    Post-event insights & attendee data opt-ins
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">✓</span>
                    PR Coverage Feature
                  </li>
                </ul>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 text-white p-6 rounded-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">
                GOLD
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold mb-4">₦5M</p>
                <ul className="space-y-2 text-sm text-yellow-100">
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    One high-visibility panel speaking slot
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    5 VIP passes
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    3 General Access Tickets
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Prominent branding on website and materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Half-page ad in post-event workbook
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Standard exhibition booth
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Attendee data opt-ins
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Inclusion in selected PR coverage
                  </li>
                </ul>
              </div>
            </div>

            {/* Silver */}
            <div className="bg-gradient-to-b from-gray-400 to-gray-500 text-white p-6 rounded-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-300 text-gray-800 px-4 py-1 rounded-full text-xs font-bold">
                SILVER
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold mb-4">₦3M</p>
                <ul className="space-y-2 text-sm text-gray-100">
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    3 VIP passes
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    3 General Access Tickets
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Logo on event website & materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Standard Booth
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Branding position on post-event materials
                  </li>
                </ul>
              </div>
            </div>

            {/* Bronze */}
            <div className="bg-gradient-to-b from-orange-700 to-orange-800 text-white p-6 rounded-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-400 text-orange-900 px-4 py-1 rounded-full text-xs font-bold">
                BRONZE
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold mb-4">₦1M</p>
                <ul className="space-y-2 text-sm text-orange-100">
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    1 VIP pass
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    2 General Access Tickets
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Logo on event website & materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Mini Exhibition Booth
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">✓</span>
                    Brand mention in program
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-center text-green-800 text-sm font-medium">
              Headline sponsorship is limited to ONE brand to preserve depth and exclusivity.
            </p>
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            Custom partnership options available. Contact us to discuss your specific needs.
          </p>
        </div>

        {/* Partnership Options */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-melo">Partnership Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Advisory Booth</h3>
              <p className="text-gray-600 text-sm">Set up an investment or service advisory booth to engage directly with attendees.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Live Demo Walkthrough</h3>
              <p className="text-gray-600 text-sm">Showcase your product or service with a live demonstration to the audience.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sponsored Masterclass</h3>
              <p className="text-gray-600 text-sm">Host a branded masterclass session to educate and engage attendees.</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Career & Wealth Toolkit</h3>
              <p className="text-gray-600 text-sm">Provide branded resources and tools that attendees can take home.</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-melo">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone / WhatsApp</p>
                <a href="tel:+2348160313583" className="text-gray-900 font-semibold hover:text-green-600">
                  +234 816 031 3583
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href="mailto:events@balanceunleashed.org" className="text-gray-900 font-semibold hover:text-green-600">
                  events@balanceunleashed.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-melo">Partnership Application</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  *Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  *Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">*Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  *Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *Sponsorship Package Interest
              </label>
              <select
                required
                value={formData.partnershipType}
                onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a package</option>
                <option value="platinum">Platinum (₦7,500,000)</option>
                <option value="gold">Gold (₦5,000,000)</option>
                <option value="silver">Silver (₦3,000,000)</option>
                <option value="bronze">Bronze (₦1,000,000)</option>
                <option value="custom">Custom Package</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                *Tell us about your partnership goals
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="What are you hoping to achieve through this partnership? What value can you bring to our attendees?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Partnership Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

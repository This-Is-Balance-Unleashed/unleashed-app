/** eslint-disable react/no-children-prop */
'use client';

import { useState } from 'react';
import type { ReactFormExtendedApi } from '@tanstack/react-form-nextjs';
import { groupFormOptions } from './group-form-options';

type FormData = (typeof groupFormOptions)['defaultValues'];

interface CorporateFieldsProps {
  form: ReactFormExtendedApi<FormData, any, any, any, any, any, any, any, any, any, any, any>;
}

const CORPORATE_PERKS = [
  { id: 'logo', label: 'Company Logo Display', description: 'Featured in Corporate Partners section' },
  { id: 'seating', label: 'Reserved Team Seating', description: 'Dedicated area for your team' },
  { id: 'audit', label: 'Post-Summit Audit', description: 'Career Wellness Audit report' },
  { id: 'photography', label: 'Team Photography', description: 'Professional team photo session' },
  { id: 'support', label: 'Dedicated Support', description: 'Priority support contact' },
];

export function CorporateFields({ form }: CorporateFieldsProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  return (
    <div className="mb-8 space-y-6">
      <h3 className="text-xl font-semibold">Company Information</h3>

      {/* Company Name */}
      <form.Field
        name="companyName"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your Company Ltd"
            />
          </div>
        )}
      />

      {/* Company Logo Upload */}
      <form.Field
        name="companyLogo"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo *
            </label>
            <div className="mt-2">
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      alert('File size must be less than 2MB');
                      return;
                    }
                    field.handleChange(file);

                    // Create preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
            {logoPreview && (
              <div className="mt-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-24 w-24 object-contain border border-gray-200 rounded-lg p-2"
                />
              </div>
            )}
          </div>
        )}
      />

      {/* Corporate Perks Selection */}
      <form.Field
        name="selectedPerks"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Corporate Perks *
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Choose the benefits you'd like to include (select all that apply)
            </p>
            <div className="space-y-3">
              {CORPORATE_PERKS.map((perk) => (
                <label
                  key={perk.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    name="selectedPerks"
                    value={perk.id}
                    checked={field.state.value?.includes(perk.id) || false}
                    onChange={(e) => {
                      const currentPerks = field.state.value || [];
                      if (e.target.checked) {
                        field.handleChange([...currentPerks, perk.id]);
                      } else {
                        field.handleChange(currentPerks.filter((id: string) => id !== perk.id));
                      }
                    }}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{perk.label}</p>
                    <p className="text-sm text-gray-600">{perk.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      />

      {/* Team Preferences */}
      <form.Field
        name="teamPreferences"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Preferences (Optional)
            </label>
            <textarea
              name="teamPreferences"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any special requests or preferences for your team? (seating arrangements, dietary requirements, etc.)"
            />
          </div>
        )}
      />
    </div>
  );
}

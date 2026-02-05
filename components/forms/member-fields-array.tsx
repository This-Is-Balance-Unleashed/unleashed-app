/** eslint-disable react/no-children-prop */
'use client';

import { useState } from 'react';
import type { ReactFormExtendedApi } from '@tanstack/react-form-nextjs';
import { groupFormOptions } from './group-form-options';

type FormData = (typeof groupFormOptions)['defaultValues'];

interface MemberFieldsArrayProps {
  form: ReactFormExtendedApi<FormData, any, any, any, any, any, any, any, any, any, any, any>;
  memberCount: number;
}

export function MemberFieldsArray({ form, memberCount }: MemberFieldsArrayProps) {
  const [showMembers, setShowMembers] = useState(false);
  const { Field, setFieldValue } = form;

  return (
    <div className="mb-8">
      <Field name="provideMemberDetails">
        {(field: any) => (
          <div>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="provideMemberDetails"
                checked={field.state.value}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  field.handleChange(isChecked);
                  setShowMembers(isChecked);

                  if (isChecked) {
                    setFieldValue('members', Array(memberCount).fill({ name: '', email: '' }));
                  } else {
                    setFieldValue('members', []);
                  }
                }}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Provide team/group member details now (Optional)
                </p>
                <p className="text-sm text-gray-600">
                  You can add {memberCount} additional member{memberCount !== 1 ? 's' : ''} now, or add them later
                </p>
              </div>
            </label>
          </div>
        )}
      </Field>

      {showMembers && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-gray-900">
            Additional Members ({memberCount} remaining)
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            All fields are optional. You can fill in what you know now and update the rest later.
          </p>

          <Field name="members">
            {(field: any) => (
              <div className="space-y-4">
                {Array.from({ length: memberCount }).map((_, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">
                        Member {index + 2}
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          const members = field.state.value || [];
                          const newMembers = [...members];
                          newMembers[index] = { name: '', email: '' };
                          field.handleChange(newMembers);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={field.state.value?.[index]?.name || ''}
                          onChange={(e) => {
                            const members = field.state.value || [];
                            const newMembers = [...members];
                            newMembers[index] = {
                              ...newMembers[index],
                              name: e.target.value,
                            };
                            field.handleChange(newMembers);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={field.state.value?.[index]?.email || ''}
                          onChange={(e) => {
                            const members = field.state.value || [];
                            const newMembers = [...members];
                            newMembers[index] = {
                              ...newMembers[index],
                              email: e.target.value,
                            };
                            field.handleChange(newMembers);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>
      )}
    </div>
  );
}

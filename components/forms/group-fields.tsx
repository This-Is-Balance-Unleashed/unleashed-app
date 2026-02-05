/** eslint-disable react/no-children-prop */
'use client';

import type { ReactFormExtendedApi } from '@tanstack/react-form-nextjs';
import { groupFormOptions } from './group-form-options';

type FormData = (typeof groupFormOptions)['defaultValues'];

interface GroupFieldsProps {
  form: ReactFormExtendedApi<FormData, any, any, any, any, any, any, any, any, any, any, any>;
}

export function GroupFields({ form }: GroupFieldsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Group Information</h3>

      {/* Group Name */}
      <form.Field
        name="groupName"
        children={(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              name="groupName"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., The Squad, Friday Crew, Dream Team"
            />
            <p className="mt-2 text-sm text-gray-600">
              Give your group a fun name to identify your booking
            </p>
          </div>
        )}
      />
    </div>
  );
}

'use client';

import { useFormContext } from 'react-hook-form';
import TermsAgreementCheckbox from '@/components/forms/TermsAgreementCheckbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/primitives/form';
import type { ScheduleFormData } from '@/db/validation/types';

export default function TermsCheckbox() {
  const { control } = useFormContext<ScheduleFormData>();

  return (
    <FormField
      control={control}
      name="hasAgreedToTerms"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <TermsAgreementCheckbox checked={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

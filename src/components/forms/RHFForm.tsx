import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/primitives/form';

interface RHFFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

/**
 * React Hook Form wrapper component that combines shadcn/ui Form with native form element
 *
 * @example
 * ```tsx
 * const form = useForm<MyFormData>({ ... });
 *
 * <RHFForm form={form} onSubmit={handleSubmit}>
 *   <FormField ... />
 *   <Button type="submit">Submit</Button>
 * </RHFForm>
 * ```
 */
export function RHFForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: RHFFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  );
}

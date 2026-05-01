import z from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must not exceed 50 characters'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

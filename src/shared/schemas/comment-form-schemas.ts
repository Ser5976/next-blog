import z from 'zod';

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(2, 'Comment must be at least 2 characters')
    .max(50000, 'Comment must not exceed 5000 characters')
    .trim(),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

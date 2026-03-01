import z from 'zod';

export const articleFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3).max(200).optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().nullable(),
  published: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.date().optional().nullable(),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

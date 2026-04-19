'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { deleteImageFromImageKit } from '@/shared/api/deleteImageFromImageKit';
import { ImageUpload, RichTextEditor } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { articleFormSchema, ArticleFormValues } from '../schemas';
import { ArticleFormProps } from '../types';

export function ArticleForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categories = [],
  availableTags = [],
}: ArticleFormProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags || []
  );

  const form = useForm({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      coverImage: initialData?.coverImage || null,
      categoryId: initialData?.categoryId || '',
      tags: initialData?.tags || [],
    },
  });

  const deleteImage = async (field: any) => {
    const imageUrl = field.value;
    field.onChange(null);

    if (imageUrl) {
      try {
        await deleteImageFromImageKit(imageUrl);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };
  const handleSubmit = async (data: ArticleFormValues) => {
    console.log('data form:', data);
    await onSubmit({
      ...data,
      tags: selectedTags,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter article title"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        A good title helps readers find your article
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="article-url-slug"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of the article (optional)"
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Max 500 characters. Appears in article previews.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Write your article content here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => deleteImage(field)}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Featured image for the article
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={
                          selectedTags.includes(tag.id) ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag.id)
                              ? prev.filter((id) => id !== tag.id)
                              : [...prev, tag.id]
                          );
                        }}
                        disabled={isSubmitting}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                  <FormDescription>
                    Select tags to categorize your article
                  </FormDescription>
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

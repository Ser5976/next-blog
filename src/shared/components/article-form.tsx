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
    await onSubmit({
      ...data,
      tags: selectedTags,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        noValidate
        data-testid="article-form"
        aria-label="Article edit form"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="article-form-main-card">
              <CardContent className="pt-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          type="text"
                          placeholder="Enter article title"
                          aria-label="Article title"
                          aria-required="true"
                          aria-disabled={isSubmitting}
                          data-testid="article-title-input"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        A good title helps readers find your article
                      </FormDescription>
                      <FormMessage data-testid="title-error" />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel htmlFor="slug">Slug</FormLabel>
                      <FormControl>
                        <Input
                          id="slug"
                          type="text"
                          placeholder="article-url-slug"
                          aria-label="Article URL slug"
                          aria-required="true"
                          aria-disabled={isSubmitting}
                          data-testid="article-slug-input"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title
                      </FormDescription>
                      <FormMessage data-testid="slug-error" />
                    </FormItem>
                  )}
                />

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel htmlFor="excerpt">Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          id="excerpt"
                          placeholder="Brief summary of the article (optional)"
                          className="resize-none"
                          aria-label="Article excerpt"
                          aria-describedby="excerpt-description"
                          aria-disabled={isSubmitting}
                          data-testid="article-excerpt-input"
                          {...field}
                          value={field.value || ''}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription id="excerpt-description">
                        Max 500 characters. Appears in article previews.
                      </FormDescription>
                      <FormMessage data-testid="excerpt-error" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card data-testid="article-form-content-card">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="content">Content</FormLabel>
                      <FormControl>
                        <div
                          data-testid="rich-text-editor"
                          aria-label="Article content editor"
                        >
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Write your article content here..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage data-testid="content-error" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card data-testid="article-form-image-card">
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
                      <FormMessage data-testid="cover-image-error" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card data-testid="article-form-category-card">
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger
                            id="category"
                            aria-label="Select category"
                            data-testid="category-select"
                          >
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
                      <FormMessage data-testid="category-error" />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel id="tags-label">Tags</FormLabel>
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby="tags-label"
                    data-testid="tags-container"
                  >
                    {availableTags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={
                          selectedTags.includes(tag.id) ? 'default' : 'outline'
                        }
                        size="sm"
                        aria-pressed={selectedTags.includes(tag.id)}
                        aria-label={`Toggle tag: ${tag.name}`}
                        data-testid={`tag-button-${tag.id}`}
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
            aria-label="Cancel editing and go back"
            data-testid="cancel-button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="cursor-pointer min-w-[120px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            aria-label={initialData ? 'Update article' : 'Create article'}
            aria-disabled={isSubmitting}
            data-testid="submit-button"
            disabled={isSubmitting}
            className="cursor-pointer min-w-[160px] relative"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin absolute left-4"
                  aria-hidden="true"
                  data-testid="submit-spinner"
                />
                <span className="ml-6">
                  {initialData ? 'Updating...' : 'Creating...'}
                </span>
              </>
            ) : (
              <span>{initialData ? 'Update Article' : 'Create Article'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

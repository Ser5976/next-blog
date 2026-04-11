'use client';

import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { ArticlesFiltersProps } from '../model';

export function ArticlesFiltersComponent({
  filters,
  onFiltersChange,
  categories = [],
  tags = [],
}: ArticlesFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    filters.category,
    filters.tag,
    filters.published !== undefined,
    filters.sortBy !== 'createdAt',
    filters.sortOrder !== 'desc',
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      search: filters.search,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles by title, content, or excerpt..."
            className="pl-10 pr-10"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                search: e.target.value,
                page: 1,
              })
            }
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  search: '',
                  page: 1,
                })
              }
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter articles by category, tag, and more
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4 p-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      category: value === 'all' ? undefined : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag</label>
                <Select
                  value={filters.tag || 'all'}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      tag: value === 'all' ? undefined : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.slug}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Published Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={
                    filters.published === undefined
                      ? 'all'
                      : filters.published
                        ? 'published'
                        : 'draft'
                  }
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      published:
                        value === 'all' ? undefined : value === 'published',
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy || 'createdAt'}
                  onValueChange={(value: any) =>
                    onFiltersChange({
                      ...filters,
                      sortBy: value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Last Updated</SelectItem>
                    <SelectItem value="publishedAt">Publish Date</SelectItem>
                    <SelectItem value="viewCount">Views</SelectItem>
                    <SelectItem value="averageRating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onValueChange={(value: any) =>
                    onFiltersChange({
                      ...filters,
                      sortOrder: value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category:{' '}
              {categories.find((c) => c.slug === filters.category)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    category: undefined,
                    page: 1,
                  })
                }
              />
            </Badge>
          )}
          {filters.tag && (
            <Badge variant="secondary" className="gap-1">
              Tag: {tags.find((t) => t.slug === filters.tag)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    tag: undefined,
                    page: 1,
                  })
                }
              />
            </Badge>
          )}
          {filters.published !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.published ? 'Published' : 'Draft'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    published: undefined,
                    page: 1,
                  })
                }
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

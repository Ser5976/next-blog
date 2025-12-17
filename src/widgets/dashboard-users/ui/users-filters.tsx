'use client';

import { ChevronDown, Filter, Search } from 'lucide-react';

import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { UsersFilters } from '../model/types';

interface UsersFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

export function UsersFiltersComponent({
  filters,
  onFiltersChange,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Поиск */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value, page: 1 })
            }
          />
        </div>
      </div>

      {/* Фильтр по ролям */}
      <div className="flex gap-2">
        <Select
          value={filters.role || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              role: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        {/* Сортировка */}
        <Select
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-') as [
              'createdAt' | 'lastSignInAt' | 'email',
              'asc' | 'desc',
            ];
            onFiltersChange({ ...filters, sortBy, sortOrder });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <ChevronDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest first</SelectItem>
            <SelectItem value="createdAt-asc">Oldest first</SelectItem>
            <SelectItem value="lastSignInAt-desc">Recently active</SelectItem>
            <SelectItem value="email-asc">Email A-Z</SelectItem>
            <SelectItem value="email-desc">Email Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

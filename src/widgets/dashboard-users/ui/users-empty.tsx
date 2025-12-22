import { Users } from 'lucide-react';

import { UsersEmptyProps } from '../model';

export function UsersEmpty({ searchQuery }: UsersEmptyProps) {
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No users found</h3>
      <p className="text-muted-foreground">
        {searchQuery
          ? `No users match "${searchQuery}". Try a different search.`
          : 'No users in the system yet'}
      </p>
    </div>
  );
}

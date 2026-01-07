'use client';

import { useState } from 'react';
import { FileText, MessageCircle } from 'lucide-react';

import { UserCommentsList } from '@/features/user-comments';
import { UserPostsList } from '@/features/user-posts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui';

export function UserContent({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center ">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              User Content
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <UserPostsList userId={userId} />
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <UserCommentsList userId={userId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

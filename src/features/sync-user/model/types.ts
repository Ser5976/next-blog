// тип данных полученного пользователя из базы
export interface User {
  id: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}

// тип данных для создания пользователя
export interface CreateUserInput {
  clerkId: string;
}

// Тип данных события Clerk webhook
export interface ClerkUserWebhookEvent {
  data: {
    id: string;
  };
  object: string;
  type: 'user.deleted' | string;
}

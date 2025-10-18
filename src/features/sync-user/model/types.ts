export interface User {
  id: string;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  clerkId: string;
}

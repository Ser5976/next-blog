export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  imageUrl: string;
  createdAt: number | null;
  lastSignInAt: number | null;
}

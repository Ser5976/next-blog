export interface ClerkUser {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddress: {
    emailAddress: string;
  } | null;
}

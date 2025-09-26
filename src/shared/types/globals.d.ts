export {};

// Create a type for the roles
export type Roles = 'admin' | 'user' | 'author';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      onboardingComplete?: boolean;
    };
  }
}

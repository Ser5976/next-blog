import { ClerkUser } from '../../model';
import { getDisplayName, getEmail } from '../user-profile-helpers';

// Создаем мок пользователя с правильными типами
const createMockUser = (overrides: Partial<ClerkUser> = {}): ClerkUser => ({
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  primaryEmailAddress: {
    emailAddress: 'john@example.com',
  },
  ...overrides,
});

describe('User Helpers', () => {
  describe('getDisplayName', () => {
    it('returns full name when first and last name are available', () => {
      const user = createMockUser();
      const result = getDisplayName(user);
      expect(result).toBe('John Doe');
    });

    it('returns only first name when last name is missing', () => {
      const user = createMockUser({ lastName: null });
      const result = getDisplayName(user);
      expect(result).toBe('John');
    });

    it('returns username when first and last name are missing', () => {
      const user = createMockUser({ firstName: null, lastName: null });
      const result = getDisplayName(user);
      expect(result).toBe('johndoe');
    });

    it('returns "User" when no name data is available', () => {
      const user = createMockUser({
        firstName: null,
        lastName: null,
        username: null,
      });
      const result = getDisplayName(user);
      expect(result).toBe('User');
    });

    it('returns "User" when user is null', () => {
      const result = getDisplayName(null);
      expect(result).toBe('User');
    });
    it('returns "User" when user is undefined', () => {
      const result = getDisplayName(undefined);
      expect(result).toBe('User');
    });
  });

  describe('getEmail', () => {
    it('returns email when available', () => {
      const user = createMockUser();
      const result = getEmail(user);
      expect(result).toBe('john@example.com');
    });

    it('returns "No email" when email is missing', () => {
      const user = createMockUser({ primaryEmailAddress: null });
      const result = getEmail(user);
      expect(result).toBe('No email');
    });

    it('returns "No email" when user is null', () => {
      const result = getEmail(null);
      expect(result).toBe('No email');
    });
    it('returns "No email" when user is undefined ', () => {
      const result = getEmail(undefined);
      expect(result).toBe('No email');
    });
  });
});

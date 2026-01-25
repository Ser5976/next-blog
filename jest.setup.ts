import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn().mockResolvedValue({
    userId: 'admin-id',
    sessionClaims: { metadata: { role: 'admin' } },
  }),
  clerkClient: jest.fn(() => ({
    users: {
      getUserList: jest.fn().mockResolvedValue({
        data: [],
        totalCount: 0,
      }),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    },
  })),
}));

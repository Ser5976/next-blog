/* // jest.setup.ts
import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'util';
import fetch, * as fetchModule from 'node-fetch';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Объединяем типы функции fetch и дополнительных свойств node-fetch
const fetchWithExtras = fetch as typeof fetch & {
  isRedirect: typeof fetchModule.isRedirect;
  AbortError: typeof fetchModule.AbortError;
  Blob: typeof fetchModule.Blob;
  //Body: typeof fetchModule.Body;
  FetchError: typeof fetchModule.FetchError;
  Headers: typeof fetchModule.Headers;
  Request: typeof fetchModule.Request;
  Response: typeof fetchModule.Response;
};

// Подменяем глобальные объекты для тестов
(global as unknown as { fetch: typeof fetchWithExtras }).fetch =
  fetchWithExtras;
(global as unknown as { Request: typeof fetchModule.Request }).Request =
  fetchModule.Request;
(global as unknown as { Response: typeof fetchModule.Response }).Response =
  fetchModule.Response;
(global as unknown as { Headers: typeof fetchModule.Headers }).Headers =
  fetchModule.Headers;
 */

import '@testing-library/jest-dom';

// Минимальная настройка для тестов без node-fetch
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

class MockResizeObserver {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

Object.defineProperty(global, 'ResizeObserver', {
  configurable: true,
  writable: true,
  value: MockResizeObserver,
});

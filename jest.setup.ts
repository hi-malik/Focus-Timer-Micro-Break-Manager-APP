import '@testing-library/jest-dom';

// Stub AudioContext for tests
class FakeAudioContext {
  public currentTime = 0;
  public state: 'suspended' | 'running' = 'running';
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
    } as any;
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    } as any;
  }
  resume() {
    return Promise.resolve();
  }
  get destination() {
    return {} as any;
  }
}

// @ts-ignore
global.AudioContext = FakeAudioContext as any;
// @ts-ignore
window.webkitAudioContext = FakeAudioContext as any;

// @ts-ignore
global.Notification = class {
  static permission = 'denied';
  constructor(_title: string, _options?: any) {}
  static requestPermission() {
    return Promise.resolve('denied');
  }
} as any;

// Stub matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

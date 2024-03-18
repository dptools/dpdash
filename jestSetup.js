import '@testing-library/jest-dom'

// Mock the SVGElement and CanvasElement methods that we use which are not
// implemented by JSDOM
Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
});

Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn()
})

import {
  isCrossOriginIframe,
  isInShadowDOM,
  getScrollOffset,
  isPixelPerfectElement,
  getViewportSize,
  isElementVisible,
} from '../dom.utils';

describe('dom.utils', () => {
  describe('isCrossOriginIframe', () => {
    it('should return false for non-iframe elements', () => {
      const div = document.createElement('div');
      expect(isCrossOriginIframe(div)).toBe(false);
    });

    it('should return false for same-origin iframe', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      // jsdom iframes are same-origin by default
      expect(isCrossOriginIframe(iframe)).toBe(false);
      document.body.removeChild(iframe);
    });
  });

  describe('isInShadowDOM', () => {
    it('should return false for elements in the main document', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      expect(isInShadowDOM(el)).toBe(false);
      document.body.removeChild(el);
    });

    it('should return true for elements inside a shadow root', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      const inner = document.createElement('span');
      shadow.appendChild(inner);
      document.body.appendChild(host);
      expect(isInShadowDOM(inner)).toBe(true);
      document.body.removeChild(host);
    });
  });

  describe('getScrollOffset', () => {
    it('should return an object with x and y', () => {
      const offset = getScrollOffset();
      expect(typeof offset.x).toBe('number');
      expect(typeof offset.y).toBe('number');
    });
  });

  describe('isPixelPerfectElement', () => {
    it('should return true for elements with data-pixelperfect', () => {
      const el = document.createElement('div');
      el.setAttribute('data-pixelperfect', 'overlay');
      expect(isPixelPerfectElement(el)).toBe(true);
    });

    it('should return true for children of data-pixelperfect elements', () => {
      const parent = document.createElement('div');
      parent.setAttribute('data-pixelperfect', 'overlay');
      const child = document.createElement('span');
      parent.appendChild(child);
      document.body.appendChild(parent);
      expect(isPixelPerfectElement(child)).toBe(true);
      document.body.removeChild(parent);
    });

    it('should return false for regular elements', () => {
      const el = document.createElement('div');
      expect(isPixelPerfectElement(el)).toBe(false);
    });
  });

  describe('getViewportSize', () => {
    it('should return width and height', () => {
      const size = getViewportSize();
      expect(typeof size.width).toBe('number');
      expect(typeof size.height).toBe('number');
    });
  });

  describe('isElementVisible', () => {
    it('should return false for display:none elements', () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.appendChild(el);
      expect(isElementVisible(el)).toBe(false);
      document.body.removeChild(el);
    });
  });
});

import { getUniqueSelector, getElementPath, findElementBySelector, escapeSelector } from '../selector.utils';

describe('selector.utils', () => {
  describe('getUniqueSelector', () => {
    it('should return #id for elements with an id', () => {
      const el = document.createElement('div');
      el.id = 'my-element';
      document.body.appendChild(el);
      expect(getUniqueSelector(el)).toBe('#my-element');
      document.body.removeChild(el);
    });

    it('should return tag.class for elements with classes', () => {
      const parent = document.createElement('div');
      const el = document.createElement('span');
      el.className = 'card highlighted';
      parent.appendChild(el);
      document.body.appendChild(parent);
      const selector = getUniqueSelector(el);
      expect(selector).toContain('span');
      expect(selector).toContain('.card');
      document.body.removeChild(parent);
    });

    it('should handle elements with no id or class', () => {
      const parent = document.createElement('div');
      const el = document.createElement('p');
      parent.appendChild(el);
      document.body.appendChild(parent);
      const selector = getUniqueSelector(el);
      expect(selector).toContain('p');
      document.body.removeChild(parent);
    });

    it('should add nth-of-type for ambiguous siblings', () => {
      const parent = document.createElement('ul');
      const li1 = document.createElement('li');
      const li2 = document.createElement('li');
      parent.appendChild(li1);
      parent.appendChild(li2);
      document.body.appendChild(parent);
      const selector = getUniqueSelector(li2);
      expect(selector).toContain(':nth-of-type(2)');
      document.body.removeChild(parent);
    });
  });

  describe('getElementPath', () => {
    it('should return an array of segment strings', () => {
      const el = document.createElement('div');
      el.id = 'test-path';
      document.body.appendChild(el);
      const path = getElementPath(el);
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
      document.body.removeChild(el);
    });

    it('should stop at an id', () => {
      const parent = document.createElement('div');
      parent.id = 'stop-here';
      const child = document.createElement('span');
      parent.appendChild(child);
      document.body.appendChild(parent);
      const path = getElementPath(child);
      expect(path[0]).toBe('#stop-here');
      document.body.removeChild(parent);
    });
  });

  describe('findElementBySelector', () => {
    it('should find an element by id selector', () => {
      const el = document.createElement('div');
      el.id = 'findme';
      document.body.appendChild(el);
      expect(findElementBySelector('#findme')).toBe(el);
      document.body.removeChild(el);
    });

    it('should return null for non-existent selector', () => {
      expect(findElementBySelector('#does-not-exist')).toBeNull();
    });

    it('should return null for invalid selector', () => {
      expect(findElementBySelector('[[[invalid')).toBeNull();
    });
  });

  describe('escapeSelector', () => {
    it('should escape special characters', () => {
      expect(escapeSelector('my.class')).toBe('my\\.class');
    });

    it('should escape colons', () => {
      expect(escapeSelector('hover:state')).toBe('hover\\:state');
    });
  });
});

/** Check if an element is a cross-origin iframe */
export function isCrossOriginIframe(element: Element): boolean {
  if (element.tagName.toLowerCase() !== 'iframe') return false;
  try {
    const iframe = element as HTMLIFrameElement;
    // Accessing contentDocument throws for cross-origin iframes
    const _doc = iframe.contentDocument;
    return _doc === null;
  } catch {
    return true;
  }
}

/** Check if an element is inside a Shadow DOM */
export function isInShadowDOM(element: Element): boolean {
  const root = element.getRootNode();
  return root instanceof ShadowRoot;
}

/** Get current scroll offset */
export function getScrollOffset(): { x: number; y: number } {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop,
  };
}

/** Check if an element belongs to PixelPerfect (overlay, editor, etc.) */
export function isPixelPerfectElement(element: Element): boolean {
  return element.closest('[data-pixelperfect]') !== null;
}

/** Get current viewport dimensions */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/** Check if an element is visible in the viewport */
export function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** Generate a unique CSS selector for a DOM element */
export function getUniqueSelector(element: Element): string {
  if (element.id) {
    return `#${escapeSelector(element.id)}`;
  }

  const path = getElementPath(element);
  return path.join(' > ');
}

/** Build an array of selector segments from html to the target element */
export function getElementPath(element: Element): string[] {
  const segments: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    let segment = current.tagName.toLowerCase();

    if (current.id) {
      segments.unshift(`#${escapeSelector(current.id)}`);
      break;
    }

    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c.length > 0)
        .slice(0, 2)
        .map((c) => `.${escapeSelector(c)}`)
        .join('');
      if (classes) {
        segment += classes;
      }
    }

    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        segment += `:nth-of-type(${index})`;
      }
    }

    segments.unshift(segment);
    current = current.parentElement;
  }

  return segments;
}

/** Find an element by CSS selector, returns null if not found */
export function findElementBySelector(selector: string): Element | null {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

/** Escape special characters in a CSS selector string */
export function escapeSelector(value: string): string {
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

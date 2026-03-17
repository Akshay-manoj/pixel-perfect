const SVG_NS = 'http://www.w3.org/2000/svg';
const FEEDBACK_DURATION = 1500;

/** Handles copying text to clipboard with visual feedback */
export class ClipboardManager {
  /** Copy text to the clipboard. Returns true on success. */
  async copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers or restricted contexts
      return this.fallbackCopy(text);
    }
  }

  /** Show a brief "Copied!" badge near the given element */
  showCopiedFeedback(nearElement: Element, label: string = 'Copied!'): void {
    const rect = nearElement.getBoundingClientRect();
    const badge = document.createElementNS(SVG_NS, 'svg');
    badge.setAttribute('data-pixelperfect', 'feedback');
    badge.style.position = 'fixed';
    badge.style.left = `${rect.left}px`;
    badge.style.top = `${rect.top - 28}px`;
    badge.style.width = '80px';
    badge.style.height = '24px';
    badge.style.pointerEvents = 'none';
    badge.style.zIndex = '2147483647';
    badge.style.overflow = 'visible';
    badge.style.transition = 'opacity 0.3s ease';
    badge.style.opacity = '1';

    badge.innerHTML = `
      <rect x="0" y="0" width="80" height="24" rx="6" fill="#22C55E" opacity="0.95"/>
      <text x="40" y="16" text-anchor="middle" fill="#FFFFFF" font-size="12"
        font-family="monospace, sans-serif" style="pointer-events:none">${label}</text>
    `;

    document.body.appendChild(badge);

    setTimeout(() => {
      badge.style.opacity = '0';
      setTimeout(() => {
        badge.remove();
      }, 300);
    }, FEEDBACK_DURATION);
  }

  private fallbackCopy(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch {
      success = false;
    }

    textarea.remove();
    return success;
  }
}

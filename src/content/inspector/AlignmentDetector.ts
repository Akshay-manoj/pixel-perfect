import type { AlignmentResult } from '@shared/types/element.types';

/** Detects shared edges and center alignment between two element rects */
export class AlignmentDetector {
  private tolerance = 2;

  /** Detect which edges and centers are aligned within tolerance */
  detect(rectA: DOMRect, rectB: DOMRect): AlignmentResult {
    const t = this.tolerance;

    const centerAX = rectA.left + rectA.width / 2;
    const centerAY = rectA.top + rectA.height / 2;
    const centerBX = rectB.left + rectB.width / 2;
    const centerBY = rectB.top + rectB.height / 2;

    return {
      alignedTop: Math.abs(rectA.top - rectB.top) <= t,
      alignedBottom: Math.abs(rectA.bottom - rectB.bottom) <= t,
      alignedLeft: Math.abs(rectA.left - rectB.left) <= t,
      alignedRight: Math.abs(rectA.right - rectB.right) <= t,
      alignedCenterX: Math.abs(centerAX - centerBX) <= t,
      alignedCenterY: Math.abs(centerAY - centerBY) <= t,
      tolerance: t,
    };
  }

  /** Update the tolerance threshold in pixels */
  setTolerance(px: number): void {
    this.tolerance = px;
  }
}

import type { DistanceMeasurement } from '@shared/types/element.types';

/** Measures pixel distances between two element bounding rects */
export class DistanceCalculator {
  /** Calculate all distance measurements between two rects */
  calculate(rectA: DOMRect, rectB: DOMRect): DistanceMeasurement {
    const top = rectB.top - rectA.bottom;
    const bottom = rectA.top - rectB.bottom;
    const left = rectB.left - rectA.right;
    const right = rectA.left - rectB.right;

    const centerAX = rectA.left + rectA.width / 2;
    const centerAY = rectA.top + rectA.height / 2;
    const centerBX = rectB.left + rectB.width / 2;
    const centerBY = rectB.top + rectB.height / 2;

    const horizontal = centerBX - centerAX;
    const vertical = centerBY - centerAY;

    const isOverlapping =
      rectA.left < rectB.right &&
      rectA.right > rectB.left &&
      rectA.top < rectB.bottom &&
      rectA.bottom > rectB.top;

    return { top, right, bottom, left, horizontal, vertical, isOverlapping };
  }

  /** Get the shortest positive edge-to-edge distance between two rects */
  getNearestEdgeDistance(rectA: DOMRect, rectB: DOMRect): number {
    const m = this.calculate(rectA, rectB);
    const distances = [m.top, m.bottom, m.left, m.right].filter((d) => d > 0);
    if (distances.length === 0) return 0;
    return Math.min(...distances);
  }
}

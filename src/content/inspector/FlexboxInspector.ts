import type { FlexboxData, FlexChildData } from '@shared/types/element.types';

/** Inspects flexbox container properties and child data */
export class FlexboxInspector {
  /** Check if an element is a flex container */
  isFlexContainer(element: Element): boolean {
    const display = window.getComputedStyle(element).display;
    return display === 'flex' || display === 'inline-flex';
  }

  /** Extract full flexbox data from a flex container */
  inspect(element: Element): FlexboxData | null {
    if (!this.isFlexContainer(element)) return null;

    const style = window.getComputedStyle(element);
    const children: FlexChildData[] = [];

    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const childStyle = window.getComputedStyle(child);
      children.push({
        element: child,
        flexGrow: parseFloat(childStyle.flexGrow) || 0,
        flexShrink: parseFloat(childStyle.flexShrink) || 1,
        flexBasis: childStyle.flexBasis || 'auto',
        order: parseInt(childStyle.order, 10) || 0,
      });
    }

    return {
      direction: style.flexDirection || 'row',
      wrap: style.flexWrap || 'nowrap',
      justifyContent: style.justifyContent || 'flex-start',
      alignItems: style.alignItems || 'stretch',
      gap: parseFloat(style.gap) || 0,
      children,
    };
  }
}

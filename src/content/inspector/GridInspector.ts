import type { GridData, GridChildData } from '@shared/types/element.types';

/** Inspects CSS Grid container properties and child placement */
export class GridInspector {
  /** Check if an element is a grid container */
  isGridContainer(element: Element): boolean {
    const display = window.getComputedStyle(element).display;
    return display === 'grid' || display === 'inline-grid';
  }

  /** Extract full grid data from a grid container */
  inspect(element: Element): GridData | null {
    if (!this.isGridContainer(element)) return null;

    const style = window.getComputedStyle(element);
    const children: GridChildData[] = [];

    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const childStyle = window.getComputedStyle(child);
      children.push({
        element: child,
        gridColumn: childStyle.gridColumn || 'auto',
        gridRow: childStyle.gridRow || 'auto',
        gridArea: childStyle.gridArea || 'auto',
      });
    }

    return {
      templateColumns: style.gridTemplateColumns || 'none',
      templateRows: style.gridTemplateRows || 'none',
      templateAreas: style.gridTemplateAreas || 'none',
      columnGap: parseFloat(style.columnGap) || 0,
      rowGap: parseFloat(style.rowGap) || 0,
      children,
    };
  }
}

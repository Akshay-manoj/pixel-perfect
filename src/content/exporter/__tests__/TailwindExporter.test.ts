import { TailwindExporter } from '../TailwindExporter';
import type { ElementInfo } from '@shared/types/element.types';

function createMockInfo(styles: Record<string, string> = {}): ElementInfo {
  return {
    element: document.createElement('div'),
    boxModel: {
      margin: { top: 16, right: 0, bottom: 0, left: 0 },
      padding: { top: 24, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 200, height: 100 },
    },
    rect: { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    computedStyles: {
      getPropertyValue: (prop: string) => styles[prop] ?? '',
      length: 0,
    } as unknown as CSSStyleDeclaration,
    selector: '.card',
    tagName: 'div',
    classList: ['card'],
  };
}

describe('TailwindExporter', () => {
  let exporter: TailwindExporter;

  beforeEach(() => {
    exporter = new TailwindExporter();
  });

  it('should map margin-top 16px to mt-4', () => {
    const result = exporter.export(createMockInfo({ 'margin-top': '16px' }));
    expect(result.code).toContain('mt-4');
  });

  it('should map padding-top 24px to pt-6', () => {
    const result = exporter.export(createMockInfo({ 'padding-top': '24px' }));
    expect(result.code).toContain('pt-6');
  });

  it('should map padding-left and padding-right', () => {
    const result = exporter.export(createMockInfo({ 'padding-left': '16px', 'padding-right': '16px' }));
    expect(result.code).toContain('pl-4');
    expect(result.code).toContain('pr-4');
  });

  it('should map border-radius 8px to rounded-lg', () => {
    const result = exporter.export(createMockInfo({ 'border-radius': '8px' }));
    expect(result.code).toContain('rounded-lg');
  });

  it('should map border-radius 9999px to rounded-full', () => {
    const result = exporter.export(createMockInfo({ 'border-radius': '9999px' }));
    expect(result.code).toContain('rounded-full');
  });

  it('should map background-color #3B82F6 to bg-blue-500', () => {
    const result = exporter.export(createMockInfo({ 'background-color': '#3B82F6' }));
    expect(result.code).toContain('bg-blue-500');
  });

  it('should map color to text- class', () => {
    const result = exporter.export(createMockInfo({ 'color': '#EF4444' }));
    expect(result.code).toContain('text-red-500');
  });

  it('should map font-weight 600 to font-semibold', () => {
    const result = exporter.export(createMockInfo({ 'font-weight': '600' }));
    expect(result.code).toContain('font-semibold');
  });

  it('should map font-size 14px to text-sm', () => {
    const result = exporter.export(createMockInfo({ 'font-size': '14px' }));
    expect(result.code).toContain('text-sm');
  });

  it('should add comment for unmapped values', () => {
    const result = exporter.export(createMockInfo({ 'gap': '37px' }));
    expect(result.code).toContain('/* no Tailwind equivalent: gap: 37px */');
  });

  it('should return format as tailwind', () => {
    const result = exporter.export(createMockInfo({ 'margin-top': '16px' }));
    expect(result.format).toBe('tailwind');
  });

  it('should map display flex', () => {
    const result = exporter.export(createMockInfo({ 'display': 'flex' }));
    expect(result.code).toContain('flex');
  });
});

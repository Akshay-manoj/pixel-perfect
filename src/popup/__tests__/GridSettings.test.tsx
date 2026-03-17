import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GridSettings } from '../components/GridSettings';

describe('GridSettings', () => {
  it('should render all preset buttons', () => {
    render(<GridSettings value={8} onChange={jest.fn()} />);
    expect(screen.getByText('4pt')).toBeTruthy();
    expect(screen.getByText('8pt')).toBeTruthy();
    expect(screen.getByText('10pt')).toBeTruthy();
    expect(screen.getByText('12pt')).toBeTruthy();
    expect(screen.getByText('16pt')).toBeTruthy();
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  it('should call onChange when a preset is clicked', () => {
    const onChange = jest.fn();
    render(<GridSettings value={8} onChange={onChange} />);
    fireEvent.click(screen.getByText('4pt'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('should highlight the selected preset', () => {
    render(<GridSettings value={8} onChange={jest.fn()} />);
    const btn = screen.getByText('8pt');
    expect(btn.style.backgroundColor).toContain('99');
  });

  it('should show custom input for non-preset values', () => {
    render(<GridSettings value={7} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Custom grid unit')).toBeTruthy();
  });

  it('should call onChange with valid custom value', () => {
    const onChange = jest.fn();
    render(<GridSettings value={7} onChange={onChange} />);
    const input = screen.getByLabelText('Custom grid unit');
    fireEvent.change(input, { target: { value: '5' } });
    expect(onChange).toHaveBeenCalledWith(5);
  });
});

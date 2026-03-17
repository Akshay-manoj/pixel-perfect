import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportFormatSelector } from '../components/ExportFormatSelector';

describe('ExportFormatSelector', () => {
  it('should render all format buttons', () => {
    render(<ExportFormatSelector value="css" onChange={jest.fn()} />);
    expect(screen.getByText('CSS')).toBeTruthy();
    expect(screen.getByText('SCSS')).toBeTruthy();
    expect(screen.getByText('SASS')).toBeTruthy();
    expect(screen.getByText('Tailwind')).toBeTruthy();
  });

  it('should call onChange when a format is clicked', () => {
    const onChange = jest.fn();
    render(<ExportFormatSelector value="css" onChange={onChange} />);
    fireEvent.click(screen.getByText('SCSS'));
    expect(onChange).toHaveBeenCalledWith('scss');
  });

  it('should highlight the selected format', () => {
    render(<ExportFormatSelector value="tailwind" onChange={jest.fn()} />);
    const btn = screen.getByText('Tailwind');
    expect(btn.style.backgroundColor).toContain('99');
  });

  it('should render the label', () => {
    render(<ExportFormatSelector value="css" onChange={jest.fn()} />);
    expect(screen.getByText('EXPORT FORMAT')).toBeTruthy();
  });
});

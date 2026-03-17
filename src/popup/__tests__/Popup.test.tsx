import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popup } from '../Popup';

// Mock chrome API
const mockSendMessage = jest.fn();
const mockStorageGet = jest.fn();
const mockStorageSet = jest.fn();
const mockTabsQuery = jest.fn();

beforeAll(() => {
  (global as any).chrome = {
    storage: {
      sync: {
        get: mockStorageGet,
        set: mockStorageSet,
      },
    },
    tabs: {
      query: mockTabsQuery,
      sendMessage: mockSendMessage,
    },
    runtime: {
      lastError: null,
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockStorageGet.mockImplementation((_key: string, cb: (result: any) => void) => {
    cb({});
  });
  mockTabsQuery.mockImplementation((_opts: any, cb: (tabs: any[]) => void) => {
    cb([{ id: 1 }]);
  });
});

describe('Popup', () => {
  it('should render the PixelPerfect header', () => {
    render(<Popup />);
    expect(screen.getByText('PixelPerfect')).toBeTruthy();
  });

  it('should render the toggle switch', () => {
    render(<Popup />);
    expect(screen.getByRole('switch')).toBeTruthy();
  });

  it('should render grid unit section', () => {
    render(<Popup />);
    expect(screen.getByText('GRID UNIT')).toBeTruthy();
  });

  it('should render export format section', () => {
    render(<Popup />);
    expect(screen.getByText('EXPORT FORMAT')).toBeTruthy();
  });

  it('should render overlay section', () => {
    render(<Popup />);
    expect(screen.getByText('OVERLAY')).toBeTruthy();
  });

  it('should render accessibility section', () => {
    render(<Popup />);
    expect(screen.getByText('ACCESSIBILITY')).toBeTruthy();
  });

  it('should render design tokens section', () => {
    render(<Popup />);
    expect(screen.getByText('DESIGN TOKENS')).toBeTruthy();
  });

  it('should render shortcuts section', () => {
    render(<Popup />);
    expect(screen.getByText('SHORTCUTS')).toBeTruthy();
  });

  it('should render about section with version', () => {
    render(<Popup />);
    expect(screen.getByText('v1.0.0')).toBeTruthy();
  });

  it('should send toggle message when switch is clicked', () => {
    render(<Popup />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockSendMessage).toHaveBeenCalled();
  });
});

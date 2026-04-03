import { renderHook, act } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { useResponsive } from '../utils/useResponsive';

// Mock Dimensions
const mockAddEventListener = jest.fn();
const mockRemove = jest.fn();

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn(),
  },
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

beforeEach(() => {
  jest.clearAllMocks();
  mockDimensions.addEventListener.mockReturnValue({ remove: mockRemove });
});

describe('useResponsive', () => {
  it('returns isSmallScreen=true for width < 380', () => {
    mockDimensions.get.mockReturnValue({ width: 360, height: 780 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isSmallScreen).toBe(true);
    expect(result.current.isMediumScreen).toBe(false);
    expect(result.current.isLargeScreen).toBe(false);
  });

  it('returns isMediumScreen=true for width = 380', () => {
    mockDimensions.get.mockReturnValue({ width: 380, height: 820 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isSmallScreen).toBe(false);
    expect(result.current.isMediumScreen).toBe(true);
    expect(result.current.isLargeScreen).toBe(false);
  });

  it('returns isMediumScreen=true for width = 414', () => {
    mockDimensions.get.mockReturnValue({ width: 414, height: 896 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isSmallScreen).toBe(false);
    expect(result.current.isMediumScreen).toBe(true);
    expect(result.current.isLargeScreen).toBe(false);
  });

  it('returns isLargeScreen=true for width > 414', () => {
    mockDimensions.get.mockReturnValue({ width: 430, height: 932 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isSmallScreen).toBe(false);
    expect(result.current.isMediumScreen).toBe(false);
    expect(result.current.isLargeScreen).toBe(true);
  });

  it('returns width and height', () => {
    mockDimensions.get.mockReturnValue({ width: 390, height: 844 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.width).toBe(390);
    expect(result.current.height).toBe(844);
  });

  it('uses fallback dimensions when Dimensions returns 0', () => {
    mockDimensions.get.mockReturnValue({ width: 0, height: 0 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.width).toBe(375);
    expect(result.current.height).toBe(812);
    // 375 < 380 → isSmallScreen
    expect(result.current.isSmallScreen).toBe(true);
  });

  it('exactly one of the screen flags is true at any time', () => {
    const widths = [320, 375, 380, 400, 414, 415, 430, 768];
    widths.forEach((w) => {
      mockDimensions.get.mockReturnValue({ width: w, height: 800 });
      const { result } = renderHook(() => useResponsive());
      const { isSmallScreen, isMediumScreen, isLargeScreen } = result.current;
      const trueCount = [isSmallScreen, isMediumScreen, isLargeScreen].filter(Boolean).length;
      expect(trueCount).toBe(1);
    });
  });

  it('registers a Dimensions change listener on mount', () => {
    mockDimensions.get.mockReturnValue({ width: 390, height: 844 });
    renderHook(() => useResponsive());
    expect(mockDimensions.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('removes the listener on unmount', () => {
    mockDimensions.get.mockReturnValue({ width: 390, height: 844 });
    const { unmount } = renderHook(() => useResponsive());
    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });

  it('updates flags when orientation changes', () => {
    mockDimensions.get.mockReturnValue({ width: 390, height: 844 });
    let changeCallback: (event: { window: { width: number; height: number } }) => void;
    mockDimensions.addEventListener.mockImplementation((_event, cb) => {
      changeCallback = cb;
      return { remove: mockRemove };
    });

    const { result } = renderHook(() => useResponsive());
    expect(result.current.isLargeScreen).toBe(false);

    act(() => {
      changeCallback({ window: { width: 844, height: 390 } });
    });

    expect(result.current.isLargeScreen).toBe(true);
    expect(result.current.width).toBe(844);
    expect(result.current.height).toBe(390);
  });
});

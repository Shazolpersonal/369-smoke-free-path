import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/**
 * Responsive flags based on screen width.
 * Validates: Requirements 11.1
 */
export interface ResponsiveFlags {
  isSmallScreen: boolean;   // width < 380
  isMediumScreen: boolean;  // 380 ≤ width ≤ 414
  isLargeScreen: boolean;   // width > 414
  width: number;
  height: number;
}

function getFlags(width: number, height: number): ResponsiveFlags {
  // Fallback: if Dimensions returns 0, use default dimensions
  const w = width || 375;
  const h = height || 812;

  return {
    isSmallScreen: w < 380,
    isMediumScreen: w >= 380 && w <= 414,
    isLargeScreen: w > 414,
    width: w,
    height: h,
  };
}

export function useResponsive(): ResponsiveFlags {
  const [flags, setFlags] = useState<ResponsiveFlags>(() => {
    const { width, height } = Dimensions.get('window');
    return getFlags(width, height);
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setFlags(getFlags(window.width, window.height));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return flags;
}

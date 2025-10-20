interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  borderRadius?: string;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = '16px', 
  style = {},
  borderRadius = '4px'
}: SkeletonLoaderProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

// Add keyframes for shimmer animation
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;
  
  try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  } catch (e) {
    // Rule might already exist
  }
}


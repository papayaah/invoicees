// Common styles used across invoice components

export const commonStyles = {
  // Label styles - consistent across all components
  label: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    marginBottom: '12px',
  },

  // Content styles - consistent across all components  
  content: {
    fontSize: '14px',
    lineHeight: '1.8',
  },

  // Field styles - consistent across all components
  field: {
    marginBottom: '8px',
  },

  // Input styles - consistent across all components
  input: {
    border: 'none',
    background: 'transparent',
    padding: '2px 4px',
    margin: '-2px -4px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    transition: 'background 0.15s ease',
  },

  // Placeholder styles - consistent across all components
  placeholder: {
    color: '#a0aec0',
    opacity: 0.7,
    fontStyle: 'italic',
  },

  // Container styles - base styles that can be extended
  container: {
    marginBottom: '20px',
  },
};

// Helper function to merge common styles with component-specific styles
export function mergeStyles<T extends Record<string, any>>(
  common: Partial<T>,
  specific: Partial<T> = {}
): T {
  const result = { ...common } as T;
  
  for (const key in specific) {
    if (specific[key]) {
      result[key] = { ...result[key], ...specific[key] };
    }
  }
  
  return result;
}

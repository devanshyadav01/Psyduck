import React from 'react';

interface FloatingContainerProps {
  children: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offset?: number;
  zIndex?: number;
}

export const FloatingContainer: React.FC<FloatingContainerProps> = React.memo(({
  children,
  position = 'bottom-right',
  offset = 16,
  zIndex = 50
}) => {
  const positionClasses = {
    'bottom-right': `bottom-${offset/4} right-${offset/4}`,
    'bottom-left': `bottom-${offset/4} left-${offset/4}`,
    'top-right': `top-${offset/4} right-${offset/4}`,
    'top-left': `top-${offset/4} left-${offset/4}`
  };

  const dynamicStyles = {
    position: 'fixed' as const,
    bottom: position.includes('bottom') ? `${offset}px` : undefined,
    top: position.includes('top') ? `${offset}px` : undefined,
    right: position.includes('right') ? `${offset}px` : undefined,
    left: position.includes('left') ? `${offset}px` : undefined,
    zIndex: zIndex,
    pointerEvents: 'none' as const,
  };

  return (
    <div
      style={dynamicStyles}
      className="floating-container will-change-transform gpu-accelerated"
    >
      <div style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
});

FloatingContainer.displayName = 'FloatingContainer';

export default FloatingContainer;
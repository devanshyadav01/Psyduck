import React, { useState, useEffect, useCallback } from 'react';

interface FloatingElement {
  id: string;
  component: React.ReactNode;
  priority: number;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: { width: number; height: number };
  visible: boolean;
}

interface FloatingElementsManagerProps {
  children: React.ReactNode;
}

export const FloatingElementsManager: React.FC<FloatingElementsManagerProps> = React.memo(({ children }) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // Update screen size on resize
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Calculate optimal positions for floating elements
  const calculatePositions = useCallback((elements: FloatingElement[]) => {
    const positions: Record<string, { bottom: number; right: number; zIndex: number }> = {};
    const spacing = 16; // 1rem spacing
    const edgeOffset = 16; // 1rem from edges

    // Sort by priority (higher priority gets better position)
    const sortedElements = elements
      .filter(el => el.visible)
      .sort((a, b) => b.priority - a.priority);

    let currentBottomOffset = edgeOffset;
    let currentRightOffset = edgeOffset;

    sortedElements.forEach((element, index) => {
      positions[element.id] = {
        bottom: currentBottomOffset,
        right: currentRightOffset,
        zIndex: 1000 - index // Higher priority gets higher z-index
      };

      // Stack elements vertically if they would overlap
      if (element.position === 'bottom-right') {
        // Check if there's room horizontally for the next element
        const nextElementWidth = sortedElements[index + 1]?.size.width || 0;
        const remainingWidth = screenSize.width - (currentRightOffset + element.size.width + spacing + nextElementWidth);
        
        if (remainingWidth > edgeOffset && index < sortedElements.length - 1) {
          // Place next element to the left
          currentRightOffset += element.size.width + spacing;
        } else {
          // Stack vertically
          currentBottomOffset += element.size.height + spacing;
          currentRightOffset = edgeOffset;
        }
      }
    });

    return positions;
  }, [screenSize]);

  // Register floating element
  const registerElement = useCallback((element: FloatingElement) => {
    setElements(prev => {
      const existing = prev.find(el => el.id === element.id);
      if (existing) {
        return prev.map(el => el.id === element.id ? element : el);
      }
      return [...prev, element];
    });
  }, []);

  // Unregister floating element
  const unregisterElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  }, []);

  // Update element visibility
  const updateElementVisibility = useCallback((id: string, visible: boolean) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, visible } : el
    ));
  }, []);

  const positions = calculatePositions(elements);

  return (
    <>
      {children}
      
      {/* Render floating elements with calculated positions */}
      {elements.filter(el => el.visible).map(element => {
        const position = positions[element.id];
        if (!position) return null;

        return (
          <div
            key={element.id}
            className="floating-container prevent-move"
            style={{
              position: 'fixed',
              bottom: `${position.bottom}px`,
              right: `${position.right}px`,
              zIndex: position.zIndex,
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              {element.component}
            </div>
          </div>
        );
      })}
    </>
  );
});

FloatingElementsManager.displayName = 'FloatingElementsManager';

// Hook for registering floating elements
export const useFloatingElement = (
  id: string,
  component: React.ReactNode,
  options: {
    priority?: number;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size?: { width: number; height: number };
    visible?: boolean;
  } = {}
) => {
  const {
    priority = 0,
    position = 'bottom-right',
    size = { width: 80, height: 80 },
    visible = true
  } = options;

  useEffect(() => {
    // This would connect to the FloatingElementsManager context in a real implementation
    // For now, this is a placeholder for the hook interface
    console.log(`Registering floating element: ${id}`);
    
    return () => {
      console.log(`Unregistering floating element: ${id}`);
    };
  }, [id, component, priority, position, size, visible]);

  return {
    updateVisibility: (isVisible: boolean) => {
      console.log(`Updating visibility for ${id}: ${isVisible}`);
    }
  };
};

export default FloatingElementsManager;
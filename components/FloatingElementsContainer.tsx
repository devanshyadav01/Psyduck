import React, { Suspense } from 'react';

// Lazy load floating components
const FloatingChatbot = React.lazy(() => 
  import('./FloatingChatbot').then(module => ({ 
    default: module.FloatingChatbot 
  })).catch(() => ({ 
    default: () => null 
  }))
);

const ContentCreatorFloatingButton = React.lazy(() => 
  import('./ContentCreatorFloatingButton').then(module => ({ 
    default: module.ContentCreatorFloatingButton 
  })).catch(() => ({ 
    default: () => null 
  }))
);

const BackButton = React.lazy(() => 
  import('./BackButton').then(module => ({ 
    default: module.BackButton 
  })).catch(() => ({ 
    default: () => null 
  }))
);

export const FloatingElementsContainer: React.FC = () => {
  return (
    <div className="floating-elements-root">
      {/* Back Button - Top Left */}
      <div className="floating-element floating-top-left z-floating-high">
        <Suspense fallback={null}>
          <BackButton />
        </Suspense>
      </div>

      {/* Content Creator Button - Bottom Right (above chatbot) */}
      <div className="floating-element floating-bottom-right-stacked z-floating-medium">
        <Suspense fallback={null}>
          <ContentCreatorFloatingButton />
        </Suspense>
      </div>

      {/* Floating Chatbot - Bottom Right */}
      <div className="floating-element floating-bottom-right z-floating-base">
        <Suspense fallback={null}>
          <FloatingChatbot />
        </Suspense>
      </div>
    </div>
  );
};

export default FloatingElementsContainer;
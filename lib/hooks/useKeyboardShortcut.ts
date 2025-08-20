import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
  target?: HTMLElement | Document;
}

export function useKeyboardShortcut(
  keys: string | string[],
  callback: () => void,
  options: UseKeyboardShortcutOptions = {}
): void {
  const {
    preventDefault = true,
    stopPropagation = false,
    enabled = true,
    target = typeof document !== 'undefined' ? document : null,
  } = options;

  const keyArray = Array.isArray(keys) ? keys : [keys];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the key combination matches
      const matchesKey = keyArray.some(key => {
        const parts = key.toLowerCase().split('+');
        const keyPart = parts[parts.length - 1];
        const modifiers = parts.slice(0, -1);

        const keyMatches = event.key.toLowerCase() === keyPart || 
                          event.code.toLowerCase() === keyPart.replace(/key|digit/, '');

        const modifiersMatch = modifiers.every(modifier => {
          switch (modifier) {
            case 'ctrl':
            case 'control':
              return event.ctrlKey;
            case 'cmd':
            case 'meta':
              return event.metaKey;
            case 'alt':
              return event.altKey;
            case 'shift':
              return event.shiftKey;
            default:
              return false;
          }
        });

        return keyMatches && modifiersMatch;
      });

      if (matchesKey) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        
        // Don't trigger if user is typing in an input field
        const activeElement = document.activeElement;
        const isTyping = activeElement instanceof HTMLInputElement ||
                        activeElement instanceof HTMLTextAreaElement ||
                        (activeElement as HTMLElement)?.isContentEditable;

        if (!isTyping) {
          callback();
        }
      }
    },
    [keyArray, callback, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (!enabled || !target) return;

    target.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, enabled, target]);
}
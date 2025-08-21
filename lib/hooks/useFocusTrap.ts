import { useEffect, useRef } from 'react';
import { trapFocus } from '../utils/accessibility';

export function useFocusTrap(enabled: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [enabled]);

  return ref;
}
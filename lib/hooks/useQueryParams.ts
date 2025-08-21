import { useState, useEffect, useCallback } from 'react';

export function useQueryParams() {
  const [params, setParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const updateParams = useCallback((key: string, value: string | null) => {
    const newParams = new URLSearchParams(params);
    
    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setParams(newParams);
    
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [params]);

  const getParam = useCallback((key: string): string | null => {
    return params.get(key);
  }, [params]);

  useEffect(() => {
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    params,
    getParam,
    updateParams,
    toString: () => params.toString(),
  };
}
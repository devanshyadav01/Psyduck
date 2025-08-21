/**
 * Utility functions for validation
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateFormField = (
  value: string,
  type: 'email' | 'password' | 'username' | 'url' | 'required'
): { isValid: boolean; message?: string } => {
  if (type === 'required' && !value.trim()) {
    return { isValid: false, message: 'This field is required' };
  }

  switch (type) {
    case 'email':
      return isValidEmail(value)
        ? { isValid: true }
        : { isValid: false, message: 'Please enter a valid email address' };
    
    case 'password':
      return isValidPassword(value)
        ? { isValid: true }
        : { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, and number' };
    
    case 'username':
      return isValidUsername(value)
        ? { isValid: true }
        : { isValid: false, message: 'Username must be 3-20 characters, alphanumeric and underscores only' };
    
    case 'url':
      return value === '' || isValidUrl(value)
        ? { isValid: true }
        : { isValid: false, message: 'Please enter a valid URL' };
    
    default:
      return { isValid: true };
  }
};
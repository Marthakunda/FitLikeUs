/**
 * Firebase Error Mapping Utility
 * Maps Firebase error codes to user-friendly messages
 */

export const mapFirebaseError = (error: Error | any): string => {
  const errorCode = error?.code || error?.message || '';
  const errorMessage = error?.message || '';

  // Firebase authentication error codes
  const errorMap: Record<string, string> = {
    // Auth errors
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in or use a different email.',
    'auth/weak-password': 'Password is too weak. It must be at least 8 characters with uppercase, lowercase, number, and special character.',
    'auth/invalid-password': 'Password is too weak. It must be at least 8 characters with uppercase, lowercase, number, and special character.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
    'auth/invalid-continue-uri': 'Invalid URL. Please check the link and try again.',
    'auth/missing-android-pkg-name': 'Android package name is missing.',
    'auth/missing-continue-uri': 'Continue URL is required.',
    'auth/missing-ios-bundle-id': 'iOS bundle ID is missing.',
    'auth/invalid-api-key': 'An API key error occurred. Please contact support.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/session-cookie-expired': 'Your session has expired. Please sign in again.',
    'auth/uid-already-exists': 'This user ID already exists.',
    'auth/invalid-hash-algorithm': 'Invalid hash algorithm.',
    'auth/invalid-hash-key': 'Invalid hash key.',
    'auth/missing-hash-algorithm': 'Hash algorithm is required.',

    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'failed-precondition': 'The operation failed due to a precondition. Please try again.',
    'internal': 'An internal error occurred. Please try again later.',
    'unavailable': 'The service is temporarily unavailable. Please try again later.',
    'unauthenticated': 'You are not authenticated. Please sign in and try again.',
  };

  // Direct lookup
  if (errorMap[errorCode]) {
    return errorMap[errorCode];
  }

  // Check if error message contains known patterns
  if (errorMessage.includes('Firebase')) {
    return 'An error occurred. Please check your internet connection and try again.';
  }

  // Default fallback message
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Validates password strength
 * Returns validation result and list of failed requirements
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  score: number; // 0-5 score
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
      score: 0,
    };
  }

  // Check minimum length (8 characters)
  if (password.length >= 8) {
    score++;
  } else {
    errors.push('At least 8 characters');
  }

  // Check uppercase letter
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    errors.push('One uppercase letter (A-Z)');
  }

  // Check lowercase letter
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    errors.push('One lowercase letter (a-z)');
  }

  // Check number
  if (/\d/.test(password)) {
    score++;
  } else {
    errors.push('One number (0-9)');
  }

  // Check special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    errors.push('One special character (!@#$%^&* etc.)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score,
  };
};

/**
 * Validates password match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

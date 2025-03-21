/**
 * Utility functions for authentication
 */

/**
 * Check if the user is logged in by looking for the accessToken cookie
 * @returns boolean indicating if the user is logged in
 */
export const isLoggedIn = (): boolean => {
  // Get all cookies
  const cookies = document.cookie.split(';');

  // Look for the accessToken cookie
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken' && value) {
      return true;
    }
  }

  return false;
};

/**
 * Get the access token from cookies
 * @returns the access token or null if not found
 */
export const getAccessToken = (): string | null => {
  // Get all cookies
  const cookies = document.cookie.split(';');

  // Look for the accessToken cookie
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return value;
    }
  }

  return null;
};

/**
 * Clear the authentication cookies
 */
export const logout = (): void => {
  document.cookie = 'accessToken=; path=/; max-age=0';
};

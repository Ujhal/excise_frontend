import { Injectable } from '@angular/core';

/**
 * Service for managing navigation state (like storing and retrieving the previous URL).
 * Useful for redirecting users back to where they came from after login, etc.
 */
@Injectable({ providedIn: 'root' })
export class StateStorageService {
  // Key used to store and retrieve the previous URL in sessionStorage
  private previousUrlKey = 'previousUrl';

  /**
   * Stores the provided URL string in sessionStorage.
   * This helps in preserving the user's last visited route.
   * 
   * @param url - The URL to store
   */
  storeUrl(url: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.previousUrlKey, JSON.stringify(url));
    } else {
      console.warn('sessionStorage is not available');
    }
  }

  /**
   * Retrieves the previously stored URL from sessionStorage.
   * 
   * @returns The stored URL string or null if not found
   */
  getUrl(): string | null {
    const previousUrl = sessionStorage.getItem(this.previousUrlKey);
    return previousUrl ? (JSON.parse(previousUrl) as string | null) : previousUrl;
  }

  /**
   * Clears the stored URL from sessionStorage.
   * Useful after a redirect is completed.
   */
  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }
}

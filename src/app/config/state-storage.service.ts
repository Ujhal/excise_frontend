import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousUrlKey = 'previousUrl';
 
  storeUrl(url: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.previousUrlKey, JSON.stringify(url));
    } else {
      console.warn('sessionStorage is not available');
    }
  }

  getUrl(): string | null {
    const previousUrl = sessionStorage.getItem(this.previousUrlKey);
    return previousUrl ? (JSON.parse(previousUrl) as string | null) : previousUrl;
  }

  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }

 
}

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private readonly trackingUrl = `${environment.apiUrl}/tracking/click`;
  private sessionId: string | null = null;

  trackListingClick(carId: number): void {
    const payload = JSON.stringify({
      carId,
      sessionId: this.getSessionId(),
    });

    // sendBeacon fires in the background and survives page navigation
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(this.trackingUrl, blob);
    } else {
      // Fallback for older browsers
      fetch(this.trackingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently ignore tracking failures — never block UX
      });
    }
  }

  private getSessionId(): string {
    if (this.sessionId) return this.sessionId;

    let stored = sessionStorage.getItem('ahks_session_id');
    if (!stored) {
      stored = crypto.randomUUID();
      sessionStorage.setItem('ahks_session_id', stored);
    }
    this.sessionId = stored;
    return stored;
  }
}

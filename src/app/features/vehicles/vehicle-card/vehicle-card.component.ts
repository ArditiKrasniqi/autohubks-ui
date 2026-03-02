import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { CarResponse } from '@shared/interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card group cursor-pointer flex flex-col h-full" (click)="openListing($event)">
      <!-- Thumbnail -->
      <div class="relative overflow-hidden" style="height: 210px;">
        @if (car.thumbnailUrl) {
          <img
            [src]="car.thumbnailUrl"
            [alt]="car.make + ' ' + car.model"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        } @else {
          <div class="flex items-center justify-center h-full" style="background: #F5F5F5;">
            <svg class="w-12 h-12" style="color: #C0C0C0;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        }

        <!-- Source badge -->
        <span [class]="'source-badge ' + getSourceBadgeClass(car.sourceWebsite)">
          {{ formatSource(car.sourceWebsite) }}
        </span>
      </div>

      <!-- Info -->
      <div class="p-5 space-y-3 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-bold text-base truncate" style="color: #121212; letter-spacing: -0.01em;">
              {{ car.make }} {{ car.model }}
            </h3>
            <p class="text-sm font-medium" style="color: #9E9E9E;">{{ car.year }}</p>
          </div>
          <p class="font-extrabold text-lg shrink-0" style="color: #FF6B2B; letter-spacing: -0.02em;">
            &euro;{{ car.price | number:'1.0-0' }}
          </p>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <span class="spec-chip">{{ car.mileage | number:'1.0-0' }} km</span>
          <span class="spec-chip">{{ car.fuelType }}</span>
          <span class="spec-chip">{{ car.location }}</span>
        </div>

        <a [href]="car.originalListingUrl"
           target="_blank"
           rel="nofollow noopener noreferrer"
           (click)="$event.stopPropagation()"
           class="btn-primary block text-center text-sm mt-auto pt-3">
          View Original Listing
        </a>
      </div>
    </article>
  `,
})
export class VehicleCardComponent {
  @Input({ required: true }) car!: CarResponse;

  getSourceBadgeClass(source: string): string {
    switch (source) {
      case 'KOREA_AUTO_IMPORTS': return 'source-badge-korea';
      case 'AUTOKOREA_KOSOVA': return 'source-badge-autokorea';
      case 'LUXURY_CARS_KOSOVA': return 'source-badge-luxury';
      case 'TRIO_VETURA': return 'source-badge-trio';
      default: return 'source-badge-default';
    }
  }

  openListing(event: MouseEvent): void {
    if (this.car.originalListingUrl) {
      window.open(this.car.originalListingUrl, '_blank', 'noopener,noreferrer');
    }
  }

  formatSource(source: string): string {
    switch (source) {
      case 'KOREA_AUTO_IMPORTS': return 'Korea Auto';
      case 'AUTOKOREA_KOSOVA': return 'AutoKorea';
      case 'LUXURY_CARS_KOSOVA': return 'Luxury Cars';
      case 'TRIO_VETURA': return 'TrioVetura';
      default: return source;
    }
  }
}

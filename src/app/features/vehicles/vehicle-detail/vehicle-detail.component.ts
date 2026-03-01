import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, finalize } from 'rxjs';

import { VehicleService } from '../services/vehicle.service';
import { CarDetailResponse } from '@shared/interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Back link -->
      <a routerLink="/vehicles" class="back-link inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </a>

      @if (loading()) {
        <div class="space-y-6">
          <div class="skeleton h-80 w-full"></div>
          <div class="skeleton h-8 w-1/2"></div>
          <div class="skeleton h-6 w-1/4"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="skeleton h-12"></div>
            <div class="skeleton h-12"></div>
            <div class="skeleton h-12"></div>
            <div class="skeleton h-12"></div>
          </div>
        </div>
      } @else if (error()) {
        <div class="text-center py-16">
          <p class="text-lg font-bold" style="color: #121212;">Vehicle not found</p>
          <p class="text-sm mt-1" style="color: #9E9E9E;">This listing may have been removed.</p>
          <a routerLink="/vehicles" class="btn-primary inline-block mt-5">Browse Listings</a>
        </div>
      } @else if (car()) {
        <div class="space-y-8">
          <!-- Image Gallery -->
          <div class="relative rounded-3xl overflow-hidden" style="background: #F5F5F5;">
            @if (car()!.imageUrls.length) {
              <img
                [src]="car()!.imageUrls[activeImage()]"
                [alt]="car()!.make + ' ' + car()!.model"
                class="w-full h-[420px] object-cover"
              />

              @if (car()!.imageUrls.length > 1) {
                <!-- Navigation arrows -->
                <button
                  (click)="prevImage()"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-white rounded-full p-2.5 transition-all"
                  style="background: rgba(18,18,18,0.6); backdrop-filter: blur(8px);">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  (click)="nextImage()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-white rounded-full p-2.5 transition-all"
                  style="background: rgba(18,18,18,0.6); backdrop-filter: blur(8px);">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Dot indicators -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full"
                     style="background: rgba(18,18,18,0.5); backdrop-filter: blur(8px);">
                  @for (img of car()!.imageUrls; track img; let i = $index) {
                    <button
                      (click)="activeImage.set(i)"
                      [class]="'w-2 h-2 rounded-full transition-all ' +
                        (i === activeImage() ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60')">
                    </button>
                  }
                </div>
              }
            } @else {
              <div class="flex items-center justify-center h-[420px]" style="color: #C0C0C0;">
                <svg class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            }
          </div>

          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold tracking-tight" style="color: #121212;">
                {{ car()!.make }} {{ car()!.model }}
                <span class="font-normal" style="color: #9E9E9E;">{{ car()!.year }}</span>
              </h1>
              <p class="text-sm mt-1" style="color: #9E9E9E;">
                Listed on {{ car()!.sourceWebsite }}
              </p>
            </div>
            <p class="text-3xl font-extrabold whitespace-nowrap" style="color: #FF6B2B; letter-spacing: -0.02em;">
              &euro;{{ car()!.price | number:'1.0-0' }}
            </p>
          </div>

          <!-- Specs grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
              <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Mileage</p>
              <p class="font-bold mt-1" style="color: #121212;">{{ car()!.mileage | number:'1.0-0' }} km</p>
            </div>
            <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
              <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Fuel Type</p>
              <p class="font-bold mt-1" style="color: #121212;">{{ car()!.fuelType }}</p>
            </div>
            <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
              <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Transmission</p>
              <p class="font-bold mt-1" style="color: #121212;">{{ car()!.transmission }}</p>
            </div>
            <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
              <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Color</p>
              <p class="font-bold mt-1" style="color: #121212;">{{ car()!.color }}</p>
            </div>
            <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
              <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Location</p>
              <p class="font-bold mt-1" style="color: #121212;">{{ car()!.location }}</p>
            </div>
            @if (car()!.numberOfSeats) {
              <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
                <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Seats</p>
                <p class="font-bold mt-1" style="color: #121212;">{{ car()!.numberOfSeats }}</p>
              </div>
            }
            @if (car()!.numberOfAccidents !== null && car()!.numberOfAccidents !== undefined) {
              <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
                <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Accidents</p>
                <p class="font-bold mt-1" style="color: #121212;">{{ car()!.numberOfAccidents }}</p>
              </div>
            }
            @if (car()!.phoneContact) {
              <div class="rounded-2xl p-4" style="background: #FAFAFA; border: 1px solid rgba(0,0,0,0.04);">
                <p class="text-xs font-semibold uppercase" style="color: #9E9E9E; letter-spacing: 0.08em;">Contact</p>
                <p class="font-bold mt-1" style="color: #121212;">{{ car()!.phoneContact }}</p>
              </div>
            }
          </div>

          <!-- Description -->
          @if (car()!.description) {
            <div>
              <h2 class="font-bold mb-3" style="color: #121212;">Description</h2>
              <p class="text-sm leading-relaxed whitespace-pre-line" style="color: #616161;">{{ car()!.description }}</p>
            </div>
          }

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6" style="border-top: 1px solid rgba(0,0,0,0.06);">
            <a
              [href]="car()!.originalListingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary text-center">
              View Original Listing
            </a>
            <a routerLink="/vehicles"
               class="text-center px-6 py-3 rounded-2xl font-semibold text-sm transition-all"
               style="background: #F5F5F5; color: #616161; border: 1px solid #E0E0E0;">
              Back to Listings
            </a>
          </div>
        </div>
      }
    </div>
  `,
})
export class VehicleDetailComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly car = signal<CarDetailResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly activeImage = signal(0);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.error.set(false);
          return this.vehicleService.getCarById(+params['id']);
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (car) => {
          this.car.set(car);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  nextImage(): void {
    const images = this.car()?.imageUrls;
    if (images) {
      this.activeImage.update((i) => (i + 1) % images.length);
    }
  }

  prevImage(): void {
    const images = this.car()?.imageUrls;
    if (images) {
      this.activeImage.update((i) => (i - 1 + images.length) % images.length);
    }
  }
}

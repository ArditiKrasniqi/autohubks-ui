import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { VehicleService } from '../vehicles/services/vehicle.service';
import { VehicleCardComponent } from '../vehicles/vehicle-card/vehicle-card.component';
import { LoadingSkeletonComponent } from '@shared/components/loading-skeleton/loading-skeleton.component';
import { CarResponse } from '@shared/interfaces/vehicle.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section class="hero-luxury text-white">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h1 class="hero-headline">
            Korea's <span class="accent">Finest.</span><br/>
            Kosovo's Choice.
          </h1>
          <p class="hero-subtitle">
            Premium Korean imports, curated from trusted sources. Zero hassle.
          </p>
        </div>

        <!-- Glassmorphism Search -->
        <div class="search-glass max-w-4xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block mb-1.5">Make</label>
              <select class="input-field" [(ngModel)]="searchMake"
                      (ngModelChange)="onSearchMakeChange($event)">
                <option value="">All Makes</option>
                @for (make of makes(); track make) {
                  <option [value]="make">{{ make }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block mb-1.5" style="color: #9E9E9E; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Model</label>
              <select class="input-field" [(ngModel)]="searchModel"
                      [disabled]="!searchMake">
                <option value="">All Models</option>
                @for (model of models(); track model) {
                  <option [value]="model">{{ model }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block mb-1.5" style="color: #9E9E9E; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Min Price</label>
              <input type="number" class="input-field" placeholder="€ Min"
                     [(ngModel)]="searchPriceFrom" />
            </div>
            <div>
              <label class="block mb-1.5" style="color: #9E9E9E; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Max Price</label>
              <input type="number" class="input-field" placeholder="€ Max"
                     [(ngModel)]="searchPriceTo" />
            </div>
          </div>
          <div class="flex justify-center sm:justify-end mt-5">
            <button (click)="onSearch()" class="btn-primary w-full sm:w-auto">
              Search Vehicles
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Listings -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-bold tracking-tight" style="color: #121212;">Latest Listings</h2>
          <p class="text-sm mt-0.5" style="color: #9E9E9E;">Fresh imports from our trusted sources</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            (click)="filterBySource('')"
            [class]="activeSource === '' ? 'filter-pill filter-pill-active' : 'filter-pill'">
            All
          </button>
          <button
            (click)="filterBySource('KOREA_AUTO_IMPORTS')"
            [class]="activeSource === 'KOREA_AUTO_IMPORTS' ? 'filter-pill filter-pill-active' : 'filter-pill'">
            Korea Auto Imports
          </button>
          <button
            (click)="filterBySource('AUTOKOREA_KOSOVA')"
            [class]="activeSource === 'AUTOKOREA_KOSOVA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
            AutoKorea Kosova
          </button>
          <button
            (click)="filterBySource('LUXURY_CARS_KOSOVA')"
            [class]="activeSource === 'LUXURY_CARS_KOSOVA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
            Luxury Cars Kosova
          </button>
          <button
            (click)="filterBySource('TRIO_VETURA')"
            [class]="activeSource === 'TRIO_VETURA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
            TrioVetura
          </button>
          <a (click)="onSearch()" class="ml-2 text-sm font-semibold cursor-pointer transition-colors" style="color: #FF6B2B;">
            View all &rarr;
          </a>
        </div>
      </div>

      @if (loading()) {
        <app-loading-skeleton [count]="6" />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          @for (car of latestCars(); track car.id) {
            <app-vehicle-card [car]="car" />
          }
        </div>

        @if (activeSource && totalPages() > 1) {
          <div class="flex items-center justify-center gap-3 mt-10">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 0"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style="background: #EEEEEE; color: #616161;">
              Previous
            </button>
            <span class="text-sm font-medium px-3" style="color: #9E9E9E;">
              Page {{ currentPage() + 1 }} of {{ totalPages() }}
            </span>
            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() + 1 >= totalPages()"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style="background: #EEEEEE; color: #616161;">
              Next
            </button>
          </div>
        }
      }
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly makes = signal<string[]>([]);
  readonly models = signal<string[]>([]);
  readonly latestCars = signal<CarResponse[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  searchMake = '';
  searchModel = '';
  searchPriceFrom: number | null = null;
  searchPriceTo: number | null = null;
  activeSource = '';

  ngOnInit(): void {
    this.vehicleService
      .getMakes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((makes) => this.makes.set(makes));

    this.vehicleService
      .getMixedRecentCars(6)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (cars) => this.latestCars.set(cars),
        error: () => this.latestCars.set([]),
      });
  }

  onSearchMakeChange(make: string): void {
    this.searchModel = '';
    this.models.set([]);
    if (make) {
      this.vehicleService
        .getModels(make)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((models) => this.models.set(models));
    }
  }

  onSearch(): void {
    const queryParams: Record<string, string | number> = {};
    if (this.searchMake) queryParams['make'] = this.searchMake;
    if (this.searchModel) queryParams['model'] = this.searchModel;
    if (this.searchPriceFrom) queryParams['priceFrom'] = this.searchPriceFrom;
    if (this.searchPriceTo) queryParams['priceTo'] = this.searchPriceTo;
    if (this.activeSource) queryParams['sourceWebsite'] = this.activeSource;

    this.router.navigate(['/vehicles'], { queryParams });
  }

  filterBySource(source: string): void {
    this.activeSource = source;
    this.currentPage.set(0);
    this.totalPages.set(0);
    this.loadCars();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadCars();
  }

  private loadCars(): void {
    this.loading.set(true);

    if (!this.activeSource) {
      this.vehicleService
        .getMixedRecentCars(6)
        .pipe(
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (cars) => this.latestCars.set(cars),
          error: () => this.latestCars.set([]),
        });
    } else {
      this.vehicleService
        .searchCars({
          page: this.currentPage(),
          size: 6,
          sort: 'createdAt,desc',
          sourceWebsite: this.activeSource,
        })
        .pipe(
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (response) => {
            this.latestCars.set(response.cars);
            this.currentPage.set(response.currentPage);
            this.totalPages.set(response.totalPages);
          },
          error: () => this.latestCars.set([]),
        });
    }
  }
}

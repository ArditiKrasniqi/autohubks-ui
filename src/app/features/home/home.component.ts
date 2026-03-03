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
        <div class="search-glass max-w-5xl mx-auto">
          <!-- Row 1: Make, Model, Year -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div class="search-input-wrapper">
              <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-1.431-1.431A2.999 2.999 0 0017.159 9.75H15M2.25 14.25V7.875c0-.621.504-1.125 1.125-1.125h9.303c.397 0 .778.158 1.06.44l1.06 1.06" />
              </svg>
              <select class="search-input" [(ngModel)]="searchMake"
                      (ngModelChange)="onSearchMakeChange($event)">
                <option value="">All Makes</option>
                @for (make of makes(); track make) {
                  <option [value]="make">{{ make }}</option>
                }
              </select>
              <span class="search-input-label">Make</span>
            </div>
            <div class="search-input-wrapper">
              <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <select class="search-input" [(ngModel)]="searchModel"
                      [disabled]="!searchMake">
                <option value="">All Models</option>
                @for (model of models(); track model) {
                  <option [value]="model">{{ model }}</option>
                }
              </select>
              <span class="search-input-label">Model</span>
            </div>
            <div class="search-range-group" [class.search-range-error]="isYearRangeInvalid()">
              <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <input type="number" class="search-range-input" placeholder="From"
                     [(ngModel)]="searchYearFrom" />
              <span class="search-range-divider"></span>
              <input type="number" class="search-range-input" placeholder="To"
                     [(ngModel)]="searchYearTo" />
              <span class="search-input-label">Year</span>
            </div>
            <div class="search-range-group" [class.search-range-error]="isPriceRangeInvalid()">
              <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input type="number" class="search-range-input" placeholder="Min"
                     [(ngModel)]="searchPriceFrom" />
              <span class="search-range-divider"></span>
              <input type="number" class="search-range-input" placeholder="Max"
                     [(ngModel)]="searchPriceTo" />
              <span class="search-input-label">Price</span>
            </div>
          </div>

          <!-- Row 2: Transmission, Fuel Type, Search -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 min-w-0">
              <div class="search-input-wrapper">
                <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select class="search-input" [(ngModel)]="searchTransmission">
                  <option value="">All</option>
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="MANUAL">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
                <span class="search-input-label">Transmission</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="search-input-wrapper">
                <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                </svg>
                <select class="search-input" [(ngModel)]="searchFuelType">
                  <option value="">All</option>
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="LPG">LPG</option>
                </select>
                <span class="search-input-label">Fuel Type</span>
              </div>
            </div>
            <button (click)="onSearch()"
                    [disabled]="isPriceRangeInvalid() || isYearRangeInvalid()"
                    class="search-btn disabled:opacity-40 disabled:cursor-not-allowed">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </button>
          </div>

          <!-- Validation errors -->
          @if (isYearRangeInvalid() || isPriceRangeInvalid()) {
            <div class="mt-3">
              @if (isYearRangeInvalid()) {
                <p class="text-xs" style="color: #EF4444;">Min year cannot exceed max year</p>
              }
              @if (isPriceRangeInvalid()) {
                <p class="text-xs" style="color: #EF4444;">Min price cannot exceed max price</p>
              }
            </div>
          }
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
  searchYearFrom: number | null = null;
  searchYearTo: number | null = null;
  searchPriceFrom: number | null = null;
  searchPriceTo: number | null = null;
  searchTransmission = '';
  searchFuelType = '';
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

  isYearRangeInvalid(): boolean {
    return !!(this.searchYearFrom && this.searchYearTo && this.searchYearFrom > this.searchYearTo);
  }

  isPriceRangeInvalid(): boolean {
    return !!(this.searchPriceFrom && this.searchPriceTo && this.searchPriceFrom > this.searchPriceTo);
  }

  onSearch(): void {
    const queryParams: Record<string, string | number> = {};
    if (this.searchMake) queryParams['make'] = this.searchMake;
    if (this.searchModel) queryParams['model'] = this.searchModel;
    if (this.searchYearFrom) queryParams['yearFrom'] = this.searchYearFrom;
    if (this.searchYearTo) queryParams['yearTo'] = this.searchYearTo;
    if (this.searchPriceFrom) queryParams['priceFrom'] = this.searchPriceFrom;
    if (this.searchPriceTo) queryParams['priceTo'] = this.searchPriceTo;
    if (this.searchTransmission) queryParams['transmission'] = this.searchTransmission;
    if (this.searchFuelType) queryParams['fuelType'] = this.searchFuelType;
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

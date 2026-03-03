import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, BehaviorSubject, tap, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VehicleService } from '../services/vehicle.service';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { LoadingSkeletonComponent } from '@shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { CarResponse, CarFilterParams, PagedCarResponse } from '@shared/interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VehicleCardComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-2xl font-bold tracking-tight" style="color: #121212;">Vehicle Listings</h1>
        <p class="text-sm mt-1" style="color: #9E9E9E;">Browse all available Korean imports</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-72 shrink-0">
          <div class="bg-white rounded-3xl p-6 space-y-5 lg:sticky lg:top-24" style="border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);">
            <h2 class="font-bold text-sm uppercase tracking-wider" style="color: #121212; letter-spacing: 0.08em;">Filters</h2>

            <!-- Make -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Make</label>
              <select
                class="input-field-light"
                [ngModel]="filters.make"
                (ngModelChange)="onMakeChange($event)">
                <option value="">All Makes</option>
                @for (make of makes$ | async; track make) {
                  <option [value]="make">{{ make }}</option>
                }
              </select>
            </div>

            <!-- Model -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Model</label>
              <select
                class="input-field-light"
                [ngModel]="filters.model"
                (ngModelChange)="updateFilter('model', $event)"
                [disabled]="!filters.make">
                <option value="">All Models</option>
                @for (model of models$ | async; track model) {
                  <option [value]="model">{{ model }}</option>
                }
              </select>
            </div>

            <!-- Price range -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Min Price</label>
                <input type="number" class="input-field-light" placeholder="€ Min"
                       [ngModel]="filters.priceFrom"
                       [class.border-red-400]="isPriceRangeInvalid()"
                       (ngModelChange)="updateFilter('priceFrom', $event)" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Max Price</label>
                <input type="number" class="input-field-light" placeholder="€ Max"
                       [ngModel]="filters.priceTo"
                       [class.border-red-400]="isPriceRangeInvalid()"
                       (ngModelChange)="updateFilter('priceTo', $event)" />
              </div>
            </div>
            @if (isPriceRangeInvalid()) {
              <p class="text-xs mt-1" style="color: #EF4444;">Min price cannot exceed max price</p>
            }

            <!-- Mileage range -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Min Mileage</label>
                <input type="number" class="input-field-light" placeholder="km Min"
                       [ngModel]="filters.mileageFrom"
                       [class.border-red-400]="isMileageRangeInvalid()"
                       (ngModelChange)="updateFilter('mileageFrom', $event)" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Max Mileage</label>
                <input type="number" class="input-field-light" placeholder="km Max"
                       [ngModel]="filters.mileageTo"
                       [class.border-red-400]="isMileageRangeInvalid()"
                       (ngModelChange)="updateFilter('mileageTo', $event)" />
              </div>
            </div>
            @if (isMileageRangeInvalid()) {
              <p class="text-xs mt-1" style="color: #EF4444;">Min mileage cannot exceed max mileage</p>
            }

            <!-- Fuel type -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Fuel Type</label>
              <select class="input-field-light"
                      [ngModel]="filters.fuelType"
                      (ngModelChange)="updateFilter('fuelType', $event)">
                <option value="">All</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="PLUGIN_HYBRID">Plugin Hybrid</option>
                <option value="ELECTRIC">Electric</option>
                <option value="LPG">LPG</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <!-- Transmission -->
            <div>
              <label class="block text-xs font-semibold mb-1.5" style="color: #9E9E9E;">Transmission</label>
              <select class="input-field-light"
                      [ngModel]="filters.transmission"
                      (ngModelChange)="updateFilter('transmission', $event)">
                <option value="">All</option>
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
                <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <button (click)="clearFilters()" class="w-full text-sm font-semibold py-2.5 rounded-xl transition-all" style="background: #F5F5F5; color: #616161; border: 1px solid #E0E0E0;">
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Main content -->
        <section class="flex-1 min-w-0">
          <!-- Source tabs -->
          <div class="flex items-center gap-2 flex-wrap mb-6">
            <button
              (click)="updateFilter('sourceWebsite', '')"
              [class]="!filters.sourceWebsite ? 'filter-pill filter-pill-active' : 'filter-pill'">
              All
            </button>
            <button
              (click)="updateFilter('sourceWebsite', 'KOREA_AUTO_IMPORTS')"
              [class]="filters.sourceWebsite === 'KOREA_AUTO_IMPORTS' ? 'filter-pill filter-pill-active' : 'filter-pill'">
              Korea Auto Imports
            </button>
            <button
              (click)="updateFilter('sourceWebsite', 'AUTOKOREA_KOSOVA')"
              [class]="filters.sourceWebsite === 'AUTOKOREA_KOSOVA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
              AutoKorea Kosova
            </button>
            <button
              (click)="updateFilter('sourceWebsite', 'LUXURY_CARS_KOSOVA')"
              [class]="filters.sourceWebsite === 'LUXURY_CARS_KOSOVA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
              Luxury Cars Kosova
            </button>
            <button
              (click)="updateFilter('sourceWebsite', 'TRIO_VETURA')"
              [class]="filters.sourceWebsite === 'TRIO_VETURA' ? 'filter-pill filter-pill-active' : 'filter-pill'">
              TrioVetura
            </button>
          </div>

          @if (loading$ | async) {
            <app-loading-skeleton [count]="6" />
          } @else if ((cars$ | async)?.length === 0) {
            <app-empty-state />
          } @else {
            <!-- Results count -->
            <p class="text-sm mb-5 font-medium" style="color: #9E9E9E;">
              {{ totalElements }} vehicle{{ totalElements === 1 ? '' : 's' }} found
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              @for (car of cars$ | async; track car.id) {
                <app-vehicle-card [car]="car" />
              }
            </div>

            <!-- Pagination -->
            @if (totalPages > 1) {
              <nav class="flex items-center justify-center gap-3 mt-10">
                <button
                  (click)="goToPage(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style="background: #EEEEEE; color: #616161;">
                  Previous
                </button>

                <span class="text-sm font-medium px-3" style="color: #9E9E9E;">
                  Page {{ currentPage + 1 }} of {{ totalPages }}
                </span>

                <button
                  (click)="goToPage(currentPage + 1)"
                  [disabled]="currentPage >= totalPages - 1"
                  class="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style="background: #EEEEEE; color: #616161;">
                  Next
                </button>
              </nav>
            }
          }
        </section>
      </div>
    </div>
  `,
})
export class VehiclesListComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly filterSubject = new Subject<CarFilterParams>();

  readonly cars$ = new BehaviorSubject<CarResponse[]>([]);
  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly makes$ = this.vehicleService.getMakes();
  readonly models$ = new BehaviorSubject<string[]>([]);

  filters: CarFilterParams = {};
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    // Read initial filters from query params
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.filters = {
          make: params['make'] || '',
          model: params['model'] || '',
          priceFrom: params['priceFrom'] ? +params['priceFrom'] : undefined,
          priceTo: params['priceTo'] ? +params['priceTo'] : undefined,
          mileageFrom: params['mileageFrom'] ? +params['mileageFrom'] : undefined,
          mileageTo: params['mileageTo'] ? +params['mileageTo'] : undefined,
          fuelType: params['fuelType'] || '',
          transmission: params['transmission'] || '',
          sourceWebsite: params['sourceWebsite'] || '',
          page: params['page'] ? +params['page'] : 0,
          size: 12,
        };
        this.currentPage = this.filters.page || 0;

        if (this.filters.make) {
          this.vehicleService
            .getModels(this.filters.make)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((models) => this.models$.next(models));
        }

        this.loadCars();
      });

    // Debounced filter changes
    this.filterSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((filters) => {
        this.syncQueryParams(filters);
      });
  }

  updateFilter(key: keyof CarFilterParams, value: string | number | undefined): void {
    (this.filters as Record<string, unknown>)[key] = value || undefined;
    this.filters.page = 0;
    this.filterSubject.next({ ...this.filters });
  }

  onMakeChange(make: string): void {
    this.filters.make = make || undefined;
    this.filters.model = undefined;
    this.models$.next([]);

    if (make) {
      this.vehicleService
        .getModels(make)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((models) => this.models$.next(models));
    }

    this.filters.page = 0;
    this.filterSubject.next({ ...this.filters });
  }

  isPriceRangeInvalid(): boolean {
    return !!(this.filters.priceFrom && this.filters.priceTo && this.filters.priceFrom > this.filters.priceTo);
  }

  isMileageRangeInvalid(): boolean {
    return !!(this.filters.mileageFrom && this.filters.mileageTo && this.filters.mileageFrom > this.filters.mileageTo);
  }

  clearFilters(): void {
    this.filters = { page: 0, size: 12 };
    this.models$.next([]);
    this.filterSubject.next({ ...this.filters });
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.syncQueryParams(this.filters);
  }

  private loadCars(): void {
    this.loading$.next(true);
    this.vehicleService
      .searchCars(this.filters)
      .pipe(
        finalize(() => this.loading$.next(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.cars$.next(response.cars);
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        error: () => {
          this.cars$.next([]);
        },
      });
  }

  private syncQueryParams(filters: CarFilterParams): void {
    const queryParams: Record<string, string | number | undefined> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'size') {
        queryParams[key] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }
}

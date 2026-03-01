import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (item of items; track item) {
        <div class="card p-0">
          <div class="skeleton h-48 w-full rounded-none"></div>
          <div class="p-4 space-y-3">
            <div class="skeleton h-5 w-3/4"></div>
            <div class="skeleton h-4 w-1/2"></div>
            <div class="flex gap-2">
              <div class="skeleton h-4 w-16"></div>
              <div class="skeleton h-4 w-20"></div>
            </div>
            <div class="skeleton h-9 w-full rounded-lg"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class LoadingSkeletonComponent {
  @Input() count = 6;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}

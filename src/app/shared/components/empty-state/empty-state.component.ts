import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-700 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 max-w-sm">{{ message }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title = 'No vehicles found';
  @Input() message = 'Try adjusting your filters or search criteria.';
}

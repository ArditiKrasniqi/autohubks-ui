import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-auto" style="background: #121212; border-top: 1px solid rgba(255,255,255,0.06);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
          <!-- Logo echo -->
          <div class="flex items-center gap-2.5">
            <svg class="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="#FF6B2B" stroke-width="1.5" fill="none" opacity="0.3"/>
              <path d="M16 34L24 12L32 34" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.5"/>
              <line x1="18.5" y1="26" x2="29.5" y2="26" stroke="#FF6B2B" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
            </svg>
            <span class="text-sm font-semibold" style="color: #9E9E9E;">
              Auto<span style="color: #FF6B2B;">Hub</span><span class="text-xs font-normal" style="color: #616161;">KS</span>
            </span>
          </div>

          <p class="text-xs" style="color: #616161;">
            &copy; 2026 AutoHubKS. Premium Korean imports for Kosovo.
          </p>

          <p class="text-xs" style="color: #4A4A4A;">
            Aggregated listings from trusted importers.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

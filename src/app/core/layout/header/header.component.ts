import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50" style="background: #121212; border-bottom: 1px solid rgba(255,255,255,0.06);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5">
            <svg class="w-9 h-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Hexagonal frame -->
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="#FF6B2B" stroke-width="1.5" fill="none" opacity="0.15"/>
              <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="#FF6B2B" stroke-width="1.5" fill="none"/>
              <!-- Abstract A -->
              <path d="M16 34L24 12L32 34" stroke="#FAFAFA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <line x1="18.5" y1="26" x2="29.5" y2="26" stroke="#FF6B2B" stroke-width="2" stroke-linecap="round"/>
              <!-- Hub dot -->
              <circle cx="24" cy="12" r="2" fill="#FF6B2B"/>
            </svg>
            <span class="text-lg font-bold tracking-tight" style="color: #FAFAFA;">
              Auto<span style="color: #FF6B2B;">Hub</span><span class="text-sm font-normal" style="color: #9E9E9E;">KS</span>
            </span>
          </a>

          <!-- Desktop nav -->
          <nav class="hidden sm:flex items-center gap-8">
            <a routerLink="/"
               routerLinkActive="nav-active"
               [routerLinkActiveOptions]="{ exact: true }"
               class="nav-link text-sm font-medium transition-colors duration-200">
              Home
            </a>
            <a routerLink="/vehicles"
               routerLinkActive="nav-active"
               class="nav-link text-sm font-medium transition-colors duration-200">
              Listings
            </a>
          </nav>

          <!-- Mobile menu button -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen"
                  class="sm:hidden p-2" style="color: #9E9E9E;">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              @if (mobileMenuOpen) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen) {
          <nav class="sm:hidden pb-4 flex flex-col gap-1" style="border-top: 1px solid rgba(255,255,255,0.06);">
            <a routerLink="/"
               (click)="mobileMenuOpen = false"
               class="px-3 py-2.5 text-sm font-medium rounded-xl transition-colors"
               style="color: #9E9E9E;">
              Home
            </a>
            <a routerLink="/vehicles"
               (click)="mobileMenuOpen = false"
               class="px-3 py-2.5 text-sm font-medium rounded-xl transition-colors"
               style="color: #9E9E9E;">
              Listings
            </a>
          </nav>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  mobileMenuOpen = false;
}

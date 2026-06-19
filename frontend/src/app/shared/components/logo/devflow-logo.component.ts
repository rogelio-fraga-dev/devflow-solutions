import { Component, input } from '@angular/core';

/**
 * Logo DevFlow — SVG inline animável.
 * Duas ondas entrelaçadas (o "flow" de dados → dinheiro) com gradiente
 * na paleta oficial (#4F46E5 → #D2C5FF) e pulso de energia percorrendo
 * o traçado. Animação 100% CSS (stroke-dashoffset), desativada via
 * prefers-reduced-motion no design system global.
 */
@Component({
  selector: 'df-logo',
  standalone: true,
  template: `
    <span class="df-logo">
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="DevFlow"
      >
        <defs>
          <linearGradient id="dfLogoGrad" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#4F46E5" />
            <stop offset="1" stop-color="#D2C5FF" />
          </linearGradient>
        </defs>

        @if (tile()) {
          <rect x="1" y="1" width="46" height="46" rx="14"
                fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
        }

        <!-- onda principal -->
        <path d="M9 29.5C16.5 29.5 16.5 18.5 24 18.5C31.5 18.5 31.5 29.5 39 29.5"
              stroke="url(#dfLogoGrad)" stroke-width="3.4" stroke-linecap="round" />
        <!-- onda espelhada (duotone) -->
        <path d="M9 18.5C16.5 18.5 16.5 29.5 24 29.5C31.5 29.5 31.5 18.5 39 18.5"
              stroke="url(#dfLogoGrad)" stroke-width="3.4" stroke-linecap="round" opacity="0.38" />
        <!-- pulsos de energia percorrendo o fluxo -->
        <path class="df-logo-pulse"
              d="M9 29.5C16.5 29.5 16.5 18.5 24 18.5C31.5 18.5 31.5 29.5 39 29.5"
              stroke="#F5F4F3" stroke-width="3.4" stroke-linecap="round" opacity="0.85" />
        <path class="df-logo-pulse reverse"
              d="M9 18.5C16.5 18.5 16.5 29.5 24 29.5C31.5 29.5 31.5 18.5 39 18.5"
              stroke="#D2C5FF" stroke-width="3.4" stroke-linecap="round" opacity="0.5" />
      </svg>

      @if (withText()) {
        <span class="df-logo-text">DevFlow</span>
      }
    </span>
  `
})
export class DevflowLogoComponent {
  size = input(32);
  withText = input(false);
  tile = input(true);
}

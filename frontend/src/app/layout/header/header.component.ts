import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface Breadcrumb {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <button class="header-icon-btn" (click)="toggleSidebar.emit()" style="border:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <nav class="breadcrumb">
        @for (crumb of breadcrumbs(); track $index; let last = $last) {
          @if (!last) {
            <a [routerLink]="crumb.path">{{ crumb.label }}</a>
            <span class="sep">/</span>
          } @else {
            <span>{{ crumb.label }}</span>
          }
        }
      </nav>

      <div class="header-actions">
        <button class="header-icon-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <div style="width:1px;height:20px;background:var(--border)"></div>
        
        <div class="header-user">
          <div class="sidebar-avatar" style="width:30px;height:30px;font-size:11px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            @if (auth.userPhoto()) {
              <img [src]="auth.userPhoto()" style="width: 100%; height: 100%; object-fit: cover;" />
            } @else {
              {{ initials(auth.currentUser()?.email) }}
            }
          </div>
          <div>
            <div class="user-name">{{ getUserName() | titlecase }}</div>
            <div class="user-role">{{ auth.currentUser()?.role || 'User' }}</div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  auth = inject(AuthService);

  breadcrumbs  = input<Breadcrumb[]>([]);
  toggleSidebar = output<void>();

  // Função para pegar o nome do usuário com segurança
  getUserName(): string {
    const email = this.auth.currentUser()?.email;
    if (!email) return 'Usuário';
    return email.split('@')[0];
  }

  initials(email?: string | null): string {
    if (!email) return 'U';
    const name = email.split('@')[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
}
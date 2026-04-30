import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SidebarComponent, NavItem } from '../../layout/sidebar/sidebar.component';
import { HeaderComponent, Breadcrumb } from '../../layout/header/header.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="app-shell">
      <app-sidebar [collapsed]="collapsed()" [navItems]="navItems" />
      <div class="app-content">
        <app-header [breadcrumbs]="breadcrumbs()" (toggleSidebar)="collapsed.set(!collapsed())" />
        <main class="app-main">
          <router-outlet />
        </main>
      </div>
    </div>
    <app-toast />
  `
})
export class AppShellComponent {
  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Projetos',          path: '/app/projetos',       icon: 'folder' },
    { label: 'Sprints',           path: '/app/sprints',        icon: 'zap' },
    { label: 'Timesheet',         path: '/app/timesheet',      icon: 'clock' },
    { label: 'Change Requests',   path: '/app/change-requests',icon: 'refresh' },
    { label: 'Financeiro',        path: '/app/financeiro',     icon: 'dollar' },
    { label: 'Usuários',          path: '/app/usuarios',       icon: 'users' },
    { label: 'Desenvolvedores',   path: '/app/desenvolvedores',icon: 'code' },
    { label: 'Clientes',          path: '/app/clientes',       icon: 'briefcase' },
    { label: 'Custos API',        path: '/app/custos-api',     icon: 'cpu' },
    { label: 'Custos Cloud',      path: '/app/custos-cloud',   icon: 'cloud' },
  ];

  breadcrumbs = signal<Breadcrumb[]>([{ label: 'DevFlow' }]);
}

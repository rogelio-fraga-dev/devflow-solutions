import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent, NavItem } from '../../layout/sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-layout app-shell">
      <app-sidebar [collapsed]="sidebarCollapsed()" [navItems]="navItems" />
      <main class="app-main app-content" [class.sidebar-collapsed]="sidebarCollapsed()">
        <!-- Botão hambúrguer para mobile -->
        <button class="hamburger-btn" (click)="toggleSidebar()" style="display: none; padding: 16px; background: none; border: none; cursor: pointer;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <router-outlet />
      </main>
    </div>
    <app-toast />
  `
})
export class AppShellComponent implements OnInit {
  sidebarCollapsed = signal(false);
  navItems: NavItem[] = [];
  
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.sidebarCollapsed.set(true)); // ou falso no desktop, mas conforme md
  }

  ngOnInit() {
    const role = this.auth.currentUser()?.role;
    this.navItems = role === 'DESENVOLVEDOR' ? this.navDev : this.navAdmin;
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  private navAdmin: NavItem[] = [
    { label: 'Projetos',         path: '/app/projetos',        icon: 'folder'    },
    { label: 'Sprints',          path: '/app/sprints',         icon: 'zap'       },
    { label: 'Timesheets',       path: '/app/timesheet',       icon: 'clock'     },
    { label: 'Change Requests',  path: '/app/change-requests', icon: 'refresh'   },
    { label: 'Dashboard',        path: '/app/financeiro',      icon: 'dollar'    },
    { label: 'Clientes',         path: '/app/clientes',        icon: 'briefcase' },
    { label: 'Desenvolvedores',  path: '/app/desenvolvedores', icon: 'code'      },
    { label: 'Usuários',         path: '/app/usuarios',        icon: 'users'     },
    { label: 'Custos Cloud',     path: '/app/custos-cloud',    icon: 'cloud'     },
    { label: 'Custos de APIs',   path: '/app/custos-api',      icon: 'cpu'       },
    { label: 'Ajuda',            path: '/app/ajuda',           icon: 'help'      },
  ];

  private navDev: NavItem[] = [
    { label: 'Meus Projetos',   path: '/app/projetos',         icon: 'folder'    },
    { label: 'Lançar Horas',   path: '/app/timesheet',         icon: 'clock'     },
    { label: 'Meus Sprints',   path: '/app/sprints',           icon: 'zap'       },
    { label: 'Meu Perfil',       path: '/app/perfil',            icon: 'user'      },
    { label: 'Ajuda',          path: '/app/ajuda',             icon: 'help'      },
  ];
}

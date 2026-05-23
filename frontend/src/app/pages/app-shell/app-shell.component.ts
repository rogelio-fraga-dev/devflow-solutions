import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent, NavItem } from '../../layout/sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-layout app-shell">
      <!-- Hamburger Menu Toggle Button for Mobile -->
      <button class="mobile-menu-btn" (click)="toggleSidebar()" title="Abrir Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <!-- Sidebar with open status on mobile -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed()" 
        [navItems]="navItems" 
        (toggle)="toggleSidebar()" 
        [class.open]="!sidebarCollapsed()" 
      />

      <!-- Overlay wrapper to tap away to dismiss mobile sidebar drawer -->
      @if (!sidebarCollapsed()) {
        <div class="mobile-sidebar-overlay" (click)="toggleSidebar()"></div>
      }

      <main class="app-main app-content" [class.sidebar-collapsed]="sidebarCollapsed()">
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

  ngOnInit() {
    // Se a tela for de tablet ou mobile, inicia a sidebar oculta
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.sidebarCollapsed.set(true);
    }

    const role = this.auth.currentUser()?.role;
    if (role === 'DESENVOLVEDOR') this.navItems = this.navDev;
    else if (role === 'GESTOR') this.navItems = this.navGestor;
    else this.navItems = this.navAdmin;
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  private navAdmin: NavItem[] = [
    { label: 'Dashboard',        path: '/app/dashboard',      icon: 'grid'      },
    { label: 'Projetos',         path: '/app/projetos',        icon: 'folder'    },
    { label: 'Sprints',          path: '/app/sprints',         icon: 'zap'       },
    { label: 'Timesheets',       path: '/app/timesheet',       icon: 'clock'     },
    { label: 'Change Requests',  path: '/app/change-requests', icon: 'refresh'   },
    { label: 'Clientes',         path: '/app/clientes',        icon: 'briefcase' },
    { label: 'Desenvolvedores',  path: '/app/desenvolvedores', icon: 'code'      },
    { label: 'Usuários',         path: '/app/usuarios',        icon: 'users'     },
    { label: 'Custos Cloud',     path: '/app/custos-cloud',    icon: 'cloud'     },
    { label: 'Custos de APIs',   path: '/app/custos-api',      icon: 'cpu'       },
    { label: 'Custos Adicionais',path: '/app/custos-adicionais', icon: 'dollar'    },
    { label: 'Ajuda',            path: '/app/ajuda',           icon: 'help'      },
  ];

  private navGestor: NavItem[] = [
    { label: 'Dashboard',        path: '/app/dashboard',      icon: 'grid'      },
    { label: 'Projetos',         path: '/app/projetos',        icon: 'folder'    },
    { label: 'Sprints',          path: '/app/sprints',         icon: 'zap'       },
    { label: 'Timesheets',       path: '/app/timesheet',       icon: 'clock'     },
    { label: 'Change Requests',  path: '/app/change-requests', icon: 'refresh'   },
    { label: 'Clientes',         path: '/app/clientes',        icon: 'briefcase' },
    { label: 'Desenvolvedores',  path: '/app/desenvolvedores', icon: 'code'      },
    { label: 'Custos Cloud',     path: '/app/custos-cloud',    icon: 'cloud'     },
    { label: 'Custos de APIs',   path: '/app/custos-api',      icon: 'cpu'       },
    { label: 'Custos Adicionais',path: '/app/custos-adicionais', icon: 'dollar'    },
    { label: 'Ajuda',            path: '/app/ajuda',           icon: 'help'      },
  ];

  private navDev: NavItem[] = [
    { label: 'Dashboard',       path: '/app/dashboard',       icon: 'grid'      },
    { label: 'Meus Projetos',   path: '/app/projetos',         icon: 'folder'    },
    { label: 'Lançar Horas',    path: '/app/timesheet',        icon: 'clock'     },
    { label: 'Meus Sprints',    path: '/app/sprints',          icon: 'zap'       },
    { label: 'Ajuda',           path: '/app/ajuda',            icon: 'help'      },
  ];
}

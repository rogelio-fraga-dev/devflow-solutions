import { Component, NgZone, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent, NavItem } from '../../layout/sidebar/sidebar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';

type AmbientZone = 'dashboard' | 'projetos' | 'custos' | 'pessoas';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-layout app-shell" [attr.data-zone]="ambientZone()">
      <!-- Fundo ambiente dinâmico: cores reagem à área em uso e o conjunto
           acompanha o ponteiro (parallax sutil via CSS vars) -->
      <div class="df-ambient" aria-hidden="true">
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>
        <div class="orb orb-c"></div>
        <div class="df-ambient-grid"></div>
      </div>

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
export class AppShellComponent implements OnInit, OnDestroy {
  sidebarCollapsed = signal(false);
  ambientZone = signal<AmbientZone>('dashboard');
  navItems: NavItem[] = [];

  private auth = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private raf = 0;
  private parallaxEnabled = false;

  ngOnInit() {
    // Se a tela for de tablet ou mobile, inicia a sidebar oculta
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      this.sidebarCollapsed.set(true);
    }

    const role = this.auth.currentUser()?.role;
    if (role === 'DESENVOLVEDOR') this.navItems = this.navDev;
    else if (role === 'GESTOR') this.navItems = this.navGestor;
    else this.navItems = this.navAdmin;

    this.setAmbientZone(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.setAmbientZone(e.urlAfterRedirects));

    this.initParallax();
  }

  ngOnDestroy() {
    if (this.parallaxEnabled) {
      window.removeEventListener('pointermove', this.onPointerMove);
      cancelAnimationFrame(this.raf);
      document.documentElement.style.removeProperty('--mx');
      document.documentElement.style.removeProperty('--my');
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  private setAmbientZone(url: string) {
    if (url.includes('/custos')) this.ambientZone.set('custos');
    else if (url.includes('/projetos') || url.includes('/sprints') || url.includes('/change-requests')) this.ambientZone.set('projetos');
    else if (url.includes('/usuarios') || url.includes('/desenvolvedores') || url.includes('/clientes') || url.includes('/perfil')) this.ambientZone.set('pessoas');
    else this.ambientZone.set('dashboard');
  }

  private initParallax() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    this.parallaxEnabled = true;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    });
  }

  private onPointerMove = (e: PointerEvent) => {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      const root = document.documentElement.style;
      root.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
      root.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
    });
  };

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
    { label: 'Meu Perfil',     path: '/app/perfil',           icon: 'user'      },
    { label: 'Ajuda',           path: '/app/ajuda',            icon: 'help'      },
  ];
}

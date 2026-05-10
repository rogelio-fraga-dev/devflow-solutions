import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/app-shell/app-shell.component').then(m => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'projetos', pathMatch: 'full' },
      {
        path: 'projetos',
        loadComponent: () => import('./pages/projetos/projetos-lista/projetos-lista.component').then(m => m.ProjetosListaComponent)
      },
      {
        path: 'projetos/:id',
        loadComponent: () => import('./pages/projetos/projeto-detalhe/projeto-detalhe.component').then(m => m.ProjetoDetalheComponent)
      },
      {
        path: 'sprints',
        loadComponent: () => import('./pages/sprints/sprints.component').then(m => m.SprintsComponent)
      },
      {
        path: 'timesheet',
        loadComponent: () => import('./pages/timesheet/timesheet.component').then(m => m.TimesheetComponent)
      },
      {
        path: 'change-requests',
        loadComponent: () => import('./pages/change-requests/change-requests.component').then(m => m.ChangeRequestsComponent)
      },
      {
        path: 'financeiro',
        loadComponent: () => import('./pages/financeiro/financeiro.component').then(m => m.FinanceiroComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'desenvolvedores',
        loadComponent: () => import('./pages/desenvolvedores/desenvolvedores.component').then(m => m.DesenvolvedoresComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'custos-api',
        loadComponent: () => import('./pages/custos-api/custos-api.component').then(m => m.CustosApiComponent)
      },
      {
        path: 'custos-cloud',
        loadComponent: () => import('./pages/custos-cloud/custos-cloud.component').then(m => m.CustosCloudComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

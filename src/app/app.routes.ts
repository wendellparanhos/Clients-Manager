import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
        },
        {
            path: 'clients',
            loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent)
        },
        {
            path: 'clients/new',
            loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
        },
        {
            path: 'clients/edit/:id',
            loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
        },
        {
            path: 'clients/:id',
            loadComponent: () => import('./features/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent)
        }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

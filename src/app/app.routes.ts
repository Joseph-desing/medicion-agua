import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-readings',
    loadComponent: () => import('./pages/my-readings/my-readings.page').then(m => m.MyReadingsPage),
    canActivate: [authGuard]
  },
  {
    path: 'register-reading',
    loadComponent: () => import('./pages/register-reading/register-reading.page').then(m => m.RegisterReadingPage),
    canActivate: [authGuard]
  }
];
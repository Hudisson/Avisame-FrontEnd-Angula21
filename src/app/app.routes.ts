import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';

import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'home',
    component: Home,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile')
            .then(m => m.Profile)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/tasks/tasks')
            .then(m => m.Tasks)
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./components/eventos/eventos')
            .then(m => m.Eventos)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

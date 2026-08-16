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
        path: 'perfil',
        loadComponent: () =>
          import('./components/profile/profile')
            .then(m => m.Profile)
      },
      {
        path: 'tarefas',
        loadComponent: () =>
          import('./components/tasks/tasks')
            .then(m => m.Tasks)
      },

      {
        path: 'tarefas/nova',
        loadComponent: () =>
          import('./components/task-form/task-form')
            .then(m => m.TaskForm)
      },

      {
        path: 'eventos',
        loadComponent: () =>
          import('./components/eventos/eventos')
            .then(m => m.Eventos)
      },

      {
        path: 'horarios',
        loadComponent: () =>
          import('./components/horarios/horarios')
            .then(m => m.Horarios)
      },

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

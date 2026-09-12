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
        path: 'tarefa/:id',
        loadComponent: () =>
          import('./components/task-view/task-view')
            .then(m => m.TaskView)
      },

      {
        path: 'tarefas/:id/editar',
        loadComponent: () =>
          import('./components/task-edit/task-edit')
            .then(m => m.TaskEdit)
      },

      {
        path: 'eventos',
        loadComponent: () =>
          import('./components/eventos/eventos')
            .then(m => m.Eventos)
      },

      {
        path: 'eventos/novo',
        loadComponent: () =>
          import('./components/event-form/event-form')
            .then(m => m.EventForm)
      },

      {
        path: 'eventos/:id',
        loadComponent: () =>
          import('./components/event-view/event-view')
            .then(m => m.EventView)
      },

      {
        path: 'eventos/:id/editar',
        loadComponent: () =>
          import('./components/event-edit/event-edit')
            .then(m => m.EventEdit)
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

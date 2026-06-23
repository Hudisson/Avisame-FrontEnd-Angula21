import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
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
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    canActivate: [AuthGuard]
  },

  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '/home'
  }


];

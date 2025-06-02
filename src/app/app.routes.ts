import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: '', redirectTo: 'tab1', pathMatch: 'full' },

      {
        path: 'tab1',
        loadComponent: () =>
          import('./pages/tab1/tab1.page').then(m => m.Tab1Page)
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('./pages/tab2/tab2.page').then(m => m.Tab2Page)
      },      
      {
        path: 'tab3',
        loadComponent: () =>
          import('./pages/tab3/tab3.page').then(m => m.Tab3Page)
      },
    ]
  },

  // 4) wildcard: tudo que não casar volta pro login
  { path: '**', redirectTo: 'login' }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.page').then(m => m.HomePage)
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects.page').then(m => m.ProjectsPage)
  },
  { path: '**', redirectTo: '' }
];

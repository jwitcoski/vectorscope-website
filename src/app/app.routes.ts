import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'census-demo', loadComponent: () => import('./census-demo/census-demo.component').then(m => m.CensusDemoComponent) },
  { path: '**', redirectTo: '' }
];

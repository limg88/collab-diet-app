import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'menu', loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage) },
      { path: 'ingredients', loadComponent: () => import('./pages/ingredients/ingredients.page').then(m => m.IngredientsPage) },
      { path: 'shopping', loadComponent: () => import('./pages/shopping/shopping.page').then(m => m.ShoppingPage) },
      { path: 'collaboration', loadComponent: () => import('./pages/collaboration/collaboration.page').then(m => m.CollaborationPage) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage) },
    ]
  },
  { path: '**', redirectTo: 'menu' }
];

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';

export const appRoutes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent),
      },
      {
        path: 'clients/new',
        loadComponent: () =>
          import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent),
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./features/clients/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () =>
          import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent),
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('./features/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent),
      },
      {
        path: 'vehicles/new',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: 'vehicles/:id',
        loadComponent: () =>
          import('./features/vehicles/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent),
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

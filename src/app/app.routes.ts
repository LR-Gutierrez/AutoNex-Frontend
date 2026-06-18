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
        path: 'form-demo',
        loadComponent: () =>
          import('./features/form-demo/form-demo.component').then(m => m.FormDemoComponent),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/client-list.component').then(m => m.ClientListComponent),
      },
      {
        path: 'clients/new',
        loadComponent: () =>
          import('./features/clients/client-form.component').then(m => m.ClientFormComponent),
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () =>
          import('./features/clients/client-form.component').then(m => m.ClientFormComponent),
      },
      {
        path: 'vehicles',
        loadComponent: () =>
          import('./features/vehicles/vehicle-list.component').then(m => m.VehicleListComponent),
      },
      {
        path: 'vehicles/new',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: 'vehicles/:id',
        loadComponent: () =>
          import('./features/vehicles/vehicle-detail.component').then(m => m.VehicleDetailComponent),
      },
      {
        path: 'vehicles/:id/edit',
        loadComponent: () =>
          import('./features/vehicles/vehicle-form.component').then(m => m.VehicleFormComponent),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/suppliers/supplier-list.component').then(m => m.SupplierListComponent),
      },
      {
        path: 'suppliers/new',
        loadComponent: () =>
          import('./features/suppliers/supplier-form.component').then(m => m.SupplierFormComponent),
      },
      {
        path: 'suppliers/:id/edit',
        loadComponent: () =>
          import('./features/suppliers/supplier-form.component').then(m => m.SupplierFormComponent),
      },
      {
        path: 'tools',
        loadComponent: () =>
          import('./features/tools/tool-list.component').then(m => m.ToolListComponent),
      },
      {
        path: 'tools/new',
        loadComponent: () =>
          import('./features/tools/tool-form.component').then(m => m.ToolFormComponent),
      },
      {
        path: 'tools/:id/edit',
        loadComponent: () =>
          import('./features/tools/tool-form.component').then(m => m.ToolFormComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/service-list.component').then(m => m.ServiceListComponent),
      },
      {
        path: 'services/new',
        loadComponent: () =>
          import('./features/services/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'services/:id/edit',
        loadComponent: () =>
          import('./features/services/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'consumables',
        loadComponent: () =>
          import('./features/consumables/consumable-list.component').then(m => m.ConsumableListComponent),
      },
      {
        path: 'consumables/new',
        loadComponent: () =>
          import('./features/consumables/consumable-form.component').then(m => m.ConsumableFormComponent),
      },
      {
        path: 'consumables/:id/edit',
        loadComponent: () =>
          import('./features/consumables/consumable-form.component').then(m => m.ConsumableFormComponent),
      },
      {
        path: 'service-orders',
        loadComponent: () =>
          import('./features/service-orders/service-order-list.component').then(m => m.ServiceOrderListComponent),
      },
      {
        path: 'service-orders/new',
        loadComponent: () =>
          import('./features/service-orders/service-order-form.component').then(m => m.ServiceOrderFormComponent),
      },
      {
        path: 'service-orders/:id/edit',
        loadComponent: () =>
          import('./features/service-orders/service-order-form.component').then(m => m.ServiceOrderFormComponent),
      },
      {
        path: 'mileage-alerts',
        loadComponent: () =>
          import('./features/mileage-alerts/mileage-alert-list.component').then(m => m.MileageAlertListComponent),
      },
      {
        path: 'financial-records',
        loadComponent: () =>
          import('./features/financial-records/financial-record-list.component').then(m => m.FinancialRecordListComponent),
      },
      {
        path: 'financial-records/new',
        loadComponent: () =>
          import('./features/financial-records/financial-record-form.component').then(m => m.FinancialRecordFormComponent),
      },
      {
        path: 'financial-records/:id/edit',
        loadComponent: () =>
          import('./features/financial-records/financial-record-form.component').then(m => m.FinancialRecordFormComponent),
      },
      {
        path: 'tool-categories',
        loadComponent: () =>
          import('./features/tool-categories/tool-category-list.component').then(m => m.ToolCategoryListComponent),
      },
      {
        path: 'tool-categories/new',
        loadComponent: () =>
          import('./features/tool-categories/tool-category-form.component').then(m => m.ToolCategoryFormComponent),
      },
      {
        path: 'tool-categories/:id/edit',
        loadComponent: () =>
          import('./features/tool-categories/tool-category-form.component').then(m => m.ToolCategoryFormComponent),
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

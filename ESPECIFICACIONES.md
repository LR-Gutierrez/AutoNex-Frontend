# AutoNex Frontend — Especificaciones Técnicas

> **Propósito:** Este documento define la arquitectura, stack tecnológico, estructura de directorios, mapa de navegación, flujo de autenticación, convenciones de código y plan de implementación para el frontend de AutoNex. Es la guía única y vinculante para todo el desarrollo.
>
> **Origen:** Fusión entre la especificación original (`FRONTEND_ANALISIS.md` del backend) y la base de código existente del proyecto Ionic.

---

## 1. Descripción General

**AutoNex** es un aplicativo web/móvil para la gestión integral de talleres mecánicos automotrices, propiedad de **GUI&CAR, C.A.** Consume la API REST en ASP.NET Core 10 y está orientado a tres perfiles de usuario: **Admin**, **Mechanic** y **Receptionist**.

---

## 2. Stack Tecnológico

| Componente | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework | Ionic (Angular) | 8+ | UI cross-platform, mobile-first, ecosistema maduro |
| Lenguaje | TypeScript | ~5.9 | Tipado estricto, alineado con el backend |
| Estilos | Ionic CSS + SCSS | — | Complementado con estilos globales y tema corporativo |
| Fuente | Poppins | — | Tipografía corporativa ya integrada |
| Fechas | date-fns | ^4.1.0 | Ligera, árbol de importación reducido |
| Formularios | Angular Reactive Forms | — | Validación síncrona/asíncrona |
| Peticiones HTTP | Angular HttpClient | — | Con interceptors y tipado genérico |
| Estado | Angular Signals | — | Estado reactivo nativo, sin librerías externas |
| Gráficos | ngx-charts | 20+ | Visualización financiera (dashboard) |
| UI Components | Ionic UI Components | — | ion-list, ion-item, ion-modal, ion-toast, etc. |
| Íconos | Ionicons | ^7.0.0 | Set cerrado, sin librería adicional |
| Nativo | Capacitor | 8.2.0 | APIs nativas (cámara, almacenamiento, push) |
| Linting | ESLint | ^9.16.0 | Calidad de código |
| Router | Angular Router | — | Lazy loading con loadComponent |
| Carousel/Slider | Swiper | ^12.1.2 | Onboarding y galerías |

---

## 3. Paleta de Colores Corporativa

| Color | Hex | Uso |
|---|---|---|
| Rojo Corporativo | `#D31D1D` | Primary, botones, acentos, danger |
| Gris Antracita | `#323232` | Secondary, fondos oscuros, medium |
| Gris Platino | `#E0E0E0` | Tertiary, textos secundarios |
| Gris Oscuro | `#121212` | Dark, fondo dark mode |
| Blanco Nieve | `#FFFFFF` | Light, fondo modo claro |

> **Nota:** Los colores ya están implementados en `src/theme/variables.scss` con soporte completo para light/dark mode (iOS y Material Design).

---

## 4. Estructura del Proyecto

```
src/
├── index.html
├── main.ts
├── theme/
│   └── variables.scss              ← Ionic CSS custom properties (corporativo)
├── global.scss                     ← Estilos globales Ionic + Poppins
├── environments/
│   ├── environment.ts              ← desarrollo (api: localhost:5212)
│   └── environment.prod.ts         ← producción
├── app/
│   ├── app.component.ts            ← Standalone root component
│   ├── app.component.html          ← <ion-app> + <ion-router-outlet>
│   ├── app.config.ts               ← Application config (providers)
│   ├── app.routes.ts               ← Rutas con loadComponent lazy
│   ├── layouts/
│   │   ├── auth-layout.component.ts
│   │   └── dashboard-layout.component.ts
│   ├── core/
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── services/
│   │   │   ├── api.service.ts       ← Servicio base HTTP
│   │   │   ├── auth-state.service.ts ← Signals de autenticación
│   │   │   └── auth.service.ts      ← Login/register/logout
│   │   └── models/
│   │       ├── api-response.model.ts
│   │       ├── auth.model.ts
│   │       ├── user.model.ts
│   │       ├── client.model.ts
│   │       ├── vehicle.model.ts
│   │       ├── supplier.model.ts
│   │       ├── consumable.model.ts
│   │       ├── tool.model.ts
│   │       ├── service.model.ts
│   │       ├── service-order.model.ts
│   │       ├── mileage-alert.model.ts
│   │       ├── financial-record.model.ts
│   │       ├── notification.model.ts
│   │       └── inventory-movement.model.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   └── login.component.html
│   │   │   └── register/
│   │   │       ├── register.component.ts
│   │   │       └── register.component.html
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.component.html
│   │   ├── clients/
│   │   │   ├── client-list/
│   │   │   ├── client-form/
│   │   │   └── client-detail/
│   │   ├── vehicles/
│   │   │   ├── vehicle-list/
│   │   │   ├── vehicle-form/
│   │   │   └── vehicle-detail/
│   │   ├── suppliers/
│   │   │   ├── supplier-list/
│   │   │   └── supplier-form/
│   │   ├── consumables/
│   │   │   ├── consumable-list/
│   │   │   ├── low-stock/
│   │   │   └── consumable-form/
│   │   ├── tools/
│   │   │   ├── tool-list/
│   │   │   └── tool-form/
│   │   ├── services/
│   │   │   ├── service-list/
│   │   │   ├── service-form/
│   │   │   └── service-detail/
│   │   ├── service-orders/
│   │   │   ├── service-order-list/
│   │   │   ├── service-order-form/
│   │   │   └── service-order-detail/
│   │   ├── mileage-alerts/
│   │   │   ├── mileage-alert-list/
│   │   │   └── mileage-alert-form/
│   │   ├── financial-records/
│   │   │   ├── financial-record-list/
│   │   │   ├── financial-record-form/
│   │   │   └── financial-summary/
│   │   ├── notifications/
│   │   │   └── notification-list/
│   │   ├── users/
│   │   │   └── user-list/
│   │   └── inventory-movements/
│   │       └── inventory-movement-list/
│   └── shared/
│       ├── components/
│       │   ├── empty-state/
│       │   ├── loading-spinner/
│       │   └── status-badge/
│       ├── pipes/
│       │   ├── enum-label.pipe.ts
│       │   ├── currency-formatter.pipe.ts
│       │   └── date-format.pipe.ts
│       └── utils/
│           ├── pagination-helper.ts
│           └── form-validators.ts
```

### 4.1 Archivos a conservar del proyecto actual

| Archivo | Acción |
|---|---|
| `src/theme/variables.scss` | Conservar (colores corporativos + dark mode) |
| `src/global.scss` | Conservar (Poppins + imports Ionic) |
| `src/app/app.scss` | Conservar y migrar (estilos utilitarios: loaders, avatars, buttons) |
| `src/app/validators/email.validators.ts` | Conservar |
| `src/app/validators/password.validator.ts` | Conservar |
| `src/app/utils/humanize.pipe.ts` | Evaluar si se adapta o reemplaza |
| `src/assets/` | Conservar (logo, imágenes) |
| `.eslintrc.json` | Conservar |
| `capacitor.config.ts` | Conservar (actualizar appId si es necesario) |
| `angular.json` | Conservar |
| `tsconfig.json` | Conservar |

### 4.2 Archivos a reemplazar/eliminar del proyecto actual

| Archivo | Reemplazar por |
|---|---|
| `src/app/app.module.ts` | `src/app/app.config.ts` (standalone) |
| `src/app/app-routing.module.ts` | `src/app/app.routes.ts` |
| `src/app/services/auth.service.ts` | `core/services/auth.service.ts` + `auth-state.service.ts` |
| `src/app/services/data.service.ts` | Eliminar (datos mock de red social) |
| `src/app/guards/auth.guard.ts` | `core/guards/auth.guard.ts` (adaptar) |
| `src/app/pages/*` | Todas las páginas de red social → páginas del taller |
| `src/app/components/*` | Componentes de red social → shared components |
| `src/app/data/data.json` | Eliminar (mock data de red social) |
| `src/app/home/` | Eliminar (scaffolding por defecto) |

---

## 5. Mapa de Rutas

| Ruta | Componente | Layout | Guard | Rol |
|---|---|---|---|---|
| `/auth/login` | `LoginComponent` | `AuthLayout` | — | Público |
| `/auth/register` | `RegisterComponent` | `AuthLayout` | `AuthGuard` | Admin |
| `/dashboard` | `DashboardComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/clients` | `ClientListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/clients/new` | `ClientFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/clients/:id` | `ClientDetailComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/clients/:id/edit` | `ClientFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/vehicles` | `VehicleListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/vehicles/new` | `VehicleFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/vehicles/:id` | `VehicleDetailComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/vehicles/:id/edit` | `VehicleFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/suppliers` | `SupplierListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/suppliers/new` | `SupplierFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/suppliers/:id/edit` | `SupplierFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/consumables` | `ConsumableListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/consumables/low-stock` | `LowStockComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/consumables/new` | `ConsumableFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/consumables/:id/edit` | `ConsumableFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/tools` | `ToolListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/tools/new` | `ToolFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/tools/:id/edit` | `ToolFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/services` | `ServiceListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/services/new` | `ServiceFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/services/:id` | `ServiceDetailComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/services/:id/edit` | `ServiceFormComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/service-orders` | `ServiceOrderListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/service-orders/new` | `ServiceOrderFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/service-orders/:id` | `ServiceOrderDetailComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/service-orders/:id/edit` | `ServiceOrderFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/mileage-alerts` | `MileageAlertListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/mileage-alerts/new` | `MileageAlertFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/mileage-alerts/:id/edit` | `MileageAlertFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/financial-records` | `FinancialRecordListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/financial-records/summary` | `FinancialSummaryComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/financial-records/new` | `FinancialRecordFormComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/notifications` | `NotificationListComponent` | `DashboardLayout` | `AuthGuard` | Todos |
| `/users` | `UserListComponent` | `DashboardLayout` | `AuthGuard` | Admin |
| `/inventory-movements` | `InventoryMovementListComponent` | `DashboardLayout` | `AuthGuard` | Todos |

Todas las rutas implementadas con **lazy loading** mediante `loadComponent` en `app.routes.ts`.

---

## 6. Flujo de Autenticación

```
Login ──> POST /api/auth/login ──> JWT ──> localStorage + AuthStateService
                                              │
                                              ▼
                                    AuthInterceptor añade
                                    Bearer token a cada request
                                              │
                                              ▼
                                    AuthGuard verifica token
                                    (existencia + expiración)
                                              │
                                              ▼
                                    RoleGuard verifica claim
                                    "role" contra ruta requerida
                                              │
                                              ▼
                                    ErrorInterceptor captura
                                    401 ──> limpia estado ──> redirect /auth/login
```

### 6.1 AuthStateService (Signals)

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userSignal = signal<UserResponse | null>(null);
  private readonly tokenSignal = signal<string | null>(
    localStorage.getItem('token'),
  );

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly role = computed(() => this.userSignal()?.role ?? null);

  setAuth(user: UserResponse, token: string): void {
    localStorage.setItem('token', token);
    this.userSignal.set(user);
    this.tokenSignal.set(token);
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.userSignal.set(null);
    this.tokenSignal.set(null);
  }
}
```

### 6.2 AuthService

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly api: ApiService,
    private readonly authState: AuthStateService,
  ) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', request);
  }

  logout(): void {
    this.authState.clearAuth();
  }
}
```

> **Nota:** La UI de login del proyecto actual (con fondo, logo de AutoNex, selector de idioma, iconos sociales, toggle de contraseña, etc.) se conserva y adapta al nuevo flujo.

---

## 7. Manejo de Estado con Signals

No se utiliza NgRx. El estado se gestiona con **Angular Signals**.

### 7.1 Patrón por Feature Service

Cada módulo de negocio tiene un servicio que expone Signals para:
- `data`: lista o entidad actual
- `loading`: booleano de carga
- `error`: mensaje de error
- `pagination`: metadatos de paginación (para listas)

```typescript
@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly clientsSignal = signal<ClientResponse[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly paginationSignal = signal<PaginationMeta | null>(null);

  readonly clients = this.clientsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  constructor(private readonly api: ApiService) {}

  loadAll(params?: ClientFilterParams): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getPaged<ClientResponse>('/clients', params).pipe(
      tap(response => {
        this.clientsSignal.set(response.items);
        this.paginationSignal.set({
          page: response.page,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        });
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }
}
```

---

## 8. ApiService — Servicio Base HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:5212/api';

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params })
      .pipe(map(res => res.data));
  }

  getPaged<T>(path: string, params?: HttpParams): Observable<PagedResponse<T>> {
    return this.http
      .get<ApiResponse<PagedResponse<T>>>(`${this.baseUrl}${path}`, { params })
      .pipe(map(res => res.data));
  }

  getById<T>(path: string, id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`)
      .pipe(map(res => res.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(res => res.data));
  }

  put<T>(path: string, id: number, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`, body)
      .pipe(map(res => res.data));
  }

  patch<T>(path: string, id: number, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`, body)
      .pipe(map(res => res.data));
  }

  delete<T>(path: string, id: number): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${path}/${id}`)
      .pipe(map(res => res.data));
  }
}
```

---

## 9. Interceptors

### 9.1 AuthInterceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authState: AuthStateService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const token = this.authState.token();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next(req);
  }
}
```

### 9.2 ErrorInterceptor

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authState: AuthStateService,
    private readonly router: Router,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authState.clearAuth();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => this.normalizeError(error));
      }),
    );
  }

  private normalizeError(error: HttpErrorResponse): AppError {
    if (error.status === 400) {
      return { message: error.error?.message, validationErrors: error.error?.errors };
    }
    if (error.status === 403) {
      return { message: 'No tienes permisos para esta acción' };
    }
    return { message: 'Error inesperado. Intenta de nuevo.' };
  }
}
```

---

## 10. Guards

### 10.1 AuthGuard

```typescript
export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAuthenticated()) return true;

  return router.parseUrl('/auth/login');
};
```

### 10.2 RoleGuard

```typescript
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    const role = authState.role();

    if (role && allowedRoles.includes(role)) return true;

    return router.parseUrl('/dashboard');
  };
};
```

---

## 11. Diseño de Componentes (Ionic)

### 11.1 Estructura de Layout

**Auth Layout:**
```html
<ion-content class="ion-padding">
  <ion-router-outlet></ion-router-outlet>
</ion-content>
```

**Dashboard Layout:**
```html
<ion-split-pane contentId="main-content">
  <ion-menu contentId="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>AutoNex</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        @for (item of menuItems; track item.path) {
          <ion-menu-toggle auto-hide="false">
            <ion-item [routerLink]="item.path" routerDirection="root">
              <ion-icon [name]="item.icon" slot="start"></ion-icon>
              <ion-label>{{ item.label }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        }
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-router-outlet id="main-content"></ion-router-outlet>
</ion-split-pane>
```

### 11.2 Menú del Dashboard

| Módulo | Ícono | Roles |
|---|---|---|
| Dashboard | `grid-outline` | Todos |
| Clientes | `people-outline` | Todos |
| Vehículos | `car-outline` | Todos |
| Proveedores | `business-outline` | Todos |
| Consumibles | `color-palette-outline` | Todos |
| Stock Bajo | `alert-circle-outline` | Todos |
| Herramientas | `build-outline` | Todos |
| Servicios | `construct-outline` | Todos |
| Órdenes | `clipboard-outline` | Todos |
| Alertas Km | `speedometer-outline` | Todos |
| Finanzas | `cash-outline` | Todos |
| Notificaciones | `notifications-outline` | Todos |
| Usuarios | `person-add-outline` | Admin |
| Movimientos | `swap-horizontal-outline` | Todos |

### 11.3 Patrón de Lista

```html
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Clientes</ion-title>
    <ion-buttons slot="end">
      <ion-button routerLink="/clients/new" *ngIf="canCreate()">
        <ion-icon name="add" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-searchbar [(ngModel)]="searchTerm"
                 (ionInput)="onSearch($event)"
                 placeholder="Buscar..."
                 debounce="300">
  </ion-searchbar>

  @if (loading()) {
    <ion-list>
      @for (_ of [1,2,3,4,5]; track $index) {
        <ion-item>
          <ion-label>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </ion-label>
        </ion-item>
      }
    </ion-list>
  } @else if (data().length === 0) {
    <app-empty-state icon="people-outline" message="No se encontraron resultados">
    </app-empty-state>
  } @else {
    <ion-list>
      @for (item of data(); track item.id) {
        <ion-item [routerLink]="[detailRoute, item.id]" detail>
          <ion-label>
            <h2>{{ item.fullName }}</h2>
            <p>{{ item.phone }}</p>
          </ion-label>
          <ion-note slot="end">{{ item.createdAt | dateFormat }}</ion-note>
        </ion-item>
      }
    </ion-list>

    <ion-infinite-scroll (ionInfinite)="loadMore($event)">
      <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
  }
</ion-content>
```

### 11.4 Patrón de Formulario

```html
<ion-header>
  <ion-toolbar color="primary">
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
    <ion-title>{{ isEditMode() ? 'Editar' : 'Nuevo' }} Cliente</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="onCancel()" color="light">Cancelar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <ion-list>
      <ion-item>
        <ion-label position="floating">Nombre Completo</ion-label>
        <ion-input formControlName="fullName" type="text"></ion-input>
      </ion-item>
      @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
        <ion-note color="danger" class="px-4">El nombre es requerido</ion-note>
      }
      <!-- más campos -->
    </ion-list>

    <ion-button type="submit" expand="block" class="mt-6"
                [disabled]="form.invalid || saving()">
      {{ saving() ? 'Guardando...' : 'Guardar' }}
    </ion-button>
  </form>
</ion-content>
```

---

## 12. Modelos Compartidos (TypeScript Interfaces)

### 12.1 Enums

```typescript
export enum UserRole {
  Admin = 'Admin',
  Mechanic = 'Mechanic',
  Receptionist = 'Receptionist',
}

export enum ConsumableCategory {
  Oil = 'Oil',
  SparkPlug = 'SparkPlug',
  Coolant = 'Coolant',
  Grease = 'Grease',
  BrakeFluid = 'BrakeFluid',
  Other = 'Other',
}

export enum ToolCategory {
  Jack = 'Jack',
  Wrench = 'Wrench',
  Ratchet = 'Ratchet',
  Screwdriver = 'Screwdriver',
  Hammer = 'Hammer',
  Other = 'Other',
}

export enum ToolStatus {
  Available = 'Available',
  Damaged = 'Damaged',
  Lost = 'Lost',
}

export enum ServiceOrderStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum FinancialRecordType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum FinancialCategory {
  Services = 'Services',
  Suppliers = 'Suppliers',
  Rent = 'Rent',
  Payroll = 'Payroll',
  Utilities = 'Utilities',
  Other = 'Other',
}

export enum NotificationType {
  WhatsApp = 'WhatsApp',
  Sms = 'Sms',
  Email = 'Email',
}

export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed',
}

export enum MovementType {
  In = 'In',
  Out = 'Out',
}
```

### 12.2 Envelope y Paginación

```typescript
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
```

### 12.3 Auth

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
}
```

### 12.4 Clientes

```typescript
export interface ClientResponse {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  vehicles?: VehicleBriefResponse[];
}

export interface CreateClientRequest {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
}

export type UpdateClientRequest = CreateClientRequest;
```

### 12.5 Vehículos

```typescript
export interface VehicleBriefResponse {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface VehicleResponse {
  id: number;
  clientId: number;
  clientName: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  createdAt: string;
}

export interface CreateVehicleRequest {
  clientId: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
}

export interface UpdateVehicleRequest {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
}
```

### 12.6 Órdenes de Servicio

```typescript
export interface ServiceOrderResponse {
  id: number;
  vehicleId: number;
  vehicleInfo: string;
  clientId: number;
  clientName: string;
  userId: number;
  userName: string;
  currentKm: number;
  date: string;
  status: ServiceOrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  items: ServiceOrderItemResponse[];
}

export interface ServiceOrderItemResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  serviceVariantId?: number;
  serviceVariantName?: string;
  consumableId?: number;
  consumableName?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateServiceOrderRequest {
  vehicleId: number;
  clientId: number;
  currentKm: number;
  notes?: string;
  items: CreateServiceOrderItemRequest[];
}

export interface CreateServiceOrderItemRequest {
  serviceId: number;
  serviceVariantId?: number;
  consumableId?: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateServiceOrderStatusRequest {
  status: ServiceOrderStatus;
}
```

### 12.7 Modelos Restantes

Los modelos para `Supplier`, `Consumable`, `Tool`, `Service`, `ServiceVariant`, `MileageAlert`, `FinancialRecord`, `FinancialSummary`, `CategorySummary`, `Notification` e `InventoryMovement` siguen la misma estructura que sus correspondientes DTOs del backend. Ver `docs/API.md` del backend para la referencia completa de campos.

---

## 13. AppConfig (Standalone)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
};
```

---

## 14. Convenciones de Código

| Aspecto | Convención |
|---|---|
| Nomenclatura TypeScript | `camelCase` para variables/propiedades/métodos; `PascalCase` para clases/interfaces/tipos |
| Nomenclatura archivos | `kebab-case` (ej. `client-list.component.ts`) |
| Estructura imports | Angular core → librerías → servicios → modelos → utils |
| Standalone components | Todos los componentes son standalone, sin NgModules |
| Detección de cambios | `ChangeDetectionStrategy.OnPush` en todos los componentes |
| Inyección de dependencias | `inject()` function (no constructor injection) |
| Formateo | ESLint con reglas existentes |
| Estilos | Ionic CSS Custom Properties + SCSS; usar `--ion-color-*` |
| Tipado | `strict: true` en tsconfig; evitar `any` |
| Modelos | Interfaces TypeScript: `ClientResponse`, `CreateClientRequest`, etc. |
| Enums | TypeScript enums con mismos valores que el backend (`Admin = 'Admin'`) |
| Observables | Usar `takeUntilDestroyed` o `DestroyRef` para evitar suscripciones huérfanas |
| Paginación | Server-side; `ion-infinite-scroll` o `ion-pagination` |
| Navegación | `ion-router-outlet` + `[routerLink]` + `routerDirection` |
| Componentes Ionic | Preferir `ion-*` sobre HTML nativo |
| Alertas/Confirmaciones | `IonAlertController` e `IonToastController` |
| Íconos | Ionicons (`ion-icon`) |

---

## 15. Variables de Entorno

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5212/api',
  version: '0.0.1',
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.autonex.com/api',  // Ejemplo
  version: '0.0.1',
};
```

---

## 16. Plan de Implementación por Etapas

### Etapa 0 — Migración a Standalone (Preparación)

| Actividad | Entregable |
|---|---|
| Crear `app.config.ts` con configuración standalone | Archivo de configuración |
| Crear `app.routes.ts` con lazy loading vía loadComponent | Mapa de rutas |
| Migrar `AppComponent` a standalone | Componente raíz standalone |
| Crear layouts (auth-layout, dashboard-layout) | Layouts standalone |
| Migrar `AuthGuard` a función standalone | Guard funcional |
| Crear `RoleGuard` | Guard funcional |
| Crear `ApiService` | Servicio base HTTP |
| Crear `AuthStateService` (Signals) | Servicio de estado |
| Crear `AuthInterceptor` + `ErrorInterceptor` | Interceptores funcionales |
| Crear modelos (`core/models/`) | Todas las interfaces TypeScript |
| Crear pipe `dateFormat`, `enumLabel`, `currencyFormatter` | Pipes standalone |
| Crear componentes shared: `empty-state`, `loading-spinner`, `status-badge` | Componentes standalone |
| Actualizar `environment.ts` con URL del backend .NET | Variables de entorno |

### Etapa 1 — Fundación (Sprint 1, Semana 1)

| Actividad | Entregable |
|---|---|
| LoginComponent (adaptar UI existente al nuevo flujo) | Login funcional con Signals |
| RegisterComponent (adaptar UI existente) | Register funcional |
| DashboardComponent | Cards de resumen con datos reales |
| Menú del dashboard con ion-split-pane | Navegación completa |

### Etapa 2 — Clientes y Vehículos (Sprint 1, Semana 2)

| Actividad | Entregable |
|---|---|
| `ClientService` + Signals | Servicio CRUD |
| ClientListComponent | Lista con búsqueda y paginación |
| ClientFormComponent | Formulario creación/edición |
| ClientDetailComponent | Vista detalle con vehículos |
| `VehicleService` + Signals | Servicio CRUD |
| VehicleListComponent | Lista con búsqueda |
| VehicleFormComponent | Formulario con selector de cliente |
| VehicleDetailComponent | Vista detalle |

### Etapa 3 — Catálogos (Sprint 2, Semana 3)

| Actividad | Entregable |
|---|---|
| Supplier CRUD | Lista + Formulario |
| ConsumableListComponent | Filtro por categoría |
| LowStockComponent | Alerta visual stock mínimo |
| ConsumableFormComponent | Selector de proveedor |
| ToolListComponent | Filtros categoría/estado |
| ToolFormComponent | Formulario con estado |

### Etapa 4 — Servicios (Sprint 2, Semana 3)

| Actividad | Entregable |
|---|---|
| Servicios CRUD | Lista + Formulario + Detalle con variantes |
| Variantes inline | CRUD en detalle del servicio |

### Etapa 5 — Órdenes de Servicio (Sprint 3, Semana 4)

| Actividad | Entregable |
|---|---|
| ServiceOrder CRUD | Lista con filtros, formulario con grid de items dinámico, cálculo automático de total |
| Status management | PATCH de estado con confirmación |

### Etapa 6 — Alertas y Notificaciones (Sprint 3, Semana 4)

| Actividad | Entregable |
|---|---|
| MileageAlertService + Signals | CRUD + filtro due |
| MileageAlertListComponent | Indicador visual de vencimiento |
| NotificationListComponent | Historial con filtros |

### Etapa 7 — Finanzas (Sprint 4, Semana 5)

| Actividad | Entregable |
|---|---|
| FinancialRecordService + Signals | CRUD + summary + byCategory |
| FinancialRecordListComponent | Filtros tipo/fecha/categoría |
| FinancialRecordFormComponent | Selectores tipo/categoría |
| FinancialSummaryComponent | Gráficos ngx-charts |

### Etapa 8 — Usuarios y Movimientos (Sprint 4, Semana 5)

| Actividad | Entregable |
|---|---|
| UserListComponent | Solo lectura con roles (Admin) |
| InventoryMovementListComponent | Historial de movimientos |

### Etapa 9 — Pulido (Sprint 4, Semana 6)

| Actividad | Entregable |
|---|---|
| Estados de carga | ion-skeleton-text en todas las listas |
| Estados vacíos | empty-state component |
| Estados de error | ion-toast + ion-alert |
| Pull-to-refresh | ion-refresher |
| Responsive | ion-split-pane adaptable |
| Dark mode | Ya implementado en variables.scss |
| PWA | @angular/pwa + Capacitor |

---

## 17. API Reference

Para la especificación completa de cada endpoint, incluyendo ejemplos request/response y códigos HTTP, consultar:

- `docs/API.md` del backend — Referencia completa de la API REST
- `docs/ARCHITECTURE.md` del backend — Modelo de datos y relaciones
- `docs/MAINTENANCE_INTERVALS.md` del backend — Intervalos de mantenimiento
- `docs/AUDITORIA_DOCS_VS_CODIGO.md` del backend — Discrepancias conocidas

---

## 18. Notas de Migración

### Desde el proyecto actual (red social) al nuevo (taller)

1. **Login UI**: El diseño actual del login (con fondo Unsplash, logo AutoNex "GUI&CAR, C.A.", iconos sociales, selector de idioma, Poppins) se conserva y se adapta al nuevo `AuthService` + `AuthStateService` con Signals.

2. **Tema**: El `variables.scss` actual ya tiene la paleta corporativa correcta con soporte dark mode. No requiere cambios sustanciales.

3. **Validators**: Los validators de email y password del proyecto actual se conservan.

4. **Estructura de páginas**: Las 21 páginas de red social se reemplazan completamente por las 14 módulos del taller mecánico.

5. **Servicios**: `data.service.ts` (mock data de red social) se elimina. Se reemplaza por feature services con Signals.

6. **Configuración build**: `angular.json` ya produce el output en `www/` para Capacitor, correcto.

7. **Capacitor**: `capacitor.config.ts` usa `appId: 'io.ionic.starter'` — debe actualizarse al ID real de la app.

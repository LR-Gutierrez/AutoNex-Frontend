# AutoNex Frontend — Especificaciones Técnicas

> **Propósito:** Este documento define la arquitectura, stack tecnológico, estructura de directorios, mapa de navegación, flujo de autenticación, convenciones de código y estado actual del frontend de AutoNex.

---

## 1. Descripción General

**AutoNex** es un aplicativo web/móvil para la gestión integral de talleres mecánicos automotrices, propiedad de **GUI&CAR, C.A.** Consume la API REST en ASP.NET Core 10 y está orientado a tres perfiles de usuario: **Admin**, **Mechanic** y **Receptionist**.

---

## 2. Stack Tecnológico

| Componente | Tecnología | Versión |
|---|---|---|
| Framework UI | Ionic (Angular) | 8.x |
| Framework Web | Angular | 20.x |
| Lenguaje | TypeScript | ~5.9 |
| Estilos | Tailwind CSS v4 + SCSS + Ionic CSS Custom Properties | — |
| Fuente | Poppins | — |
| Formularios | Angular Reactive Forms | — |
| Peticiones HTTP | Angular HttpClient | — |
| Estado | Angular Signals | — |
| UI Components | Ionic standalone (`@ionic/angular/standalone`) | — |
| Íconos | Ionicons | 7.x |
| Nativo | Capacitor | 8.x |
| Linting | ESLint | ~9.x |
| Router | Angular Router | — |

---

## 3. Estructura del Proyecto

```
src/
├── index.html
├── main.ts
├── tailwind.css
├── theme/
│   └── variables.scss
├── global.scss
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app/
    ├── app.component.ts
    ├── app.config.ts
    ├── app.routes.ts
    ├── core/
    │   ├── guards/
    │   │   ├── auth.guard.ts
    │   │   └── role.guard.ts
    │   ├── interceptors/
    │   │   ├── auth.interceptor.ts
    │   │   └── error.interceptor.ts
    │   ├── services/
    │   │   ├── api.service.ts
    │   │   ├── auth-state.service.ts
    │   │   ├── auth.service.ts
    │   │   ├── page-title.service.ts
    │   │   ├── refresh.service.ts
    │   │   ├── client.service.ts
    │   │   ├── vehicle.service.ts
    │   │   ├── service-order.service.ts
    │   │   ├── financial-record.service.ts
    │   │   └── ...
    │   └── models/
    │       ├── api-response.model.ts
    │       ├── user.model.ts
    │       ├── client.model.ts
    │       ├── vehicle.model.ts
    │       └── ...
    ├── layouts/
    │   ├── auth-layout.component.ts
    │   └── dashboard-layout.component.ts
    ├── components/
    │   ├── sidebar/
    │   ├── topbar/
    │   └── user-avatar/
    ├── features/
    │   ├── auth/
    │   │   ├── login/
    │   │   └── register/
    │   ├── dashboard/
    │   └── form-demo/
    └── shared/
        ├── components/
        │   ├── auth-branding/
        │   ├── auth-button/
        │   ├── form-field/
        │   ├── select-field/
        │   ├── date-field/
        │   └── textarea-field/
        ├── directives/
        │   └── reveal.directive.ts
        ├── pipes/
        │   ├── enum-label.pipe.ts
        │   ├── currency-formatter.pipe.ts
        │   └── date-format.pipe.ts
        └── validators/
            ├── email.validators.ts
            └── password.validator.ts
```

---

## 4. Mapa de Rutas

| Ruta | Componente | Layout | Guard |
|---|---|---|---|
| `/auth/login` | `LoginComponent` | `AuthLayout` | Público |
| `/auth/register` | `RegisterComponent` | `AuthLayout` | `AuthGuard` |
| `/dashboard` | `DashboardComponent` | `DashboardLayout` | `AuthGuard` |
| `/form-demo` | `FormDemoComponent` | `DashboardLayout` | `AuthGuard` |
| (futuras) | `*Component` | `DashboardLayout` | `AuthGuard` |

Todas las rutas implementadas con **lazy loading** mediante `loadComponent` en `app.routes.ts`.

---

## 5. Flujo de Autenticación

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
                                    ErrorInterceptor captura
                                    401 ──> limpia estado ──> redirect /auth/login
```

---

## 6. Diseño de Layout (Ionic Framework)

### 6.1 Dashboard Layout

El layout sigue el patrón documentado por Ionic Framework: `ion-header` y `ion-content` como hermanos directos dentro de un contenedor flexible, con `ion-split-pane` para el menú responsive.

```html
<ion-split-pane contentId="main-content" class="dashboard-theme">
  <ion-menu contentId="main-content" menuId="main-menu" type="overlay">
    <app-sidebar />
  </ion-menu>

  <div class="main-pane" id="main-content">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <app-topbar />
      </ion-toolbar>
    </ion-header>
    <ion-content class="app-page">
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <router-outlet></router-outlet>
    </ion-content>
  </div>
</ion-split-pane>
```

**Componentes del layout:**

| Componente | Responsabilidad |
|---|---|
| `app-dashboard-layout` | `ion-split-pane`, `ion-menu`, `ion-header`, `ion-content`, `router-outlet` |
| `app-sidebar` | Branding, lista de navegación con `isActive()`, botón "Nuevo Servicio" |
| `app-topbar` | Título de página (vía `PageTitleService`), buscador, acciones, perfil de usuario |

Las páginas hijas (dashboard, form-demo, etc.) renderizan **únicamente su contenido HTML**, sin `ion-content` propio, ya que este es provisto por el layout.

### 6.2 Auth Layout

```html
<ion-content class="ion-padding">
  <router-outlet></router-outlet>
</ion-content>
```

### 6.3 Menú del Dashboard

| Módulo | Ícono |
|---|---|
| Dashboard | `grid-outline` |
| Clientes | `people-outline` |
| Vehículos | `car-outline` |
| Proveedores | `business-outline` |
| Consumibles | `water-outline` |
| Stock Bajo | `warning-outline` |
| Herramientas | `build-outline` |
| Servicios | `construct-outline` |
| Órdenes | `document-text-outline` |
| Alertas Km | `speedometer-outline` |
| Finanzas | `cash-outline` |
| Notificaciones | `notifications-outline` |
| Formulario Demo | `code-slash-outline` |

---

## 7. AppConfig (Standalone)

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

## 8. Manejo de Estado con Signals

No se utiliza NgRx. El estado se gestiona con **Angular Signals**.

Cada módulo de negocio tiene un servicio que expone Signals para:
- `data`: lista o entidad actual
- `loading`: booleano de carga
- `error`: mensaje de error
- `pagination`: metadatos de paginación

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
}
```

---

## 9. Convenciones de Código

| Aspecto | Convención |
|---|---|
| Nomenclatura TypeScript | `camelCase` para variables/propiedades/métodos; `PascalCase` para clases/interfaces |
| Nomenclatura archivos | `kebab-case` |
| Standalone components | Todos los componentes son standalone, sin NgModules |
| Inyección de dependencias | `inject()` function |
| Estilos | Tailwind CSS v4 + Ionic CSS Custom Properties + SCSS |
| Tipado | `strict: true` en tsconfig |
| Modelos | Interfaces TypeScript: `ClientResponse`, `CreateClientRequest`, etc. |
| Enums | TypeScript enums con mismos valores que el backend |
| Observables | Usar `DestroyRef` o suscripciones gestionadas |
| Componentes Ionic | Importar desde `@ionic/angular/standalone` |
| Estructura layout | `ion-header` + `ion-content` como hermanos directos (patrón Ionic) |
| Navegación | `router-outlet` + `[routerLink]` |

---

## 10. Servicios Principales

### PageTitleService

Servicio singleton que expone señales de `title` y `subtitle` para que el `TopbarComponent` muestre el título de la página actual. Cada componente de ruta establece su título en `ngOnInit`:

```typescript
ngOnInit() {
  this.pageTitle.title.set('Panel de Control');
  this.pageTitle.subtitle.set('Resumen operativo');
}
```

### RefreshService

Mecanismo de comunicación entre el layout y las páginas hijas para pull-to-refresh:

```typescript
@Injectable({ providedIn: 'root' })
export class RefreshService {
  private readonly refreshSource = new Subject<void>();
  readonly refresh$ = this.refreshSource.asObservable();

  trigger(): void { this.refreshSource.next(); }
}
```

El `DashboardLayoutComponent` publica en este servicio cuando el `ion-refresher` se activa. Las páginas hijas se suscriben para recargar sus datos.

---

## 11. Shared Components

| Componente | Uso |
|---|---|
| `AuthBrandingComponent` | Logo + nombre corporativo. Variantes: `vertical` (por defecto) y `horizontal` (sidebar) |
| `FormFieldComponent` | Input con icono, label, toggle de contraseña, mensajes de error |
| `SelectFieldComponent` | Select con icono y opciones configurables |
| `DateFieldComponent` | Campo de fecha reutilizable |
| `TextareaFieldComponent` | Textarea con auto-crecimiento |
| `AuthButtonComponent` | Botón de submit con estado `loading` |
| `RevealDirective` | Animación de entrada con retardo configurable |

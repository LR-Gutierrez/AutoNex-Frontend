# AutoNex Frontend

Aplicación corporativa para la gestión de red de servicios automotrices, construida con **Angular 20** e **Ionic 8** bajo una arquitectura **Standalone Components** y **Feature-Based Design**.

---

## Arquitectura del Proyecto

```
src/
├── index.html
├── main.ts
├── tailwind.css                    ← Tailwind CSS v4 entry (import + custom variants)
├── theme/
│   └── variables.scss              ← Ionic CSS custom properties (corporativo)
├── global.scss                     ← Estilos globales + design tokens
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app/
    ├── app.component.ts            ← Standalone root (ion-app)
    ├── app.config.ts               ← Providers (Ionic, Router, HTTP)
    ├── app.routes.ts               ← Rutas lazy-loaded
    │
    ├── core/                       ← Capa transversal (singletons)
    │   ├── guards/                 ← auth.guard, role.guard
    │   ├── interceptors/           ← auth.interceptor, error.interceptor
    │   ├── models/                 ← Interfaces de dominio
    │   └── services/               ← API, Auth, AuthState, Refresh, PageTitle, entidades
    │
    ├── layouts/                    ← Layout wrappers
    │   ├── auth-layout.component.ts
    │   └── dashboard-layout.component.ts
    │
    ├── components/                 ← UI reutilizables del dashboard
    │   ├── sidebar/                ← Menú lateral de navegación
    │   ├── topbar/                 ← Barra superior (título, buscador, perfil)
    │   └── user-avatar/            ← Avatar de usuario
    │
    ├── features/                   ← Módulos de negocio (lazy-loaded)
    │   ├── auth/                   ← login, register
    │   ├── dashboard/              ← Panel de control
    │   └── form-demo/              ← Demo de componentes de formulario
    │
    └── shared/                     ← Recursos compartidos
        ├── components/
        │   ├── auth-branding/      ← Logo + título corporativo (vertical/horizontal)
        │   ├── auth-button/        ← Botón de submit con estado loading
        │   ├── date-field/         ← Campo de fecha reutilizable
        │   ├── form-field/         ← Input con label, icono, toggle password
        │   ├── select-field/       ← Select con icono y opciones
        │   └── textarea-field/     ← Textarea reutilizable
        ├── directives/
        │   └── reveal.directive.ts ← Animación de entrada al hacer scroll
        ├── pipes/                  ← enum-label, currency-formatter, date-format
        └── validators/             ← email.validators, password.validator
```

---

## Principios Arquitectónicos

### Standalone Components
Todos los componentes usan `standalone: true`. No existen NgModules funcionales. Las dependencias se importan directamente en cada componente.

### Feature-Based Design
Cada funcionalidad de negocio reside en `features/` como un módulo autónomo. Se cargan bajo demanda mediante `loadComponent` desde `app.routes.ts`.

### Capa Core (Infraestructura)
`core/services/` alberga servicios singleton, guards e interceptores. Es la única capa transversal y no contiene lógica de UI.

### Componentes Ionic
Se importan exclusivamente desde `@ionic/angular/standalone`. La estructura sigue los patrones documentados por Ionic Framework:
- `ion-header` y `ion-content` como hermanos directos
- `ion-split-pane` + `ion-menu` para el layout responsive
- `router-outlet` de Angular para el enrutamiento de páginas hijas

---

## Flujo de Navegación

```
/auth/login       → AuthLayout > LoginComponent
/auth/register    → AuthLayout > RegisterComponent
/dashboard        → DashboardLayout > DashboardComponent
/form-demo        → DashboardLayout > FormDemoComponent
```

Las rutas del dashboard están protegidas por `AuthGuard`. Las rutas no reconocidas redirigen a `/dashboard`.

---

## Tecnologías

| Componente | Tecnología |
|---|---|
| Framework UI | Ionic 8 (standalone imports) |
| Framework Web | Angular 20 |
| Lenguaje | TypeScript ~5.9 |
| Estilos | Tailwind CSS v4 + SCSS + Ionic CSS Custom Properties |
| PostCSS | @tailwindcss/postcss |
| Iconos | Ionicons 7 |
| Estado | Angular Signals |
| Formularios | Reactive Forms |
| HTTP | Angular HttpClient + interceptors |
| Router | Angular Router (lazy load vía `loadComponent`) |
| Fuente | Poppins |
| Plataforma | Capacitor 8 |
| Linting | ESLint ~9.16 |

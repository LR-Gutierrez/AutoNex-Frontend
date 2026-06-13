# AutoNex Frontend

Aplicación corporativa para la gestión de red de servicios automotrices, construida con **Angular 17+** e **Ionic 7** bajo una arquitectura **Standalone Components** y **Feature-Based Design (Domain-Driven Design)**.

---

## Arquitectura del Proyecto

```
src/app/
├── core/                      # Capa transversal (singletons, infraestructura)
│   ├── guards/                # AuthGuard, RoleGuard
│   ├── interceptors/          # AuthInterceptor, ErrorInterceptor
│   ├── models/                # Interfaces de dominio (14 modelos)
│   └── services/              # Servicios singleton (API, Auth, entidades)
│
├── layouts/                   # Layout wrappers (estructura de página)
│   ├── auth-layout.component.ts
│   └── dashboard-layout.component.ts
│
├── components/                # Componentes UI reutilizables
│   ├── topbar/                # Barra superior del dashboard
│   ├── user-avatar/           # Avatar de usuario (cuadrado/circular configurable)
│   ├── comment-item/
│   ├── contact-card/
│   ├── event-card/
│   ├── feed-card/
│   ├── follow-card/
│   ├── group-card/
│   ├── message-list-item/
│   ├── notification-item/
│   ├── story-avatar/
│   └── story-card/
│
├── features/                  # Módulos de negocio (Domain-Driven Design)
│   ├── auth/                  # Autenticación (login, register)
│   │   ├── login/
│   │   └── register/
│   └── dashboard/             # Panel de control principal
│
├── shared/                    # Recursos compartidos entre features
│   ├── components/            # empty-state, loading-spinner, status-badge
│   ├── pipes/                 # currency-formatter, date-format, enum-label, humanize
│   └── validators/            # email.validators, password.validator
│
├── pages/                     # (Referencia histórica - pendiente de migración)
│
├── app.component.ts           # Bootstrapping de la aplicación
├── app.config.ts              # Configuración de providers
└── app.routes.ts              # Definición de rutas lazy-loaded
```

---

## Principios Arquitectónicos

### Standalone Components
La aplicación utiliza exclusivamente el paradigma **Standalone Components** de Angular 17+, eliminando el uso de `NgModule` en la capa activa. Los componentes se declaran con `standalone: true` y se importan directamente donde se requieren.

### Feature-Based Design (Domain-Driven Design)
Cada funcionalidad de negocio reside en `features/` como un módulo autónomo que encapsula sus propios componentes, servicios (cuando son de ámbito local) y lógica de dominio. Esto permite:

- **Alto cohesion**: Cada feature agrupa todo lo necesario para su funcionamiento.
- **Bajo acoplamiento**: Los features se comunican exclusivamente a través de la capa `core/` (servicios singleton) y el enrutador.
- **Lazy Loading**: Cada feature se carga bajo demanda mediante `loadComponent`.

### Capa Core (Infraestructura)
`core/` alberga servicios singleton, guards, interceptores HTTP y modelos de dominio. Es la única capa transversal y no debe contener lógica de UI ni de features específicos.

### Layouts vs Components
- **`layouts/`**: Define la estructura outer de la página (sidebar + router outlet). Solo dos: `AuthLayout` y `DashboardLayout`.
- **`components/`**: Componentes de UI puramente visuales y reutilizables, sin dependencia directa de features de negocio.
- **`features/`**: Componentes de página que representan una funcionalidad completa del dominio.

### Shared
`shared/` agrupa recursos reutilizables que no pertenecen a un feature específico: pipes de transformación, validators y componentes genéricos de UI (empty-state, loading-spinner, status-badge).

---

## Flujo de Navegación

```
/auth/login       → AuthLayout > LoginComponent
/auth/register    → AuthLayout > RegisterComponent
/dashboard        → DashboardLayout > DashboardComponent
```

Las rutas están protegidas por `AuthGuard`. Cualquier ruta no reconocida redirige a `/dashboard`.

---

## Estructura de un Feature

Cada feature en `features/` sigue el patrón:

```
features/<feature>/
├── <feature>.component.ts      # Componente standalone (template + styles inline o separados)
├── <feature>.component.html    # (opcional) Template externo
└── <feature>.component.scss    # (opcional) Estilos externos
```

No se utilizan módulos NgModule. El lazy-loading se realiza directamente desde `app.routes.ts` mediante `loadComponent`.

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Layout wrappers | `*-layout.component.ts` | `dashboard-layout.component.ts` |
| Feature components | `<feature>.component.ts` | `dashboard.component.ts` |
| UI Components | `*-card`, `*-item`, `*-avatar` | `user-avatar.component.ts` |
| Servicios core | `*.service.ts` | `auth.service.ts` |
| Guards | `*.guard.ts` | `auth.guard.ts` |
| Interceptors | `*.interceptor.ts` | `auth.interceptor.ts` |
| Pipes | `*.pipe.ts` | `enum-label.pipe.ts` |
| Validators | `*.validators.ts` | `email.validators.ts` |
| Modelos | `*.model.ts` | `user.model.ts` |

---

## Tecnologías

- **Angular 17+** — Standalone Components, Signals, Control Flow (`@if`, `@for`)
- **Ionic 7** — UI Framework (standalone imports)
- **IonIcons** — Sistema de iconografía
- **RxJS** — Programación reactiva para servicios HTTP

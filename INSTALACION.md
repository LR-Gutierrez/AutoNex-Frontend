# AutoNex — Guía de Instalación

## Requisitos Previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Node.js | v20+ | `node -v` |
| npm | v9+ | `npm -v` |
| Git | Cualquiera reciente | `git --version` |

## Paso 1 — Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> AutoNex-Frontend
cd AutoNex-Frontend
```

## Paso 2 — Instalar dependencias

```bash
npm install
```

Esto instala Angular CLI 20, Ionic 8, Capacitor 8, TypeScript 5.9 y el resto de dependencias del proyecto.

## Paso 3 — Verificar la instalación

```bash
npx ng version
```

## Paso 4 — Ejecutar en desarrollo

```bash
npm start
```

El servidor se levanta en `http://localhost:4200/`.

## Paso 5 — Build de producción

```bash
npm run build
```

Los archivos compilados se generan en `www/`.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/            → Servicios singleton, guards, interceptores, modelos
│   ├── layouts/         → auth-layout, dashboard-layout
│   ├── components/      → sidebar, topbar, user-avatar
│   ├── features/        → Módulos de negocio lazy-loaded
│   └── shared/          → Componentes UI, pipes, validators, directivas
├── assets/              → Imágenes, iconos
├── theme/
│   └── variables.scss   → Variables de tema corporativo
├── environments/        → Configuración por entorno
└── global.scss          → Estilos globales + design tokens
```

## Solución de Problemas

### Error: `ng` no se reconoce

Usa `npx ng` en lugar de `ng`, o instala Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

### El puerto 4200 está ocupado

```bash
npx ng serve --port 4300
```

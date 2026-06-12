# AutoNex - Guía de Instalación

## Requisitos Previos

| Herramienta | Versión mínima             | Verificar con   |
| ----------- | -------------------------- | --------------- |
| Node.js     | v18+ (recomendado v22)     | `node -v`       |
| npm         | v9+                        | `npm -v`        |
| Git         | Cualquier versión reciente | `git --version` |

## Paso 1 - Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> AutoNex-Frontend
cd AutoNex-Frontend
```

## Paso 2 - Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias del proyecto, incluyendo:

- Angular 20
- Ionic 8
- Capacitor 8
- TypeScript 5.9

## Paso 3 - Verificar la instalación

```bash
npx ng version
```

Deberías ver algo como:

```
Angular CLI: 20.x.x
Node: 22.x.x
Angular: 20.x.x
```

## Paso 4 - Ejecutar en modo desarrollo

```bash
npm start
```

Esto levanta el servidor de desarrollo en:

```
http://localhost:4200/
```

El navegador debería abrirse automáticamente. Si no, abre esa URL manualmente.

## Paso 5 - Build de producción (opcional)

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `www/`.

## Paso 6 - Ejecutar linter (opcional)

```bash
npm run lint
```

## Compilar para plataformas móviles (opcional)

### Instalar Ionic CLI globalmente

```bash
npm install -g @ionic/cli
```

### Android

```bash
npm install @capacitor/android
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

### iOS (requiere macOS con Xcode)

```bash
npm install @capacitor/ios
npx cap add ios
npm run build
npx cap sync ios
npx cap open ios
```

## Estructura del Proyecto

```
autonex/
├── src/
│   ├── app/
│   │   ├── components/     → Componentes reutilizables
│   │   ├── guards/         → Guards de autenticación
│   │   ├── pages/          → Páginas de la app (lazy loaded)
│   │   ├── services/       → Servicios (auth, data, etc.)
│   │   ├── utils/          → Pipes y utilidades
│   │   ├── validators/     → Validadores personalizados
│   │   ├── app.module.ts   → Módulo raíz
│   │   └── app-routing.module.ts → Rutas principales
│   ├── assets/             → Imágenes, iconos, SVGs
│   ├── theme/
│   │   └── variables.scss  → Variables de tema corporativo
│   └── global.scss         → Estilos globales
├── angular.json            → Configuración de Angular CLI
├── capacitor.config.ts     → Configuración de Capacitor
├── ionic.config.json       → Configuración de Ionic
├── package.json            → Dependencias y scripts
└── tsconfig.app.json       → Configuración de TypeScript
```

## Paleta de Colores Corporativa

| Color            | Hex       | Uso                                   |
| ---------------- | --------- | ------------------------------------- |
| Rojo Corporativo | `#D31D1D` | Primary, botones principales, acentos |
| Gris Antracita   | `#323232` | Secondary, fondos oscuros             |
| Gris Platino     | `#E0E0E0` | Tertiary, textos secundarios          |
| Gris Oscuro      | `#121212` | Dark, fondo en modo oscuro            |
| Blanco Nieve     | `#FFFFFF` | Light, fondo en modo claro            |

## Solución de Problemas

### Error: `ng` no se reconoce como comando

Usa `npx ng` en lugar de `ng`, o instala Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

### Error de permisos en npm (Windows)

Ejecuta la terminal como Administrador.

### El puerto 4200 está ocupado

```bash
npx ng serve --port 4300
```

### Las imágenes no cargan

Verifica que exista la carpeta `src/assets/images/` con los archivos SVG del proyecto.

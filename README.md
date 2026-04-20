# FitManager - Trabajo Fin de Grado

Sistema de gestión de atletas desarrollado como micro-frontend. Este proyecto es un TFG (Trabajo Fin de Grado) que implementa una plataforma completa para la administración de información de atletas.

## 📋 Descripción del Proyecto

FitManager es una aplicación web moderna que permite gestionar información detallada de atletas, incluyendo datos personales, métricas de rendimiento y seguimiento de entrenamientos.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura de **micro-frontend**, dividiendo la aplicación en módulos independientes:

```
fitmanager-mf/
├── frontend/              # Micro-frontend principal (React + TypeScript + Vite)
└── README.md
```

## 🚀 Características Principales

- **Gestión de Atletas**: CRUD completo para atletas
- **Interfaz Responsiva**: Diseño moderno y adaptable
- **Tipado Estricto**: TypeScript para mayor seguridad
- **API RESTful**: Integración con backend
- **Validación**: Validación de datos en formularios
- **ESLint**: Linting automático de código

## 🛠️ Tecnologías

### Frontend
- **React** 18.2.0 - Librería UI
- **TypeScript** 5.2.2 - Lenguaje tipado
- **Vite** 5.0.2 - Build tool moderno
- **Axios** 1.6.2 - Cliente HTTP
- **ESLint** 8.53.0 - Calidad de código

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js v16 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd fitmanager-mf
```

2. **Instalar dependencias del frontend**
```bash
cd frontend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🎯 Comandos Disponibles

### Frontend

```bash
# Desarrollo
cd frontend && npm run dev

# Build para producción
cd frontend && npm run build

# Preview de la versión compilada
cd frontend && npm run preview

# Lint del código
cd frontend && npm run lint
```

## 📁 Estructura del Proyecto

```
fitmanager-mf/
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── AthleteForm.tsx
│   │   │   ├── AthleteForm.css
│   │   │   ├── AthleteList.tsx
│   │   │   └── AthleteList.css
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   └── Home.css
│   │   ├── services/         # Servicios API
│   │   │   └── athleteService.ts
│   │   ├── types/            # Tipos TypeScript
│   │   │   └── Athlete.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .eslintrc.cjs         # Configuración ESLint
│   ├── .env.example          # Variables de entorno ejemplo
│   ├── vite.config.ts        # Configuración Vite
│   ├── tsconfig.json         # Configuración TypeScript
│   ├── tsconfig.node.json    # TypeScript para Vite
│   ├── package.json          # Dependencias
│   ├── index.html            # HTML principal
│   └── README.md             # Documentación frontend
├── .gitignore                # Archivos ignorados por git
├── .editorconfig             # Configuración editor
└── README.md                 # Este archivo
```

## 🔗 Integración Backend

El frontend se conecta con el backend a través de:
- **Base URL**: http://localhost:8080
- **Proxy**: Configurado en `vite.config.ts`
- **Rutas API**: `/api/athletes`

## 📝 Documentación

Para más detalles sobre el frontend, consulta [frontend/README.md](./frontend/README.md)

## 🤝 Contribución

Este es un proyecto académico de TFG. Las contribuciones deben seguir las siguientes prácticas:

1. Mantener la estructura de carpetas
2. Usar TypeScript estrictamente
3. Ejecutar `npm run lint` antes de hacer commit
4. Escribir código limpio y documentado

## 📄 Licencia

Proyecto académico - TFG Desarrollo Web

## 👤 Autor

Gonzalo - Desarrollo Web TFG

---

**Último actualizado**: Abril 2026

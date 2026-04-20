# FitManager Frontend

Frontend en React + TypeScript + Vite para la gestión de atletas del proyecto FitManager.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 16+ 
- npm o yarn

### Instalación

```bash
cd frontend
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build Producción

```bash
npm run build
```

El bundle se generará en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── AthleteForm.tsx  # Formulario para crear atletas
│   │   ├── AthleteList.tsx  # Tabla de atletas
│   │   └── *.css            # Estilos de componentes
│   ├── pages/               # Páginas principales
│   │   ├── Home.tsx         # Dashboard principal
│   │   └── Home.css
│   ├── services/            # Servicios de API
│   │   └── athleteService.ts # Llamadas al backend
│   ├── types/               # Tipos TypeScript
│   │   └── Athlete.ts       # Interfaces de Athlete
│   ├── App.tsx              # Componente raíz
│   ├── App.css
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html               # HTML principal
├── vite.config.ts           # Configuración de Vite
├── tsconfig.json            # Configuración de TypeScript
├── package.json             # Dependencias
└── .env.example             # Variables de entorno de ejemplo
```

## 🔗 Comunicación con el Backend

El frontend se comunica con el backend a través de la API REST:

- **Base URL**: `http://localhost:8080`
- **Endpoints usados**:
  - `GET /api/v1/athletes` - Listar todos los atletas
  - `GET /api/v1/athletes/{id}` - Obtener un atleta
  - `POST /api/v1/athletes` - Crear un nuevo atleta

### Configuración
Puedes configurar la URL del API en `.env`:
```
VITE_API_URL=http://localhost:8080
```

## 📦 Dependencias Principales

- **React 18**: Librería UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **Axios**: Cliente HTTP
- **CSS**: Estilos nativos

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el bundle de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🔐 CORS

Asegúrate de que el backend tiene CORS configurado para permitir solicitudes desde `http://localhost:5173` (en desarrollo).

## 📝 Notas

- El proxy en `vite.config.ts` redirecciona las llamadas `/api` al backend
- Los tipos TypeScript se encuentran en `src/types/`
- Los servicios de API están centralizados en `src/services/`

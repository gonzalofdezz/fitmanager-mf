# Guía de Desarrollo Local

Esta guía te ayudará a configurar el entorno de desarrollo local para FitManager.

## 📋 Requisitos Previos

- **Node.js**: v16 o superior ([Descargar](https://nodejs.org/))
- **npm**: v7 o superior (incluido con Node.js)
- **Git**: ([Descargar](https://git-scm.com/))
- **Navegador**: Chrome, Firefox, Safari o Edge moderno

## 🚀 Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone https://github.com/<TU_USUARIO>/fitmanager-mf.git
cd fitmanager-mf
```

### 2. Instalar Dependencias

```bash
cd frontend
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# El .env por defecto tiene:
# VITE_API_URL=http://localhost:8080
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080 (asegúrate de tenerlo ejecutando)

## 🛠️ Comandos Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo con hot reload.

### Build
```bash
npm run build
```
Crea una versión optimizada para producción en `dist/`.

### Preview
```bash
npm run preview
```
Previsualiza la versión compilada localmente.

### Lint
```bash
npm run lint
```
Ejecuta ESLint para verificar la calidad del código.

## 📁 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── AthleteForm.tsx   # Formulario de atleta
│   │   └── AthleteList.tsx   # Lista de atletas
│   ├── pages/               # Páginas principales
│   │   └── Home.tsx         # Página principal
│   ├── services/            # Servicios API
│   │   └── athleteService.ts # Llamadas al backend
│   ├── types/               # Tipos TypeScript
│   │   └── Athlete.ts       # Interfaz del atleta
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── index.html               # HTML principal
├── vite.config.ts           # Configuración Vite
├── tsconfig.json            # Configuración TypeScript
└── package.json             # Dependencias
```

## 🔗 Comunicación con Backend

El frontend se comunica con el backend a través de:

```typescript
// Ejemplo de llamada a la API
import { athleteService } from './services/athleteService';

// Obtener todos los atletas
const athletes = await athleteService.getAll();

// Crear un nuevo atleta
const newAthlete = await athleteService.create({
  name: 'Juan',
  email: 'juan@example.com',
  // ... otros campos
});
```

**Asegúrate de que el backend esté ejecutándose** en `http://localhost:8080`

## 🔐 CORS

Si experimentas errores CORS:
1. Verifica que el backend permite solicitudes desde `http://localhost:5173`
2. El frontend usa un proxy configurado en `vite.config.ts`

## 🧹 Mantener la Calidad del Código

### Antes de hacer commit:

```bash
# Ejecuta linter
npm run lint

# Asegúrate que todo compila
npm run build
```

### Commits

Usa mensajes descriptivos:
```bash
git add .
git commit -m "feat: agregar formulario de atleta"
```

## 🐛 Debugging

### En el Navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña "Console" o "Network"
3. Verifica logs y errores

### En VS Code

1. Instala la extensión "Debugger for Chrome"
2. Configura `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend/src",
      "runtimeArgs": ["--disable-background-networking"]
    }
  ]
}
```

## 📚 Recursos Útiles

- [Documentación React](https://react.dev/)
- [Documentación TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación Vite](https://vitejs.dev/)
- [Documentación Axios](https://axios-http.com/)

## ❓ Solución de Problemas

### Error: "npm: command not found"
- Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module"
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### Cambios no se reflejan
- El hot reload debería funcionar automáticamente
- Si no: reinicia el servidor `npm run dev`

### Backend no conecta
```bash
# Verifica que el backend esté ejecutándose en puerto 8080
curl http://localhost:8080/api/athletes
```

## 🤝 Necesitas Ayuda?

- Consulta la [documentación](./README.md)
- Abre un [issue](../../issues)
- Lee [CONTRIBUTING.md](./CONTRIBUTING.md)

---

¡Feliz desarrollo! 🚀


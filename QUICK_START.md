# 🚀 QUICK START - FitManager

## En 3 pasos, tu app está corriendo

### Paso 1: Abre PowerShell
```
Usa la terminal que ya tienes abierta en IntelliJ
O abre una nueva: Ctrl + Alt + T o View > Terminal
```

### Paso 2: Ejecuta los comandos
```powershell
cd frontend
npm install
npm run dev
```

### Paso 3: Abre tu navegador
```
http://localhost:5173
```

---

## ¿Qué ves en pantalla?

✨ **Un sitio profesional tipo Lamborghini/Ferrari:**
- Fondo negro profundo
- Título "FitManager" en amarillo dorado
- Formulario para registrar atletas
- Tabla de atletas registrados
- Todos los bordes y botones en dorado

---

## ⚙️ Requisitos

- ✓ Node.js v16+ (lo tienes)
- ✓ npm v7+ (incluido con Node.js)
- ✓ Backend ejecutándose en http://localhost:8080

---

## 🔧 Comandos Útiles

```bash
# Desarrollo (lo que usarás)
npm run dev

# Compilar para producción
npm run build

# Ver la compilación en local
npm run preview

# Verificar código
npm run lint
```

---

## 📂 Archivos Importantes

| Archivo | Qué es |
|---------|--------|
| `src/App.tsx` | Componente principal |
| `src/index.css` | Estilos globales (colores, variables) |
| `src/App.css` | Estilos del header y footer |
| `src/components/AthleteForm.tsx` | Formulario de atletas |
| `src/components/AthleteList.tsx` | Tabla de atletas |
| `src/services/athleteService.ts` | Llamadas a la API |

---

## 🎨 Cambios Visuales Implementados

```
ANTES:                          DESPUÉS:
┌─────────────────┐           ┌─────────────────┐
│ Gradiente       │    →      │ Shimmer effect  │
│ Purpura/Violeta │           │ Negro & Dorado  │
│ Botones azules  │           │ Botones dorados │
│ Tema claro      │           │ Dark mode       │
└─────────────────┘           └─────────────────┘
```

---

## ❓ Solución de Problemas

### "npm: command not found"
```powershell
# Instala Node.js desde https://nodejs.org/
```

### "Cannot find module"
```powershell
cd frontend
rm -r node_modules
npm install
npm run dev
```

### "Backend no conecta"
```powershell
# Verifica que el backend esté ejecutándose:
# Debe estar en http://localhost:8080
```

### "El navegador no muestra nada"
```powershell
# Ctrl + Shift + R (reload forzado)
# Abre DevTools (F12) y revisa la Console
```

---

## 📚 Documentación

```
FRONTEND_ANALYSIS.md  - Qué falta implementar
DESIGN_GUIDE.md       - Detalles del diseño
DESIGN_VISUAL.md      - Guía visual detallada
SUMMARY.md            - Resumen de cambios
DEVELOPMENT.md        - Guía de desarrollo existente
```

---

## 💡 Tips

- El hot reload funciona automáticamente (guarda archivo → actualiza navegador)
- Usa F12 para abrir DevTools
- La tab Network muestra llamadas a la API
- La tab Console muestra errores de JavaScript

---

## 🎯 Siguiente Paso

Después de verificar que funciona, lee **FRONTEND_ANALYSIS.md** para saber qué implementar a continuación.

---

**¡Listo! Ahora ejecuta los comandos y disfruta de tu nuevo diseño premium.** ✨


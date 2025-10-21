# Despliegue en Vercel

## Pasos para desplegar

### Opción 1: Desde la interfaz web de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Add New..." → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración de Angular
5. Haz clic en "Deploy"

### Opción 2: Desde la CLI de Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Inicia sesión:
```bash
vercel login
```

3. Despliega el proyecto:
```bash
vercel
```

4. Para producción:
```bash
vercel --prod
```

## Configuración

El proyecto ya está configurado con:
- ✅ `vercel.json` - Configuración de build y rewrites para Angular routing
- ✅ `.vercelignore` - Archivos ignorados durante el despliegue
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist/portafolio/browser`

## Variables de entorno (si las necesitas)

Si necesitas agregar variables de entorno:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias

## Notas importantes

- El proyecto se construye automáticamente en cada push al repositorio
- Las rutas de Angular funcionan correctamente gracias a los rewrites configurados
- El sitio será accesible en: `https://tu-proyecto.vercel.app`

## Comandos útiles

```bash
# Build local para verificar antes de desplegar
npm run build

# Servir el build de producción localmente
npx http-server dist/portafolio/browser -p 8080
```


# Módulos Prefabricados San José — Web React + React-Konva

Proyecto base profesional para crear una web de captación de clientes con configurador CAD 2D en React-Konva.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React-Konva / Konva para CAD 2D
- Zustand para estado del configurador
- React Hook Form + Zod para validación
- Supabase para leads, configuraciones, presupuestos, notas y newsletter
- jsPDF para PDF con plano CAD exportado desde Konva

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

Si Supabase no está configurado, la web sigue funcionando y genera PDF/WhatsApp, pero no persistirá los leads.

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Añade las variables de entorno.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Base de datos

Ejecuta el archivo `supabase/schema.sql` en el SQL editor de Supabase.

## Arquitectura CAD

El configurador CAD está separado en:

```txt
src/components/configurator/cad/
  CadStage.tsx
  CadGrid.tsx
  CadWalls.tsx
  CadRulers.tsx
  CadObjectsLayer.tsx
  CadSelectionLayer.tsx
  CadToolbar.tsx
  symbols/
  utils/
```

La lógica de coordenadas, snapping y colisiones está fuera de los componentes visuales.

## Notas importantes

- El CAD no está hecho con divs ni CSS absoluto: todo el plano se dibuja con Konva.
- La lógica de precios está centralizada en `src/utils/pricing.ts`.
- El mensaje de WhatsApp está centralizado en `src/utils/whatsapp.ts`.
- El PDF usa el Stage de Konva exportado como imagen.
- Los textos legales incluidos son una base informativa y conviene revisarlos con un profesional.

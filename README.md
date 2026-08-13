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
- Vercel AI SDK para el agente comercial de prueba

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
AI_GATEWAY_API_KEY=tu_clave_opcional_de_ai_gateway
AI_MODEL=openai/gpt-5.6-luna
COMMERCIAL_KNOWLEDGE_JSON=configuracion_privada_opcional
```

En Vercel, AI Gateway puede autenticarse con el token OIDC del despliegue sin guardar una clave permanente. Para desarrollo local puede usarse `AI_GATEWAY_API_KEY`.

`COMMERCIAL_KNOWLEDGE_JSON` es exclusivamente de servidor: nunca debe llevar el prefijo `VITE_` ni llegar al navegador. Si la IA no está configurada o falla, el chat cambia automáticamente al modo guiado usando la misma configuración comercial privada.

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Añade las variables de entorno.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Base de datos

Ejecuta el archivo `supabase/schema.sql` en el SQL editor de Supabase.

## Agente comercial de prueba

- `src/agent/commercialKnowledge.ts`: esquema y motor de cálculo, sin datos comerciales reales.
- `src/agent/commercialTools.ts`: herramientas cerradas utilizadas por la IA.
- `src/agent/commercialAgent.ts`: comportamiento del agente y modelo configurable.
- `api/chat.ts`: función segura de Vercel consumida por el widget.

El manual, los precios del agente, las referencias de transporte, la cola y las reglas internas no se guardan en GitHub. La preview los recibe exclusivamente desde la variable cifrada `COMMERCIAL_KNOWLEDGE_JSON` de Vercel y no persiste las conversaciones. La primera fase es exclusivamente de prueba: no envía proformas ni mensajes, no procesa pagos y no reserva turnos.

Para comprobar las reglas numéricas principales:

```bash
npm run test:agent
```

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

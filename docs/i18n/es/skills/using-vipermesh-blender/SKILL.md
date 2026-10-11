---
name: using-vipermesh-blender
description: Opera Blender mediante el conector MCP persistente de ViperMesh. Úsalo para inspección de escenas, ediciones estructuradas de Blender, validación, renderizado, rigging, animación, retopología, recursos y exportación.
---

<a id="using-vipermesh-for-blender"></a>
# Usar ViperMesh For Blender

Usa un proceso de servidor MCP para la sesión completa del agente. El cliente MCP debe
iniciar el servidor; no lances `npm`, `npx`, `tsx` ni otro proceso de servidor
para operaciones individuales de Blender.

<a id="start-a-session"></a>
## Iniciar una sesión

1. Llama a `bootstrap_vipermesh_session`.
2. Inspecciona el estado de la escena existente antes de cambiarlo.
3. Usa `search_3d_guidance` cuando la semántica de la tarea o una operación desconocida necesiten aclaración.
4. Usa `list_blender_tools` con una categoría o término de búsqueda relevante en lugar de
   cargar el registro completo.

Prefiere herramientas deterministas cuando expresen la operación prevista. Mantén
`execute_code` disponible para geometría personalizada, efectos procedurales, grafos de nodos
inusuales y otro trabajo que las herramientas estructuradas no cubren bien.

Agrupa operaciones solo cuando sus entradas ya sean conocidas y ningún resultado intermedio
cambie la siguiente decisión. Preserva puntos de inspección y reparación entre
etapas significativas.

Antes de completar, inspecciona la salida solicitada y valida las relaciones
que importan para esta tarea. Una llamada de herramienta exitosa o un archivo de imagen sano no es un
veredicto de calidad. Informa defectos sin resolver. Guarda solo artefactos solicitados en
rutas aprobadas; elige herramientas independientes cuando una etapa reemplazaría la cámara,
iluminación o encuadre de un artista.

<a id="references"></a>
## Referencias

- Mutación de escena y ciclo de vida: [references/scene-operations.md](references/scene-operations.md)
- Contacto, orientación y holgura: [references/spatial-validation.md](references/spatial-validation.md)
- Cámara, iluminación, vistas previas y aceptación: [references/visual-presentation.md](references/visual-presentation.md)
- Geometría, materiales y recursos: [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- Personajes, animación y exportación: [references/character-animation-export.md](references/character-animation-export.md)

Estas referencias proporcionan patrones y comprobaciones útiles, no recetas obligatorias.
Adáptalas al objetivo del usuario, la escena actual, el motor de render activo y
la evidencia disponible.

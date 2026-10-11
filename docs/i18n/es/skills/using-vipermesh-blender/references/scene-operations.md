<a id="scene-operations"></a>
# Operaciones de escena

<a id="choose-the-smallest-useful-surface"></a>
## Elige la superficie útil más pequeña

- Inspecciona antes de mutar una escena existente.
- Busca o filtra el registro alrededor de la tarea actual.
- Prefiere una operación determinista con nombre cuando coincida con el cambio solicitado.
- Usa `execute_code` cuando la lógica personalizada de Blender sea materialmente más clara o más
  capaz que componer herramientas disponibles.

<a id="group-calls-deliberately"></a>
## Agrupa llamadas deliberadamente

`call_blender_tool_batch` es útil para acciones independientes o ya decididas,
como crear un blockout conocido o aplicar varias transformaciones conocidas. Mantén
las llamadas separadas cuando la siguiente acción dependa de dimensiones, contacto, topología,
feedback del viewport o un render.

`run_blender_scene_stage` puede compactar trabajo común de construcción, vista previa y finalización.
Sus etapas siguen siendo opcionales y pueden configurar la cámara y la iluminación. Define
`preservePresentation: true` en finalize para mantener la presentación activa.
Las herramientas independientes son apropiadas para reparaciones dirigidas
y flujos de trabajo que no encajan con la forma por etapas.

<a id="preserve-user-work"></a>
## Preserva el trabajo del usuario

Trata objetos, colecciones, modificadores, materiales, animación y rutas de archivo existentes
como estado propiedad del usuario. Prefiere ediciones reversibles y duplica o guarda una
revisión antes de operaciones destructivas cuando la recuperación sería costosa.

Usa nombres descriptivos de objetos y colecciones cuando operaciones posteriores dependan de
la identidad. No reorganices una escena solo para hacerla coincidir con una
jerarquía preferida.

<a id="finish-with-evidence"></a>
## Termina con evidencia

Antes de informar finalización, confirma que los objetos y cambios solicitados
existen e inspecciona relaciones estructurales de alto riesgo. Guarda un archivo blend solo
cuando el usuario lo solicite, usando su destino aprobado. Omite `blendPath`
para trabajo solo de render; los flujos de inspección y exportación pueden usar herramientas
independientes sin guardar ni sobrescribir un archivo blend. Produce e inspecciona el
artefacto visual o de exportación solicitado antes de afirmar que está listo.

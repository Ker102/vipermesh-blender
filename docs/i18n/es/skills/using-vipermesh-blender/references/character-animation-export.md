<a id="characters-animation-and-export"></a>
# Personajes, animación y exportación

<a id="character-work"></a>
## Trabajo de personajes

Trata la retopología, UVs, generación de rig, binding, limpieza de pesos y preparación
para animación como preocupaciones separadas con comprobaciones explícitas entre ellas. Una llamada
exitosa a un operador no demuestra calidad de deformación ni preparación para producción.

Selecciona decimation, voxel remesh, QuadriFlow o trabajo de topología personalizado según
la malla fuente y el uso objetivo. Preserva una revisión fuente antes de cambios destructivos
de topología.

Para rigging, verifica escala, transformaciones, integridad de malla, alineación de armature,
grupos de deformación, normalización de pesos y deformaciones representativas. Los pesos
automáticos son un punto de partida cuya adecuación depende de la malla y del movimiento.

<a id="animation"></a>
## Animación

Inspecciona rango de frames, acciones, constraints, drivers, root motion y compatibilidad del rig objetivo
antes de editar. Retargeting y baking pueden tener pérdidas, así que conserva una
fuente recuperable y valida poses o segmentos de movimiento representativos.

<a id="export"></a>
## Exportación

Elige formato y opciones desde el pipeline de destino en lugar de usar un preset universal.
Antes de exportar, inspecciona:

- inclusión prevista de objetos y colecciones
- transformaciones y escala
- topología y normales
- UVs, materiales y dependencias de texturas
- armature, pesos, acciones y rango de animación
- modificadores o constraints que deban aplicarse o preservarse

Valida el artefacto exportado cuando sea posible. Un archivo guardado no es evidencia suficiente
de que otra aplicación pueda consumirlo correctamente.

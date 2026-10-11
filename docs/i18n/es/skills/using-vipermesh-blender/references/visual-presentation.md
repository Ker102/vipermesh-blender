<a id="visual-presentation"></a>
# Presentación visual

<a id="build-a-useful-feedback-loop"></a>
## Construye un ciclo de feedback útil

Usa vistas previas para responder preguntas concretas: composición, escala relativa,
orientación, visibilidad, legibilidad de materiales, contacto y dirección de iluminación.
Evita capturas repetidas que no cambien una decisión.

Para reconstrucción de referencia, compara los anclajes visuales más grandes antes de
dedicar tiempo a detalles pequeños. Pasadas posteriores pueden priorizar objetos por
prominencia en la cámara prevista.

<a id="camera"></a>
## Cámara

La distancia focal, altura de cámara, perspectiva y llenado de encuadre son creativos y
dependen de la tarea. Usa herramientas de encuadre e inspección de cámara para coincidir con el
resultado solicitado; no fuerces un preset universal de interior, producto o cine.

Comprueba que los objetos requeridos sean visibles y que siluetas importantes no estén
recortadas u ocultas accidentalmente. Una cámara puede ocultar errores estructurales, así que
el encuadre visual no reemplaza la validación espacial.

<a id="lighting"></a>
## Iluminación

Elige luces según la fuente, ánimo, respuesta de material y motor de render previstos.
Los presets de estudio son puntos de partida útiles para recursos aislados, mientras que
luces personalizadas y entornos de mundo pueden encajar con escenas con ventanas explícitas,
luminarias, condiciones exteriores o dirección estilizada.

Juzga exposición, separación de color, legibilidad de sombras y si las áreas brillantes
borran el color del material. Los rangos numéricos de energía son puntos de partida en lugar de
reglas independientes de escena.

<a id="acceptance"></a>
## Aceptación

Inspecciona el artefacto de render final, no solo respuestas exitosas de herramientas. Si queda un problema
visible, haz una reparación enfocada y vuelve a renderizar en lugar de reconstruir
elementos de escena no relacionados.

`inspect_render_artifact` comprueba integridad de imagen, no si la imagen coincide
con el brief. Abre la imagen con la capacidad de imagen/visor del cliente. Si el cliente
no puede verla, declara que la calidad visual sigue sin verificarse.

Para cada objeto o edición requerido, compara la evidencia contra la intención del usuario:
presencia y proporciones, dirección funcional de facing, contacto o unión,
clearance, visibilidad y legibilidad de materiales. Toma una vista diagnóstica lateral o superior
cuando la cámara principal oculte una relación sospechosa. Los informes de soporte basados en límites
pueden pasar por alto soportes huecos, piezas rotadas, manijas y colisiones de malla locales.
Interprétalos con la geometría real y la intención declarada, en lugar de tratar un
informe aprobado como aceptación completa. Vuelve a comprobar las relaciones afectadas después de una reparación.

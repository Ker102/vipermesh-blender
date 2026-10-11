<a id="spatial-validation"></a>
# Validación espacial

<a id="read-world-space-state"></a>
## Leer estado en espacio mundial

Los orígenes de objetos y dimensiones locales no son sustitutos fiables de límites evaluados
en espacio mundial. Rotación, escala, parenting, modificadores y geometría evaluada
pueden cambiar las superficies que importan.

Cuando la colocación sea importante, inspecciona los objetos relevantes y razona desde
sus límites en espacio mundial, puntos de unión o impactos reales en superficie.

<a id="express-the-intended-relationship"></a>
## Expresar la relación prevista

Elige validación que coincida con el significado del usuario:

- `supported_by` u `on_top_of` para soporte físico
- relaciones de facing u orientación para dirección funcional
- comprobaciones de clearance para holguras requeridas
- comprobaciones de containment para objetos destinados a estar dentro de otro objeto
- alineación de attachment-point para piezas que deben encontrarse con precisión

Un ordenamiento vertical amplio como "above" no demuestra contacto. Un ángulo de cámara
limpio tampoco demuestra que un objeto esté apoyado o no intersecte.

<a id="use-recommendations-not-fixed-layouts"></a>
## Usa recomendaciones, no layouts fijos

La escala, separación y orientación razonables dependen del recurso, cámara,
animación, plataforma objetivo e intención artística. Usa dimensiones de referencia o
rangos de clearance como evidencia inicial cuando sea útil, luego adáptalos.

Después de una colocación cercana, inspecciona desde un ángulo que revele profundidad y contacto.
Repara objetos flotantes, penetración no prevista, dirección funcional invertida y
errores de soporte antes de la aceptación final.

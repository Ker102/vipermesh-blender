<a id="geometry-materials-and-assets"></a>
# Geometría, materiales y recursos

<a id="geometry-strategy"></a>
## Estrategia de geometría

Selecciona un enfoque según la forma solicitada y el uso posterior:

- primitivos y herramientas de ensamblaje para blockouts y estructuras hard-surface
- curvas para rutas, cables, rieles y formas impulsadas por perfiles
- modificadores para repetición reversible, suavizado, grosor y deformación
- herramientas de retopología para reducción de densidad o conversión de topología
- `execute_code` para geometría procedural personalizada que carece de una operación directa
  adecuada

Evita tratar un método como universalmente superior. Preserva la geometría fuente
cuando una conversión destructiva dificultaría la iteración.

<a id="materials"></a>
## Materiales

Usa herramientas de materiales estructuradas para flujos comunes de Principled BSDF y texturas.
Comprueba rutas de texturas, espacio de color, dependencia de UV y comportamiento del motor de render cuando
el resultado importe más allá de una vista previa.

Los valores de material deben responder a la sustancia prevista, escala, iluminación y
dirección artística. Los valores predeterminados y rangos físicos son referencias útiles, no una razón
para anular estilización deliberada.

<a id="assets"></a>
## Recursos

Busca recursos reutilizables antes de aproximar manualmente objetos complejos cuya
identidad dependa de geometría detallada. Importa recursos multiobjeto mediante una
raíz gestionada cuando sea posible, luego inspecciona límites, escala, orientación y soporte
en la escena de destino.

Una coincidencia de recurso es un candidato, no una aceptación automática. Verifica que su
licencia, estilo, topología, materiales y dirección funcional encajen con la tarea.

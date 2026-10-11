<a id="portable-blender-mcp-gateway"></a>
# Gateway MCP portable de Blender

<a id="result-review-and-existing-scenes"></a>
## Revisión de resultados y escenas existentes

Las llamadas que producen imágenes adjuntan un PNG/JPEG directamente cuando está disponible en el sistema de archivos
del servidor MCP y mide como máximo 3 MiB. De lo contrario, usa la ruta de artefacto informada
con un visor de imágenes. La marca `imageAttached` indica disponibilidad de transporte;
`visualReviewRequired` significa que el agente debe juzgar la salida real frente a la
tarea. La salud del archivo de imagen y los comandos exitosos no son puntuaciones de calidad visual.

Los helpers de etapa son operaciones opcionales de conveniencia. Define `preservePresentation:
true` en finalize para conservar la cámara, iluminación y encuadre actuales. `blendPath`
es opcional; omítelo para un render sin guardar un archivo blend. Guardar mediante
finalize rechaza un destino existente. Usa un guardado independiente solo cuando se
pretende y autoriza una sobrescritura. Las `spatialRelations` explícitas se vuelven a comprobar
en finalize, y las relaciones fallidas retienen la salida final. Las comprobaciones diagnósticas no pueden
certificar contacto de malla arbitrario; inspecciona áreas sospechosas desde vistas reveladoras.

El gateway portable permite que agentes de programación de confianza llamen a herramientas de ViperMesh Blender
mediante transporte MCP stdio estándar, incluido `execute_code` para medir
comportamiento de fallback durante pruebas locales.

Es un conector local de confianza. Los servicios en la nube autenticados y derechos comerciales
permanecen fuera del addon público y del paquete MCP.

<a id="execution-paths"></a>
## Rutas de ejecución

El gateway portable es aditivo:

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

El servidor MCP conserva su socket de Blender durante toda la vida del proceso
en lugar de reconectarse después de cada llamada de herramienta.

<a id="requirements"></a>
## Requisitos

- Node.js y las dependencias instaladas de este repositorio.
- Blender en ejecución con el addon ViperMesh instalado y su servidor local
  iniciado.
- El addon accesible en `127.0.0.1:9876`, salvo que se sobrescriba con
  `BLENDER_MCP_HOST` y `BLENDER_MCP_PORT`.
La búsqueda de tool-skill local incluida funciona sin base de datos ni credenciales
de embeddings.

<a id="start-the-gateway"></a>
## Iniciar el gateway

Desde la raíz del repositorio:

```bash
npm run mcp
```

El proceso se comunica por stdin/stdout usando MCP JSON-RPC. Los diagnósticos
de arranque se escriben en stderr.

<a id="coding-agent-configuration"></a>
## Configuración del agente de programación

Usa el punto de entrada compilado desde una ruta absoluta del repositorio:

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/vipermesh-blender/dist/public-portable-blender-mcp.js"
      ]
    }
  }
}
```

La ubicación exacta de configuración depende del agente de programación. Reinicia o abre una
nueva sesión de agente después de registrar el servidor si el cliente no recarga servidores MCP
dinámicamente. Consulta [configuración de cliente MCP](client-setup.md) para detalles de Codex y
compatibilidad de clientes.

<a id="available-mcp-tools"></a>
## Herramientas MCP disponibles

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` acepta solo comandos presentes en el registro de herramientas de ViperMesh.
A diferencia de las superficies orientadas a producción, este gateway local de confianza expone
`execute_code` para que las pruebas revelen dónde el agente todavía recurre a
Python de Blender libre.

Solicitud de ejemplo:

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

Usa `list_blender_tools` para inspeccionar comandos disponibles y sus descripciones de parámetros.

`call_blender_tool_batch` acepta hasta 32 comandos ordenados y por defecto se detiene
después de la primera respuesta fallida. Úsalo para un grupo ya decidido,
como crear varios primitivos o aplicar varias asignaciones de material independientes.
No agrupes a través de un punto donde la siguiente acción dependa de
inspección, anclaje o feedback visual.

`run_blender_scene_stage` proporciona un flujo compacto aditivo sobre el mismo
socket persistente:

- `build` ejecuta un batch de construcción acotado proporcionado por el llamador.
- `inspect_preview` comprueba apoyo y relaciones espaciales nombradas opcionales,
  encuadra y renderiza una vista previa ligera, e inspecciona el artefacto.
- `finalize` configura y valida la cámara de presentación, luego renderiza y
  guarda solo cuando pasa la validación.

Llama las etapas por separado. El agente debe inspeccionar la vista previa entre
`inspect_preview` y `finalize`, y puede usar cualquier herramienta independiente de Blender para
reparaciones antes de repetir la inspección. Las respuestas de etapa devuelven intencionalmente
campos compactos de estado, recuento y artefacto en lugar de payloads completos de Blender para
reducir contexto y sobrecarga de tokens. Las llamadas independientes y batch genéricas siguen
disponibles.

El servidor mantiene abierta una conexión lazy a Blender y serializa todas las llamadas individuales
y batch a través de ella. Si Blender cierra el socket, el cliente se reconecta
en la siguiente llamada. Los hosts MCP deben iniciar `npm run mcp` una vez por sesión de agente,
no una vez por herramienta.

<a id="agent-context"></a>
## Contexto del agente

`bootstrap_vipermesh_session` es la primera llamada requerida para un agente no familiarizado.
Comprueba Blender, devuelve el contexto operativo compacto, identifica el
modelo de sesión persistente y recomienda las siguientes llamadas.

`get_blender_agent_context` devuelve las reglas operativas compactas públicas para
inspección, recuperación de guía, preferencia por herramienta directa, batching acotado,
fallback `execute_code`, apoyo y aceptación visual. El prompt y la orquestación privados
del producto ViperMesh no se distribuyen con este conector.

Un agente MCP arbitrario debe cargar un perfil al inicio de sesión, consultar
`search_3d_guidance` para la tarea concreta y usar `list_blender_tools` solo
para la categoría de capacidad o término de búsqueda relevante. Por ejemplo, el trabajo de retopología
debe recuperar la guía de remesh y topología incluida antes de elegir
entre decimation, voxel remesh, QuadriFlow o código personalizado de fallback.

<a id="guidance-retrieval"></a>
## Recuperación de guía

`search_3d_guidance` admite:

- `source: "local"` para búsqueda determinista sobre las referencias públicas de agent skill
  en `skills/using-vipermesh-blender/references`;
- `source: "semantic"` para un adaptador semántico privado de ViperMesh configurado;
- `source: "all"` para combinar ambos.

La recuperación semántica es un adaptador opcional de producto privado. El conector público
distribuye recuperación determinista local de tool-skill y no requiere credenciales de base de datos ni
embeddings.

`get_3d_guidance_document` lee un basename Markdown desde
`skills/using-vipermesh-blender/references`. Se rechazan rutas arbitrarias del sistema de archivos y
traversal.

Las referencias de la skill describen capacidades, tradeoffs y patrones de validación.
Son recomendaciones, no recetas universales de escena. El corpus RAG privado de ViperMesh
no se distribuye en el conector público.

<a id="security-boundary"></a>
## Límite de seguridad

Este gateway local es para uso en una estación de trabajo de confianza.

- Usa stdio y no abre ningún listener de red adicional.
- El addon de Blender debe permanecer enlazado a loopback.
- Expone ejecución libre de Python para pruebas locales de fallback de confianza.
- No aplica suscripciones ni protege la implementación local del addon.

Una futura versión de producción debería usar un plano de control remoto ViperMesh
autenticado para orquestación premium, guía privada, acceso a proveedores y
planes de acción firmados. La autenticación local por sí sola no puede hacer inviolable
software que se ejecuta en una máquina controlada por el usuario.

<a id="security-policy"></a>
# Política de seguridad

<a id="supported-versions"></a>
## Versiones compatibles

Las correcciones de seguridad se proporcionan para la última versión publicada.

<a id="reporting"></a>
## Informes

No abras un issue público para una vulnerabilidad. Usa el flujo privado
**Report a vulnerability** de GitHub en la pestaña Security del repositorio.

Incluye la versión afectada, pasos de reproducción, impacto y cualquier mitigación
sugerida. Permite que los mantenedores tengan tiempo para investigar antes de la divulgación.

<a id="trust-boundary"></a>
## Límite de confianza

ViperMesh for Blender es un conector para una estación de trabajo local de confianza:

- El addon se enlaza a `127.0.0.1` de forma predeterminada.
- El servidor MCP se comunica con los clientes por stdio.
- `execute_code` puede ejecutar Python arbitrario dentro de Blender.
- El conector no proporciona un límite de autenticación remota.

Conecta solo clientes MCP de confianza. No expongas el puerto del puente de Blender a una
LAN ni a internet público, y no uses el conector para abrir archivos
`.blend` no confiables ni ejecutar prompts no confiables sin revisión.

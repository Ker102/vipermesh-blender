<a id="contributing"></a>
# Contribuir

Gracias por mejorar ViperMesh for Blender.

<a id="development"></a>
## Desarrollo

Requisitos:

- Node.js 20 o posterior
- Python 3.11 o posterior
- Blender 5.2 para comprobaciones de compatibilidad en vivo

```bash
npm install
npm run check
```

Instala `addon/vipermesh-addon.py` mediante el flujo **Install from Disk** de
Blender, inicia el puente local y ejecuta `npm run mcp` para pruebas en vivo.

<a id="pull-requests"></a>
## Pull Requests

- Mantén los cambios enfocados y explica el comportamiento visible para el usuario.
- Agrega o actualiza la cobertura de conformidad para cambios de protocolo y empaquetado.
- Prueba las mutaciones de Blender en una escena descartable.
- Nunca confirmes credenciales, catálogos de recursos privados, evidencia de benchmarks ni
  código propietario del producto ViperMesh.
- Preserva el diseño que prioriza herramientas deterministas y mantén `execute_code`
  disponible para trabajo personalizado no cubierto.

Usa asuntos de estilo Conventional Commit cuando sea práctico, como
`feat(addon): add mesh validation`.

Al contribuir, aceptas que tu contribución se licencia bajo la MIT
License.

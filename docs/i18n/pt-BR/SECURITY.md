<a id="security-policy"></a>
# Política de Segurança

<a id="supported-versions"></a>
## Versões Com Suporte

Correções de segurança são fornecidas para a versão publicada mais recente.

<a id="reporting"></a>
## Relato

Não abra uma issue pública para uma vulnerabilidade. Use o fluxo privado
**Report a vulnerability** do GitHub na aba Security do repositório.

Inclua a versão afetada, etapas de reprodução, impacto e qualquer mitigação
sugerida. Dê tempo aos mantenedores para investigar antes da divulgação.

<a id="trust-boundary"></a>
## Limite De Confiança

ViperMesh for Blender é um conector para uma estação de trabalho local confiável:

- O addon se vincula a `127.0.0.1` por padrão.
- O servidor MCP se comunica com clientes por stdio.
- `execute_code` pode executar Python arbitrário dentro do Blender.
- O conector não fornece um limite de autenticação remota.

Conecte apenas clientes MCP confiáveis. Não exponha a porta da ponte do Blender
a uma LAN ou à internet pública, e não use o conector para abrir arquivos
`.blend` não confiáveis ou executar prompts não confiáveis sem revisão.

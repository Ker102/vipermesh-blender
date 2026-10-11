<a id="contributing"></a>
# Contribuição

Obrigado por melhorar o ViperMesh for Blender.

<a id="development"></a>
## Desenvolvimento

Requisitos:

- Node.js 20 ou mais recente
- Python 3.11 ou mais recente
- Blender 5.2 para verificações de compatibilidade ao vivo

```bash
npm install
npm run check
```

Instale `addon/vipermesh-addon.py` pelo fluxo **Install from Disk** do Blender,
inicie a ponte local e execute `npm run mcp` para testes ao vivo.

<a id="pull-requests"></a>
## Pull Requests

- Mantenha as alterações focadas e explique o comportamento visível ao usuário.
- Adicione ou atualize a cobertura de conformidade para alterações de protocolo
  e empacotamento.
- Teste mutações do Blender em uma cena descartável.
- Nunca faça commit de credenciais, catálogos de assets privados, evidências de
  benchmark ou código proprietário do produto ViperMesh.
- Preserve o design determinístico-com-ferramentas-primeiro e mantenha
  `execute_code` disponível para trabalho personalizado não coberto.

Use assuntos no estilo Conventional Commit quando for prático, como
`feat(addon): add mesh validation`.

Ao contribuir, você concorda que sua contribuição é licenciada sob a Licença
MIT.

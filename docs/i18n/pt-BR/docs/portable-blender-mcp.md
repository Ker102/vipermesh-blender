<a id="portable-blender-mcp-gateway"></a>
# Gateway MCP Portátil Do Blender

<a id="result-review-and-existing-scenes"></a>
## Revisão De Resultados E Cenas Existentes

Chamadas que produzem imagens anexam um PNG/JPEG diretamente quando ele está
disponível no sistema de arquivos do servidor MCP e tem no máximo 3 MiB. Caso
contrário, use o caminho de artefato informado com um visualizador de imagens.
A flag `imageAttached` indica disponibilidade de transporte; `visualReviewRequired`
significa que o agente deve julgar a saída real em relação à tarefa. Integridade
de arquivo de imagem e comandos bem-sucedidos não são pontuações de qualidade
visual.

Auxiliares de estágio são operações opcionais de conveniência. Defina
`preservePresentation: true` na finalização para manter câmera, iluminação e
enquadramento atuais. `blendPath` é opcional; omita-o para renderizar sem salvar
um arquivo blend. Salvar pela finalização recusa um destino existente. Use um
salvamento independente somente quando uma sobrescrita for pretendida e
autorizada. `spatialRelations` explícitas são verificadas novamente na
finalização, e relações com falha retêm a saída final. Verificações diagnósticas
não conseguem certificar contato arbitrário de malha; inspecione áreas suspeitas
a partir de vistas reveladoras.

O gateway portátil permite que agentes de codificação confiáveis chamem
ferramentas ViperMesh Blender pelo transporte MCP stdio padrão, incluindo
`execute_code` para medir comportamento de fallback durante testes locais.

Ele é um conector local confiável. Serviços de nuvem autenticados e direitos
comerciais permanecem fora do addon público e do pacote MCP.

<a id="execution-paths"></a>
## Caminhos De Execução

O gateway portátil é aditivo:

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

O servidor MCP retém seu socket do Blender pela duração do processo em vez de
reconectar após cada chamada de ferramenta.

<a id="requirements"></a>
## Requisitos

- Node.js e as dependências instaladas deste repositório.
- Blender em execução com o addon ViperMesh instalado e seu servidor local
  iniciado.
- O addon alcançável em `127.0.0.1:9876`, a menos que seja sobrescrito com
  `BLENDER_MCP_HOST` e `BLENDER_MCP_PORT`.
Busca local de tool-skill versionada funciona sem credenciais de banco de dados
ou embedding.

<a id="start-the-gateway"></a>
## Iniciar O Gateway

A partir da raiz do repositório:

```bash
npm run mcp
```

O processo se comunica por stdin/stdout usando MCP JSON-RPC. Diagnósticos de
inicialização são escritos em stderr.

<a id="coding-agent-configuration"></a>
## Configuração De Agente De Codificação

Use o ponto de entrada construído a partir de um caminho absoluto do repositório:

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

O local exato de configuração depende do agente de codificação. Reinicie ou abra
uma nova sessão de agente depois de registrar o servidor se o cliente não
recarregar servidores MCP dinamicamente. Consulte a [configuração de cliente MCP](client-setup.md)
para detalhes de Codex e compatibilidade de clientes.

<a id="available-mcp-tools"></a>
## Ferramentas MCP Disponíveis

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` aceita apenas comandos presentes no registro de ferramentas
do ViperMesh. Diferentemente das superfícies voltadas à produção, este gateway
local confiável expõe `execute_code` para que os testes revelem onde o agente
ainda recorre a Python livre do Blender.

Exemplo de solicitação:

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

Use `list_blender_tools` para inspecionar comandos disponíveis e suas descrições
de parâmetros.

`call_blender_tool_batch` aceita até 32 comandos ordenados e, por padrão, para
após a primeira resposta com falha. Use-o para um grupo já decidido, como criar
várias primitivas ou aplicar várias atribuições independentes de material. Não
agruppe além de um ponto em que a próxima ação dependa de inspeção, grounding ou
feedback visual.

`run_blender_scene_stage` fornece um fluxo compacto aditivo para trabalhos comuns
de construção, prévia e finalização sobre o mesmo socket persistente:

- `build` executa um lote de construção limitado fornecido pelo chamador.
- `inspect_preview` verifica grounding e relações espaciais nomeadas opcionais,
  enquadra e renderiza uma prévia leve, e inspeciona o artefato.
- `finalize` configura e valida a câmera de apresentação, então renderiza e
  salva somente quando a validação passa.

Chame os estágios separadamente. O agente deve inspecionar a prévia entre
`inspect_preview` e `finalize`, e pode usar qualquer ferramenta independente do
Blender para reparos antes de repetir a inspeção. As respostas de estágio
retornam intencionalmente status, contagem e campos de artefato compactos em vez
de payloads completos do Blender, para reduzir contexto e overhead de tokens.
Chamadas independentes e genéricas em lote permanecem disponíveis.

O servidor mantém uma conexão lazy com o Blender aberta e serializa todas as
chamadas únicas e em lote por ela. Se o Blender fechar o socket, o cliente se
reconecta na próxima chamada. Hosts MCP devem iniciar `npm run mcp` uma vez por
sessão de agente, não uma vez por ferramenta.

<a id="agent-context"></a>
## Contexto Do Agente

`bootstrap_vipermesh_session` é a primeira chamada obrigatória para um agente
não familiarizado. Ela verifica o Blender, retorna o contexto operacional
compacto, identifica o modelo de sessão persistente e recomenda as próximas
chamadas.

`get_blender_agent_context` retorna as regras operacionais compactas públicas
para inspeção, recuperação de orientação, preferência por ferramenta direta,
batching limitado, fallback `execute_code`, grounding e aceitação visual. O
prompt e a orquestração privados do produto ViperMesh não são distribuídos por
este conector.

Um agente MCP arbitrário deve carregar um perfil no início da sessão, consultar
`search_3d_guidance` para a tarefa concreta e usar `list_blender_tools` somente
para a categoria de capacidade ou termo de busca relevante. Por exemplo, trabalho
de retopologia deve recuperar a orientação versionada de remesh e topologia antes
de escolher entre decimation, voxel remesh, QuadriFlow ou código de fallback
personalizado.

<a id="guidance-retrieval"></a>
## Recuperação De Orientação

`search_3d_guidance` oferece suporte a:

- `source: "local"` para busca determinística nas referências da skill pública
  de agente em `skills/using-vipermesh-blender/references`;
- `source: "semantic"` para um adaptador semântico privado configurado do
  ViperMesh;
- `source: "all"` para combinar ambos.

Recuperação semântica é um adaptador opcional do produto privado. O conector
público envia recuperação determinística local de tool-skill e não exige
credenciais de banco de dados ou embedding.

`get_3d_guidance_document` lê um basename Markdown de
`skills/using-vipermesh-blender/references`. Caminhos arbitrários do sistema de
arquivos e traversal são rejeitados.

As referências da skill descrevem capacidades, tradeoffs e padrões de validação.
Elas são recomendações, não receitas universais de cena. O corpus RAG privado do
ViperMesh não é distribuído no conector público.

<a id="security-boundary"></a>
## Limite De Segurança

Este gateway local é para uso em uma estação de trabalho confiável.

- Ele usa stdio e não abre listener de rede adicional.
- O addon do Blender deve permanecer vinculado a loopback.
- Ele expõe execução livre de Python para testes de fallback local confiáveis.
- Ele não impõe assinaturas nem protege a implementação local do addon.

Uma versão futura de produção deve usar um plano de controle remoto autenticado
do ViperMesh para orquestração premium, orientação privada, acesso a provedores e
planos de ação assinados. Autenticação local sozinha não consegue tornar software
executando em uma máquina controlada pelo usuário à prova de adulteração.

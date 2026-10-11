<a id="scene-operations"></a>
# Operações De Cena

<a id="choose-the-smallest-useful-surface"></a>
## Escolha A Menor Superfície Útil

- Inspecione antes de mutar uma cena existente.
- Busque ou filtre o registro em torno da tarefa atual.
- Prefira uma operação determinística nomeada quando ela corresponder à alteração
  solicitada.
- Use `execute_code` quando lógica personalizada do Blender for materialmente
  mais clara ou mais capaz do que compor ferramentas disponíveis.

<a id="group-calls-deliberately"></a>
## Agrupe Chamadas Deliberadamente

`call_blender_tool_batch` é útil para ações independentes ou já decididas, como
criar um blockout conhecido ou aplicar vários transforms conhecidos. Mantenha as
chamadas separadas quando a próxima ação depender de dimensões, contato,
topologia, feedback do viewport ou uma renderização.

`run_blender_scene_stage` pode compactar trabalho comum de construção, prévia e
finalização. Seus estágios permanecem opcionais e podem configurar a câmera e a
iluminação. Defina `preservePresentation: true` na finalização para manter a
apresentação ativa. Ferramentas independentes são apropriadas para reparos
direcionados e fluxos de trabalho que não se encaixam no formato em estágios.

<a id="preserve-user-work"></a>
## Preserve O Trabalho Do Usuário

Trate objetos, coleções, modificadores, materiais, animação e caminhos de arquivo
existentes como estado pertencente ao usuário. Prefira edições reversíveis e
duplique ou salve uma revisão antes de operações destrutivas quando a recuperação
seria cara.

Use nomes descritivos de objetos e coleções quando operações posteriores
dependerem de identidade. Não reorganize uma cena apenas para fazê-la corresponder
a uma hierarquia preferida.

<a id="finish-with-evidence"></a>
## Termine Com Evidências

Antes de relatar conclusão, confirme que os objetos e alterações solicitados
existem e inspecione relações estruturais de alto risco. Salve um arquivo blend
somente quando o usuário solicitar, usando o destino aprovado por ele. Omita
`blendPath` para trabalho apenas de renderização; fluxos de inspeção e exportação
podem usar ferramentas independentes sem salvar nem sobrescrever um arquivo blend.
Produza e inspecione o visual ou artefato de exportação solicitado antes de
afirmar que ele está pronto.

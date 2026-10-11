---
name: using-vipermesh-blender
description: Opera o Blender por meio do conector MCP persistente ViperMesh. Use para inspeção de cena, edições estruturadas no Blender, validação, renderização, rigging, animação, retopologia, assets e exportação.
---

<a id="using-vipermesh-for-blender"></a>
# Usando ViperMesh For Blender

Use um processo de servidor MCP para a sessão completa do agente. O cliente MCP
deve iniciar o servidor; não inicie `npm`, `npx`, `tsx` ou outro processo de
servidor para operações individuais do Blender.

<a id="start-a-session"></a>
## Iniciar Uma Sessão

1. Chame `bootstrap_vipermesh_session`.
2. Inspecione o estado existente da cena antes de alterá-la.
3. Use `search_3d_guidance` quando a semântica da tarefa ou uma operação
   desconhecida precisar de esclarecimento.
4. Use `list_blender_tools` com uma categoria ou termo de busca relevante em vez
   de carregar o registro completo.

Prefira ferramentas determinísticas quando elas expressarem a operação pretendida.
Mantenha `execute_code` disponível para geometria personalizada, efeitos
procedurais, grafos de nós incomuns e outros trabalhos que as ferramentas
estruturadas não cobrem bem.

Agrupe operações apenas quando suas entradas já forem conhecidas e nenhum
resultado intermediário mudar a próxima decisão. Preserve pontos de inspeção e
reparo entre estágios significativos.

Antes da conclusão, inspecione a saída solicitada e valide as relações que
importam para esta tarefa. Uma chamada de ferramenta bem-sucedida ou um arquivo
de imagem íntegro não é um veredito de qualidade. Relate defeitos não resolvidos.
Salve apenas artefatos solicitados em caminhos aprovados; escolha ferramentas
independentes quando um estágio substituiria a câmera, iluminação ou enquadramento
de um artista.

<a id="references"></a>
## Referências

- Mutação de cena e ciclo de vida: [references/scene-operations.md](references/scene-operations.md)
- Contato, orientação e folga: [references/spatial-validation.md](references/spatial-validation.md)
- Câmera, iluminação, prévias e aceitação: [references/visual-presentation.md](references/visual-presentation.md)
- Geometria, materiais e assets: [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- Personagens, animação e exportação: [references/character-animation-export.md](references/character-animation-export.md)

Essas referências fornecem padrões e verificações úteis, não receitas
obrigatórias. Adapte-as ao objetivo do usuário, à cena atual, ao motor de
renderização ativo e às evidências disponíveis.

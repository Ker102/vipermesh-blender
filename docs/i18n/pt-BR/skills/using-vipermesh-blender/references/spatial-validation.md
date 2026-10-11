<a id="spatial-validation"></a>
# Validação Espacial

<a id="read-world-space-state"></a>
## Leia O Estado Em World-Space

Origens de objetos e dimensões locais não são substitutos confiáveis para limites
avaliados em world-space. Rotação, escala, parenting, modifiers e geometria
avaliada podem alterar as superfícies que importam.

Quando o posicionamento for consequente, inspecione os objetos relevantes e
raciocine a partir de seus limites em world-space, pontos de anexação ou hits
reais de superfície.

<a id="express-the-intended-relationship"></a>
## Expresse A Relação Pretendida

Escolha validação que corresponda ao significado do usuário:

- `supported_by` ou `on_top_of` para suporte físico
- relações de facing ou orientação para direção funcional
- verificações de clearance para folgas exigidas
- verificações de containment para objetos destinados a ficar dentro de outro objeto
- alinhamento de attachment-point para partes que devem se encontrar precisamente

Ordenação vertical ampla como "above" não prova contato. Um ângulo de câmera
limpo também não prova que um objeto está apoiado ou sem interseção.

<a id="use-recommendations-not-fixed-layouts"></a>
## Use Recomendações, Não Layouts Fixos

Escala, espaçamento e orientação razoáveis dependem do asset, câmera, animação,
plataforma-alvo e intenção artística. Use dimensões de referência ou intervalos
de folga como evidência inicial quando úteis, então adapte-os.

Depois de posicionamento próximo, inspecione a partir de um ângulo que revele
profundidade e contato. Repare objetos flutuantes, penetração não pretendida,
direção funcional invertida e erros de suporte antes da aceitação final.

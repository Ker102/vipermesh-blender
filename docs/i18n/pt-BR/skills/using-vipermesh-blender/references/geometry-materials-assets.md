<a id="geometry-materials-and-assets"></a>
# Geometria, Materiais E Assets

<a id="geometry-strategy"></a>
## Estratégia De Geometria

Selecione uma abordagem com base na forma solicitada e no uso posterior:

- primitivas e ferramentas de montagem para blockouts e estruturas hard-surface
- curves para caminhos, cabos, trilhos e formas guiadas por perfil
- modifiers para repetição reversível, suavização, espessura e deformação
- ferramentas de retopologia para redução de densidade ou conversão de topologia
- `execute_code` para geometria procedural personalizada sem uma operação direta
  adequada

Evite tratar um método como universalmente superior. Preserve a geometria de
origem quando uma conversão destrutiva tornaria a iteração mais difícil.

<a id="materials"></a>
## Materiais

Use ferramentas estruturadas de material para fluxos comuns de Principled BSDF e
textura. Verifique caminhos de textura, espaço de cor, dependência de UV e
comportamento do motor de renderização quando o resultado importa além de uma
prévia.

Valores de material devem responder à substância pretendida, escala, iluminação
e direção de arte. Defaults e intervalos físicos são referências úteis, não uma
razão para sobrescrever estilização deliberada.

<a id="assets"></a>
## Assets

Procure assets reutilizáveis antes de aproximar manualmente objetos complexos
cuja identidade depende de geometria detalhada. Importe assets com múltiplos
objetos por meio de uma raiz gerenciada quando possível, então inspecione limites,
escala, orientação e suporte na cena de destino.

Uma correspondência de asset é uma candidata, não aceitação automática. Verifique
se sua licença, estilo, topologia, materiais e direção funcional se ajustam à
tarefa.

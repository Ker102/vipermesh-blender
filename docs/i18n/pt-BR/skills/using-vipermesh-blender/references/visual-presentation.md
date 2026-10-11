<a id="visual-presentation"></a>
# Apresentação Visual

<a id="build-a-useful-feedback-loop"></a>
## Construa Um Ciclo De Feedback Útil

Use prévias para responder perguntas concretas: composição, escala relativa,
orientação, visibilidade, legibilidade de material, contato e direção da
iluminação. Evite capturas repetidas que não mudam uma decisão.

Para reconstrução a partir de referência, compare as maiores âncoras visuais
antes de gastar tempo em detalhes pequenos. Passes posteriores podem priorizar
objetos pela proeminência na câmera pretendida.

<a id="camera"></a>
## Câmera

Distância focal, altura da câmera, perspectiva e preenchimento do quadro são
criativos e dependentes da tarefa. Use ferramentas de enquadramento e inspeção de
câmera para corresponder ao resultado solicitado; não force um preset universal
de interior, produto ou cinema.

Verifique se objetos obrigatórios estão visíveis e se silhuetas importantes não
foram cortadas ou ocultas acidentalmente. Uma câmera pode esconder erros
estruturais, então enquadramento visual não substitui validação espacial.

<a id="lighting"></a>
## Iluminação

Escolha luzes a partir da fonte pretendida, clima, resposta de material e motor
de renderização. Presets de estúdio são bons pontos de partida para assets
isolados, enquanto luzes personalizadas e ambientes de mundo podem se ajustar a
cenas com janelas explícitas, luminárias, condições externas ou direção estilizada.

Julgue exposição, separação de cor, legibilidade de sombras e se áreas brilhantes
apagam a cor do material. Intervalos numéricos de energia são pontos de partida,
não regras independentes da cena.

<a id="acceptance"></a>
## Aceitação

Inspecione o artefato de renderização final, não apenas respostas de sucesso de
ferramentas. Se um problema visível permanecer, faça um reparo focado e renderize
novamente em vez de reconstruir elementos de cena não relacionados.

`inspect_render_artifact` verifica integridade de imagem, não se a imagem
corresponde ao brief. Abra a imagem com o recurso de imagem/visualizador do
cliente. Se o cliente não conseguir visualizá-la, declare que a qualidade visual
permanece não verificada.

Para cada objeto ou edição exigida, compare evidências com a intenção do usuário:
presença e proporções, direção funcional de facing, contato ou anexação, folga,
visibilidade e legibilidade de material. Use uma vista diagnóstica lateral ou de
topo quando a câmera principal esconder uma relação suspeita. Relatórios de
suporte baseados em limites podem não detectar suportes ocos, partes rotacionadas,
alças e colisões locais de malha. Interprete-os com a geometria real e a intenção
declarada, em vez de tratar um relatório aprovado como aceitação completa.
Verifique novamente relações afetadas após um reparo.

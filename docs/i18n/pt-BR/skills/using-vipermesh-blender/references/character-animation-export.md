<a id="characters-animation-and-export"></a>
# Personagens, Animação E Exportação

<a id="character-work"></a>
## Trabalho Com Personagens

Trate retopologia, UVs, geração de rig, binding, limpeza de pesos e prontidão
para animação como preocupações separadas, com verificações explícitas entre elas.
Uma chamada de operador bem-sucedida não prova qualidade de deformação nem
prontidão para produção.

Selecione decimation, voxel remesh, QuadriFlow ou trabalho de topologia
personalizado de acordo com a malha de origem e o uso-alvo. Preserve uma revisão
de origem antes de alterações destrutivas de topologia.

Para rigging, verifique escala, transforms, integridade da malha, alinhamento da
armature, grupos de deformação, normalização de pesos e deformações
representativas. Pesos automatizados são um ponto de partida cuja adequação
depende da malha e do movimento.

<a id="animation"></a>
## Animação

Inspecione intervalo de frames, actions, constraints, drivers, root motion e
compatibilidade com o rig-alvo antes de editar. Retargeting e baking podem gerar
perdas, então mantenha uma origem recuperável e valide poses ou segmentos de
movimento representativos.

<a id="export"></a>
## Exportação

Escolha formato e opções a partir do pipeline de destino, não de um preset
universal. Antes de exportar, inspecione:

- inclusão pretendida de objetos e coleções
- transforms e escala
- topologia e normais
- UVs, materiais e dependências de textura
- armature, pesos, actions e intervalo de animação
- modificadores ou constraints que devem ser aplicados ou preservados

Valide o artefato exportado quando possível. Um arquivo salvo não é evidência
suficiente de que outra aplicação consegue consumi-lo corretamente.

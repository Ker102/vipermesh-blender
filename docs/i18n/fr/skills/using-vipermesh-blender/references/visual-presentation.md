<a id="visual-presentation"></a>
# Présentation visuelle

<a id="build-a-useful-feedback-loop"></a>
## Construire une boucle de retour utile

Utilisez les aperçus pour répondre à des questions concrètes : composition,
échelle relative, orientation, visibilité, lisibilité des matériaux, contact et
direction de l'éclairage. Évitez les captures répétées qui ne changent aucune
décision.

Pour une reconstruction de référence, comparez les plus grands repères visuels
avant de passer du temps sur les petits détails. Les passes ultérieures peuvent
prioriser les objets selon leur importance dans la caméra prévue.

<a id="camera"></a>
## Caméra

La longueur focale, la hauteur de caméra, la perspective et le remplissage du
cadre sont créatifs et dépendent de la tâche. Utilisez les outils de cadrage et
l'inspection de caméra pour correspondre au résultat demandé ; n'imposez pas un
préréglage universel d'intérieur, de produit ou cinématographique.

Vérifiez que les objets requis sont visibles et que les silhouettes importantes
ne sont pas accidentellement recadrées ou masquées. Une caméra peut cacher des
erreurs structurelles ; le cadrage visuel ne remplace donc pas la validation
spatiale.

<a id="lighting"></a>
## Éclairage

Choisissez les lumières à partir de la source prévue, de l'ambiance, de la
réponse des matériaux et du moteur de rendu. Les préréglages de studio sont de
bons points de départ pour les assets isolés, tandis que des lumières
personnalisées et des environnements world peuvent convenir aux scènes avec des
fenêtres, des luminaires, des conditions extérieures ou une direction stylisée
explicites.

Jugez l'exposition, la séparation des couleurs, la lisibilité des ombres et le
fait que les zones lumineuses effacent ou non la couleur des matériaux. Les
plages numériques d'énergie sont des points de départ plutôt que des règles
indépendantes de la scène.

<a id="acceptance"></a>
## Acceptation

Inspectez l'artefact de rendu final, pas seulement les réponses de succès des
outils. Si un problème visible demeure, effectuez une réparation ciblée et
relancez le rendu au lieu de reconstruire des éléments de scène sans rapport.

`inspect_render_artifact` vérifie l'intégrité de l'image, pas si l'image
correspond au brief. Ouvrez l'image avec la capacité image/visualiseur du
client. Si le client ne peut pas la voir, indiquez que la qualité visuelle reste
non vérifiée.

Pour chaque objet ou modification requis, comparez les preuves à l'intention de
l'utilisateur : présence et proportions, direction fonctionnelle, contact ou
attache, dégagement, visibilité et lisibilité des matériaux. Prenez une vue de
diagnostic latérale ou supérieure quand la caméra principale cache une relation
suspecte. Les rapports de support fondés sur les limites peuvent manquer les
supports creux, les pièces tournées, les poignées et les collisions de maillage
locales. Interprétez-les avec la géométrie réelle et l'intention exprimée, au
lieu de traiter un rapport réussi comme une acceptation complète. Revérifiez les
relations affectées après une réparation.

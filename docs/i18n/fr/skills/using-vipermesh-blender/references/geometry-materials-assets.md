<a id="geometry-materials-and-assets"></a>
# Géométrie, matériaux et assets

<a id="geometry-strategy"></a>
## Stratégie de géométrie

Choisissez une approche selon la forme demandée et l'usage en aval :

- primitives et outils d'assemblage pour les blockouts et les structures
  hard-surface
- courbes pour les chemins, câbles, rails et formes pilotées par profil
- modificateurs pour la répétition réversible, le lissage, l'épaisseur et la
  déformation
- outils de retopologie pour la réduction de densité ou la conversion de
  topologie
- `execute_code` pour la géométrie procédurale personnalisée qui n'a pas
  d'opération directe appropriée

Évitez de traiter une méthode comme universellement supérieure. Préservez la
géométrie source quand une conversion destructive rendrait l'itération plus
difficile.

<a id="materials"></a>
## Matériaux

Utilisez des outils de matériaux structurés pour les flux de travail courants
Principled BSDF et textures. Vérifiez les chemins de textures, l'espace
colorimétrique, la dépendance aux UV et le comportement du moteur de rendu quand
le résultat compte au-delà d'un aperçu.

Les valeurs de matériau doivent répondre à la substance prévue, à l'échelle, à
l'éclairage et à la direction artistique. Les valeurs par défaut et les plages
physiques sont des références utiles, pas une raison de remplacer une
stylisation délibérée.

<a id="assets"></a>
## Assets

Recherchez des assets réutilisables avant d'approximer manuellement des objets
complexes dont l'identité dépend d'une géométrie détaillée. Importez les assets
multi-objets via une racine gérée quand c'est possible, puis inspectez les
limites, l'échelle, l'orientation et le support dans la scène de destination.

Une correspondance d'asset est un candidat, pas une acceptation automatique.
Vérifiez que sa licence, son style, sa topologie, ses matériaux et sa direction
fonctionnelle correspondent à la tâche.

<a id="characters-animation-and-export"></a>
# Personnages, animation et export

<a id="character-work"></a>
## Travail sur les personnages

Traitez la retopologie, les UV, la génération de rig, le binding, le nettoyage
des poids et la préparation à l'animation comme des préoccupations séparées,
avec des vérifications explicites entre elles. Un appel d'opérateur réussi ne
prouve pas la qualité de déformation ni la préparation pour la production.

Choisissez décimation, voxel remesh, QuadriFlow ou travail de topologie
personnalisé selon le maillage source et l'usage cible. Préservez une révision
source avant les changements de topologie destructifs.

Pour le rigging, vérifiez l'échelle, les transformations, l'intégrité du
maillage, l'alignement de l'armature, les groupes de déformation, la
normalisation des poids et des déformations représentatives. Les poids
automatiques sont un point de départ dont l'adéquation dépend du maillage et du
mouvement.

<a id="animation"></a>
## Animation

Inspectez la plage d'images, les actions, les contraintes, les drivers, le
mouvement racine et la compatibilité du rig cible avant modification. Le
retargeting et le baking peuvent perdre des informations ; gardez donc une
source récupérable et validez des poses ou segments de mouvement représentatifs.

<a id="export"></a>
## Export

Choisissez le format et les options à partir du pipeline de destination plutôt
qu'un préréglage universel. Avant l'export, inspectez :

- l'inclusion prévue des objets et collections
- les transformations et l'échelle
- la topologie et les normales
- les UV, matériaux et dépendances de textures
- l'armature, les poids, les actions et la plage d'animation
- les modificateurs ou contraintes qui doivent être appliqués ou préservés

Validez l'artefact exporté quand c'est possible. Un fichier enregistré ne
constitue pas une preuve suffisante qu'une autre application peut le consommer
correctement.

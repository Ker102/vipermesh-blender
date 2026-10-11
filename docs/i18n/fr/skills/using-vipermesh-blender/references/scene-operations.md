<a id="scene-operations"></a>
# Opérations de scène

<a id="choose-the-smallest-useful-surface"></a>
## Choisir la plus petite surface utile

- Inspectez avant de modifier une scène existante.
- Recherchez ou filtrez le registre autour de la tâche actuelle.
- Préférez une opération déterministe nommée quand elle correspond au changement
  demandé.
- Utilisez `execute_code` quand une logique Blender personnalisée est
  nettement plus claire ou plus capable que la composition des outils
  disponibles.

<a id="group-calls-deliberately"></a>
## Regrouper les appels délibérément

`call_blender_tool_batch` est utile pour les actions indépendantes ou déjà
décidées, comme créer un blockout connu ou appliquer plusieurs transformations
connues. Gardez les appels séparés quand l'action suivante dépend de
dimensions, du contact, de la topologie, du retour viewport ou d'un rendu.

`run_blender_scene_stage` peut compacter le travail courant de construction,
d'aperçu et de finalisation. Ses étapes restent optionnelles et peuvent
configurer la caméra et l'éclairage. Définissez `preservePresentation: true` à
la finalisation pour conserver la présentation active. Les outils autonomes sont
appropriés pour les réparations ciblées et les flux de travail qui ne
correspondent pas à la forme par étapes.

<a id="preserve-user-work"></a>
## Préserver le travail de l'utilisateur

Traitez les objets, collections, modificateurs, matériaux, animations et chemins
de fichiers existants comme un état appartenant à l'utilisateur. Préférez les
modifications réversibles et dupliquez ou enregistrez une révision avant les
opérations destructrices quand la récupération serait coûteuse.

Utilisez des noms descriptifs pour les objets et collections quand des
opérations ultérieures dépendent de leur identité. Ne réorganisez pas une scène
uniquement pour la faire correspondre à une hiérarchie préférée.

<a id="finish-with-evidence"></a>
## Terminer avec des preuves

Avant de signaler l'achèvement, confirmez que les objets et changements demandés
existent et inspectez les relations structurelles à haut risque. Enregistrez un
fichier blend seulement quand l'utilisateur le demande, en utilisant sa
destination approuvée. Omettez `blendPath` pour les travaux de rendu uniquement ;
les flux d'inspection et d'export peuvent utiliser des outils autonomes sans
enregistrer ni écraser de fichier blend. Produisez et inspectez l'artefact
visuel ou d'export demandé avant d'affirmer qu'il est prêt.

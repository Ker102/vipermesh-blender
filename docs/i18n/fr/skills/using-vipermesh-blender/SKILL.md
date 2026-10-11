---
name: using-vipermesh-blender
description: Fait fonctionner Blender via le connecteur MCP ViperMesh persistant. À utiliser pour l'inspection de scène, les modifications Blender structurées, la validation, le rendu, le rigging, l'animation, la retopologie, les assets et l'export.
---

<a id="using-vipermesh-for-blender"></a>
# Utiliser ViperMesh For Blender

Utilisez un seul processus serveur MCP pour toute la session d'agent. Le client
MCP doit démarrer le serveur ; ne lancez pas `npm`, `npx`, `tsx` ni un autre
processus serveur pour des opérations Blender individuelles.

<a id="start-a-session"></a>
## Démarrer une session

1. Appelez `bootstrap_vipermesh_session`.
2. Inspectez l'état de la scène existante avant de le modifier.
3. Utilisez `search_3d_guidance` quand la sémantique de la tâche ou une
   opération inconnue nécessite une clarification.
4. Utilisez `list_blender_tools` avec une catégorie pertinente ou un terme de
   recherche plutôt que de charger le registre complet.

Préférez les outils déterministes quand ils expriment l'opération prévue.
Gardez `execute_code` disponible pour la géométrie personnalisée, les effets
procéduraux, les graphes de noeuds inhabituels et les autres travaux que les
outils structurés ne couvrent pas bien.

Regroupez les opérations seulement quand leurs entrées sont déjà connues et
qu'aucun résultat intermédiaire ne change la décision suivante. Préservez les
points d'inspection et de réparation entre les étapes significatives.

Avant de terminer, inspectez la sortie demandée et validez les relations qui
comptent pour cette tâche. Un appel d'outil réussi ou un fichier image sain
n'est pas un verdict de qualité. Signalez les défauts non résolus. Enregistrez
uniquement les artefacts demandés vers des chemins approuvés ; choisissez des
outils autonomes quand une étape remplacerait la caméra, l'éclairage ou le
cadrage d'un artiste.

<a id="references"></a>
## Références

- Mutation de scène et cycle de vie : [references/scene-operations.md](references/scene-operations.md)
- Contact, orientation et dégagement : [references/spatial-validation.md](references/spatial-validation.md)
- Caméra, éclairage, aperçus et acceptation : [references/visual-presentation.md](references/visual-presentation.md)
- Géométrie, matériaux et assets : [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- Personnages, animation et export : [references/character-animation-export.md](references/character-animation-export.md)

Ces références fournissent des motifs et vérifications utiles, pas des recettes
obligatoires. Adaptez-les à l'objectif de l'utilisateur, à la scène actuelle, au
moteur de rendu actif et aux preuves disponibles.

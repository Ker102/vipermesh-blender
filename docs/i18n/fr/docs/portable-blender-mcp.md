<a id="portable-blender-mcp-gateway"></a>
# Passerelle MCP Blender portable

<a id="result-review-and-existing-scenes"></a>
## Revue des résultats et scènes existantes

Les appels qui produisent des images attachent directement un PNG/JPEG quand il
est disponible sur le système de fichiers du serveur MCP et pèse au plus 3 MiB.
Sinon, utilisez le chemin d'artefact indiqué avec un visualiseur d'images. Le
drapeau `imageAttached` indique la disponibilité du transport ;
`visualReviewRequired` signifie que l'agent doit juger la sortie réelle par
rapport à la tâche. L'état du fichier image et les commandes réussies ne sont
pas des scores de qualité visuelle.

Les aides d'étape sont des opérations de commodité optionnelles. Définissez
`preservePresentation: true` à la finalisation pour conserver la caméra,
l'éclairage et le cadrage actuels. `blendPath` est optionnel ; omettez-le pour
un rendu sans enregistrer de fichier blend. L'enregistrement via finalisation
refuse une destination existante. Utilisez un enregistrement autonome seulement
quand un écrasement est prévu et autorisé. Les `spatialRelations` explicites
sont revérifiées à la finalisation, et les relations en échec retiennent la
sortie finale. Les vérifications diagnostiques ne peuvent pas certifier un
contact de maillage arbitraire ; inspectez les zones suspectes depuis des vues
révélatrices.

La passerelle portable permet aux agents de codage de confiance d'appeler les
outils ViperMesh Blender via le transport MCP stdio standard, y compris
`execute_code` pour mesurer le comportement de fallback pendant les tests
locaux.

C'est un connecteur local de confiance. Les services cloud authentifiés et les
droits commerciaux restent hors de l'addon public et du package MCP.

<a id="execution-paths"></a>
## Chemins d'exécution

La passerelle portable est additive :

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

Le serveur MCP conserve son socket Blender pendant toute la durée de vie du
processus au lieu de se reconnecter après chaque appel d'outil.

<a id="requirements"></a>
## Prérequis

- Node.js et les dépendances installées de ce dépôt.
- Blender en cours d'exécution avec l'addon ViperMesh installé et son serveur
  local démarré.
- L'addon joignable à `127.0.0.1:9876`, sauf remplacement par
  `BLENDER_MCP_HOST` et `BLENDER_MCP_PORT`.
La recherche de compétences d'outils locales versionnées fonctionne sans base
de données ni identifiants d'embedding.

<a id="start-the-gateway"></a>
## Démarrer la passerelle

Depuis la racine du dépôt :

```bash
npm run mcp
```

Le processus communique sur stdin/stdout avec MCP JSON-RPC. Les diagnostics de
démarrage sont écrits sur stderr.

<a id="coding-agent-configuration"></a>
## Configuration d'agent de codage

Utilisez le point d'entrée construit depuis un chemin de dépôt absolu :

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/vipermesh-blender/dist/public-portable-blender-mcp.js"
      ]
    }
  }
}
```

L'emplacement exact de configuration dépend de l'agent de codage. Redémarrez ou
ouvrez une nouvelle session d'agent après l'enregistrement du serveur si le
client ne recharge pas les serveurs MCP dynamiquement. Voir la [configuration du client MCP](client-setup.md)
pour Codex et les détails de compatibilité client.

<a id="available-mcp-tools"></a>
## Outils MCP disponibles

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` accepte seulement les commandes présentes dans le registre
d'outils ViperMesh. Contrairement aux surfaces orientées production, cette
passerelle locale de confiance expose `execute_code` afin que les tests puissent
révéler où l'agent revient encore au Python Blender libre.

Exemple de requête :

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

Utilisez `list_blender_tools` pour inspecter les commandes disponibles et leurs
descriptions de paramètres.

`call_blender_tool_batch` accepte jusqu'à 32 commandes ordonnées et s'arrête par
défaut après la première réponse échouée. Utilisez-le pour un groupe déjà décidé
comme la création de plusieurs primitives ou l'application de plusieurs
assignations de matériaux indépendantes. Ne regroupez pas au-delà d'un point où
l'action suivante dépend d'une inspection, d'un ancrage ou d'un retour visuel.

`run_blender_scene_stage` fournit un flux de travail compact additif sur le même
socket persistant :

- `build` exécute un batch de construction borné fourni par l'appelant.
- `inspect_preview` vérifie l'ancrage et les relations spatiales nommées
  optionnelles, cadre et rend un aperçu léger, puis inspecte l'artefact.
- `finalize` configure et valide la caméra de présentation, puis rend et
  enregistre seulement quand la validation réussit.

Appelez les étapes séparément. L'agent doit inspecter l'aperçu entre
`inspect_preview` et `finalize`, et peut utiliser n'importe quel outil Blender
autonome pour les réparations avant de répéter l'inspection. Les réponses
d'étape renvoient intentionnellement des champs compacts de statut, compte et
artefact au lieu de payloads Blender complets afin de réduire le contexte et la
charge en tokens. Les appels autonomes et batch génériques restent disponibles.

Le serveur garde ouverte une connexion Blender paresseuse unique et sérialise
tous les appels unitaires et batch via celle-ci. Si Blender ferme le socket, le
client se reconnecte à l'appel suivant. Les hôtes MCP doivent démarrer
`npm run mcp` une fois par session d'agent, pas une fois par outil.

<a id="agent-context"></a>
## Contexte d'agent

`bootstrap_vipermesh_session` est le premier appel requis pour un agent qui ne
connaît pas l'environnement. Il vérifie Blender, renvoie le contexte
opérationnel compact, identifie le modèle de session persistant et recommande
les appels suivants.

`get_blender_agent_context` renvoie les règles opérationnelles compactes
publiques pour l'inspection, la récupération de conseils, la préférence pour les
outils directs, le batching borné, le fallback `execute_code`, l'ancrage et
l'acceptation visuelle. Le prompt et l'orchestration privés du produit
ViperMesh ne sont pas distribués par ce connecteur.

Un agent MCP arbitraire doit charger un profil au début de la session, interroger
`search_3d_guidance` pour la tâche concrète et utiliser `list_blender_tools`
uniquement pour la catégorie de capacité ou le terme de recherche pertinent. Par
exemple, un travail de retopologie doit récupérer les conseils versionnés de
remesh et de topologie avant de choisir entre décimation, voxel remesh,
QuadriFlow ou code de fallback personnalisé.

<a id="guidance-retrieval"></a>
## Récupération de conseils

`search_3d_guidance` prend en charge :

- `source: "local"` pour une recherche déterministe sur les références de la
  compétence d'agent publique dans `skills/using-vipermesh-blender/references` ;
- `source: "semantic"` pour un adaptateur sémantique ViperMesh privé configuré ;
- `source: "all"` pour combiner les deux.

La récupération sémantique est un adaptateur optionnel du produit privé. Le
connecteur public livre une récupération déterministe de compétence d'outils
locale et n'exige pas de base de données ni d'identifiants d'embedding.

`get_3d_guidance_document` lit un basename Markdown depuis
`skills/using-vipermesh-blender/references`. Les chemins de système de fichiers
arbitraires et les traversées sont rejetés.

Les références de compétence décrivent des capacités, compromis et motifs de
validation. Ce sont des recommandations, pas des recettes de scène universelles.
Le corpus RAG privé de ViperMesh n'est pas distribué dans le connecteur public.

<a id="security-boundary"></a>
## Limite de sécurité

Cette passerelle locale est destinée à une station de travail de confiance.

- Elle utilise stdio et n'ouvre aucun écouteur réseau supplémentaire.
- L'addon Blender doit rester lié au loopback.
- Elle expose l'exécution Python libre pour les tests de fallback locaux de
  confiance.
- Elle n'impose pas d'abonnements et ne protège pas l'implémentation locale de
  l'addon.

Une future version de production devrait utiliser un plan de contrôle ViperMesh
distant authentifié pour l'orchestration premium, les conseils privés, l'accès
aux fournisseurs et les plans d'action signés. L'authentification locale seule
ne peut pas rendre inviolable un logiciel exécuté sur une machine contrôlée par
l'utilisateur.

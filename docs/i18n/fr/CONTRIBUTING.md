<a id="contributing"></a>
# Contribution

Merci d'améliorer ViperMesh for Blender.

<a id="development"></a>
## Développement

Prérequis :

- Node.js 20 ou plus récent
- Python 3.11 ou plus récent
- Blender 5.2 pour les vérifications de compatibilité en direct

```bash
npm install
npm run check
```

Installez `addon/vipermesh-addon.py` via le flux **Install from Disk** de
Blender, démarrez le pont local, puis exécutez `npm run mcp` pour les tests en
direct.

<a id="pull-requests"></a>
## Pull Requests

- Gardez les changements ciblés et expliquez le comportement visible par
  l'utilisateur.
- Ajoutez ou mettez à jour la couverture de conformité pour les changements de
  protocole et de packaging.
- Testez les mutations Blender sur une scène jetable.
- Ne validez jamais d'identifiants, de catalogues d'assets privés, de preuves
  de benchmark ni de code propriétaire du produit ViperMesh.
- Préservez la conception qui privilégie les outils déterministes et gardez
  `execute_code` disponible pour les travaux personnalisés non couverts.

Utilisez des sujets de style Conventional Commits quand c'est pratique, comme
`feat(addon): add mesh validation`.

En contribuant, vous acceptez que votre contribution soit publiée sous la
License MIT.

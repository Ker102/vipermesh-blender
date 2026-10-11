<a id="security-policy"></a>
# Politique de sécurité

<a id="supported-versions"></a>
## Versions prises en charge

Les correctifs de sécurité sont fournis pour la dernière version publiée.

<a id="reporting"></a>
## Signalement

N'ouvrez pas d'issue publique pour une vulnérabilité. Utilisez le flux privé
**Report a vulnerability** de GitHub dans l'onglet Security du dépôt.

Incluez la version affectée, les étapes de reproduction, l'impact et toute
mesure d'atténuation suggérée. Veuillez laisser aux mainteneurs le temps
d'enquêter avant toute divulgation.

<a id="trust-boundary"></a>
## Limite de confiance

ViperMesh for Blender est un connecteur pour station de travail locale de
confiance :

- L'addon se lie à `127.0.0.1` par défaut.
- Le serveur MCP communique avec les clients par stdio.
- `execute_code` peut exécuter du Python arbitraire dans Blender.
- Le connecteur ne fournit pas de limite d'authentification distante.

Ne connectez que des clients MCP de confiance. N'exposez pas le port du pont
Blender à un LAN ou à l'internet public, et n'utilisez pas le connecteur pour
ouvrir des fichiers `.blend` non fiables ou exécuter des prompts non fiables
sans examen.

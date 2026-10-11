<a id="spatial-validation"></a>
# Validation spatiale

<a id="read-world-space-state"></a>
## Lire l'état en espace monde

Les origines d'objets et les dimensions locales ne sont pas des substituts
fiables aux limites évaluées en espace monde. La rotation, l'échelle, le
parenting, les modificateurs et la géométrie évaluée peuvent changer les
surfaces importantes.

Quand le placement a des conséquences, inspectez les objets pertinents et
raisonnez à partir de leurs limites en espace monde, de leurs points d'attache
ou des impacts de surface réels.

<a id="express-the-intended-relationship"></a>
## Exprimer la relation voulue

Choisissez une validation qui correspond au sens voulu par l'utilisateur :

- `supported_by` ou `on_top_of` pour le support physique
- relations de face ou d'orientation pour la direction fonctionnelle
- vérifications de dégagement pour les espaces requis
- vérifications de contenance pour les objets censés se trouver dans un autre
  objet
- alignement de points d'attache pour les pièces qui doivent se rejoindre
  précisément

Un ordre vertical large comme « au-dessus » ne prouve pas le contact. Un angle
de caméra propre ne prouve pas non plus qu'un objet repose sur un support ou
n'intersecte rien.

<a id="use-recommendations-not-fixed-layouts"></a>
## Utiliser des recommandations, pas des agencements fixes

L'échelle, l'espacement et l'orientation raisonnables dépendent de l'asset, de
la caméra, de l'animation, de la plateforme cible et de l'intention artistique.
Utilisez des dimensions de référence ou des plages de dégagement comme preuves
de départ quand elles sont utiles, puis adaptez-les.

Après un placement serré, inspectez depuis un angle qui révèle la profondeur et
le contact. Réparez les objets flottants, la pénétration involontaire, la
direction fonctionnelle inversée et les erreurs de support avant l'acceptation
finale.

<a id="characters-animation-and-export"></a>
# Charaktere, Animation und Export

<a id="character-work"></a>
## Charakterarbeit

Behandle Retopologie, UVs, Rig-Erzeugung, Binding, Gewichtsbereinigung und
Animationsbereitschaft als getrennte Anliegen mit expliziten Prüfungen zwischen
ihnen. Ein erfolgreicher Operatoraufruf beweist weder Deformationsqualität noch
Produktionsbereitschaft.

Wähle Decimation, Voxel Remesh, QuadriFlow oder individuelle Topologiearbeit je
nach Quell-Mesh und Zielverwendung. Bewahre vor destruktiven Topologieänderungen
eine Quellrevision.

Prüfe beim Rigging Skalierung, Transformationen, Mesh-Integrität,
Armature-Ausrichtung, Deform-Gruppen, Gewichtsnormalisierung und repräsentative
Deformationen. Automatische Gewichte sind ein Ausgangspunkt, dessen Eignung von
Mesh und Bewegung abhängt.

<a id="animation"></a>
## Animation

Inspiziere Framebereich, Actions, Constraints, Drivers, Root Motion und
Ziel-Rig-Kompatibilität vor dem Bearbeiten. Retargeting und Baking können
verlustbehaftet sein; halte daher eine wiederherstellbare Quelle bereit und
validiere repräsentative Posen oder Bewegungsabschnitte.

<a id="export"></a>
## Export

Wähle Format und Optionen nach der Ziel-Pipeline statt nach einem universellen
Preset. Inspiziere vor dem Export:

- beabsichtigte Einbeziehung von Objekten und Collections
- Transformationen und Skalierung
- Topologie und Normalen
- UVs, Materialien und Texturabhängigkeiten
- Armature, Gewichte, Actions und Animationsbereich
- Modifier oder Constraints, die angewendet oder bewahrt werden müssen

Validiere das exportierte Artefakt, wenn möglich. Eine gespeicherte Datei ist
kein ausreichender Beleg dafür, dass eine andere Anwendung sie korrekt verwenden kann.

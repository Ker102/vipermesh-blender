<a id="spatial-validation"></a>
# Räumliche Validierung

<a id="read-world-space-state"></a>
## World-Space-Zustand lesen

Objektursprünge und lokale Abmessungen sind kein verlässlicher Ersatz für
evaluierte World-Space-Bounds. Rotation, Skalierung, Parenting, Modifier und
evaluierte Geometrie können die relevanten Oberflächen verändern.

Wenn Platzierung folgenreich ist, inspiziere die relevanten Objekte und schließe
aus ihren World-Space-Bounds, Befestigungspunkten oder tatsächlichen Surface-Hits.

<a id="express-the-intended-relationship"></a>
## Die beabsichtigte Beziehung ausdrücken

Wähle eine Validierung, die zur Bedeutung des Benutzers passt:

- `supported_by` oder `on_top_of` für physische Auflage
- Facing- oder Orientierungsbeziehungen für funktionale Richtung
- Freiraumprüfungen für erforderliche Abstände
- Containment-Prüfungen für Objekte, die in einem anderen Objekt sein sollen
- Ausrichtung von Befestigungspunkten für Teile, die präzise zusammentreffen müssen

Grobe vertikale Ordnung wie "above" beweist keinen Kontakt. Auch ein sauberer
Kamerawinkel beweist nicht, dass ein Objekt geerdet oder nicht überschneidend ist.

<a id="use-recommendations-not-fixed-layouts"></a>
## Empfehlungen verwenden, keine festen Layouts

Angemessene Skalierung, Abstände und Orientierung hängen vom Asset, von der Kamera,
Animation, Zielplattform und künstlerischen Absicht ab. Verwende Referenzmaße oder
Freiraumbereiche als Ausgangsevidenz, wenn nützlich, und passe sie dann an.

Inspiziere nach enger Platzierung aus einem Winkel, der Tiefe und Kontakt offenlegt.
Repariere schwebende Objekte, unbeabsichtigtes Eindringen, umgekehrte funktionale
Richtung und Auflagefehler vor der finalen Abnahme.

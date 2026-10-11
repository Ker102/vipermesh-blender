<a id="visual-presentation"></a>
# Visuelle Präsentation

<a id="build-a-useful-feedback-loop"></a>
## Eine nützliche Feedback-Schleife aufbauen

Verwende Vorschauen, um konkrete Fragen zu beantworten: Komposition, relative
Skalierung, Orientierung, Sichtbarkeit, Materiallesbarkeit, Kontakt und
Beleuchtungsrichtung. Vermeide wiederholte Screenshots, die keine Entscheidung ändern.

Vergleiche bei Referenzrekonstruktionen die größten visuellen Anker, bevor du
Zeit auf kleine Details verwendest. Spätere Durchgänge können Objekte nach ihrer
Prominenz in der beabsichtigten Kamera priorisieren.

<a id="camera"></a>
## Kamera

Brennweite, Kamerahöhe, Perspektive und Frame-Füllung sind kreativ und
aufgabenabhängig. Verwende Framing-Werkzeuge und Kamerainspektion, um das
angeforderte Ergebnis zu treffen; erzwinge kein universelles Preset für Interior,
Produkt oder Kino.

Prüfe, dass erforderliche Objekte sichtbar sind und wichtige Silhouetten nicht
versehentlich abgeschnitten oder verborgen werden. Eine Kamera kann strukturelle
Fehler verbergen, daher ersetzt visuelles Framing keine räumliche Validierung.

<a id="lighting"></a>
## Beleuchtung

Wähle Lichter nach beabsichtigter Quelle, Stimmung, Materialreaktion und Render-
Engine. Studio-Presets sind nützliche Ausgangspunkte für isolierte Assets, während
individuelle Lichter und World-Environments zu Szenen mit expliziten Fenstern,
Leuchten, Außenbedingungen oder stilisierter Richtung passen können.

Beurteile Belichtung, Farbtrennung, Schattenlesbarkeit und ob helle Bereiche
Materialfarbe auslöschen. Numerische Energiebereiche sind Ausgangspunkte statt
szenenunabhängige Regeln.

<a id="acceptance"></a>
## Abnahme

Inspiziere das finale Render-Artefakt, nicht nur erfolgreiche Werkzeugantworten.
Wenn ein sichtbares Problem bleibt, nimm eine fokussierte Reparatur vor und
rendere erneut, statt nicht verwandte Szenenelemente neu aufzubauen.

`inspect_render_artifact` prüft Bildintegrität, nicht ob das Bild zum Briefing
passt. Öffne das Bild mit der Bild-/Viewer-Fähigkeit des Clients. Wenn der Client
es nicht anzeigen kann, gib an, dass die visuelle Qualität unbestätigt bleibt.

Vergleiche für jedes erforderliche Objekt oder jede Bearbeitung die Evidenz mit
der Absicht des Benutzers: Vorhandensein und Proportionen, funktionale Facing-
Richtung, Kontakt oder Befestigung, Freiraum, Sichtbarkeit und Materiallesbarkeit.
Nimm eine diagnostische Seiten- oder Draufsicht, wenn die Hauptkamera eine
verdächtige Beziehung verbirgt. Bounds-basierte Auflageberichte können hohle
Stützen, rotierte Teile, Griffe und lokale Mesh-Kollisionen übersehen. Interpretiere
sie mit tatsächlicher Geometrie und erklärter Absicht, statt einen bestandenen
Bericht als vollständige Abnahme zu behandeln. Prüfe betroffene Beziehungen nach
einer Reparatur erneut.

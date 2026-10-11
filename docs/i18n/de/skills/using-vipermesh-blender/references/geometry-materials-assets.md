<a id="geometry-materials-and-assets"></a>
# Geometrie, Materialien und Assets

<a id="geometry-strategy"></a>
## Geometriestrategie

Wähle einen Ansatz auf Grundlage der angeforderten Form und der nachgelagerten Verwendung:

- Primitives und Assembly-Werkzeuge für Blockouts und Hard-Surface-Strukturen
- Curves für Pfade, Kabel, Schienen und profilgesteuerte Formen
- Modifier für reversible Wiederholung, Glättung, Dicke und Deformation
- Retopologie-Werkzeuge für Dichtesenkung oder Topologiekonvertierung
- `execute_code` für individuelle prozedurale Geometrie, für die es keine passende direkte
  Operation gibt

Vermeide, eine Methode als universell überlegen zu behandeln. Bewahre
Quellgeometrie, wenn eine destruktive Konvertierung Iteration erschweren würde.

<a id="materials"></a>
## Materialien

Verwende strukturierte Materialwerkzeuge für gängige Principled BSDF- und
Textur-Workflows. Prüfe Texturpfade, Farbraum, UV-Abhängigkeit und Render-Engine-
Verhalten, wenn das Ergebnis über eine Vorschau hinaus wichtig ist.

Materialwerte sollten auf beabsichtigte Substanz, Skalierung, Beleuchtung und
Art Direction reagieren. Defaults und physikalische Bereiche sind nützliche
Referenzen, kein Grund, absichtliche Stilisierung zu überschreiben.

<a id="assets"></a>
## Assets

Suche wiederverwendbare Assets, bevor du komplexe Objekte, deren Identität von
detaillierter Geometrie abhängt, manuell annäherst. Importiere Multi-Object-
Assets nach Möglichkeit über eine verwaltete Wurzel und inspiziere anschließend
Bounds, Skalierung, Orientierung und Auflage in der Zielszene.

Eine Asset-Übereinstimmung ist ein Kandidat, keine automatische Abnahme. Prüfe,
ob Lizenz, Stil, Topologie, Materialien und funktionale Richtung zur Aufgabe passen.

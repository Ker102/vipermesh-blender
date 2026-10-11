<a id="contributing"></a>
# Mitwirken

Danke, dass du ViperMesh for Blender verbesserst.

<a id="development"></a>
## Entwicklung

Anforderungen:

- Node.js 20 oder neuer
- Python 3.11 oder neuer
- Blender 5.2 für Live-Kompatibilitätsprüfungen

```bash
npm install
npm run check
```

Installiere `addon/vipermesh-addon.py` über Blenders **Install from Disk**-
Workflow, starte die lokale Bridge und führe `npm run mcp` für Live-Tests aus.

<a id="pull-requests"></a>
## Pull Requests

- Halte Änderungen fokussiert und erkläre das für Benutzer sichtbare Verhalten.
- Ergänze oder aktualisiere Konformitätsabdeckung für Protokoll- und Paketierungsänderungen.
- Teste Blender-Mutationen in einer Wegwerf-Szene.
- Committe niemals Zugangsdaten, private Asset-Kataloge, Benchmark-Belege oder
  proprietären ViperMesh-Produktcode.
- Bewahre das deterministic-tool-first-Design und halte `execute_code` für
  nicht abgedeckte individuelle Arbeiten verfügbar.

Verwende, wo praktikabel, Betreffzeilen im Conventional-Commit-Stil, zum Beispiel
`feat(addon): add mesh validation`.

Mit deinem Beitrag erklärst du dich damit einverstanden, dass dein Beitrag unter
der MIT License lizenziert wird.

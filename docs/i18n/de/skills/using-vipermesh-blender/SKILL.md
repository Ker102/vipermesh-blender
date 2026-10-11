---
name: using-vipermesh-blender
description: Bedient Blender über den persistenten ViperMesh MCP-Connector. Für Szeneninspektion, strukturierte Blender-Bearbeitungen, Validierung, Rendering, Rigging, Animation, Retopologie, Assets und Export verwenden.
---

<a id="using-vipermesh-for-blender"></a>
# ViperMesh For Blender verwenden

Verwende einen MCP-Serverprozess für die vollständige Agent-Sitzung. Der MCP-
Client sollte den Server starten; starte `npm`, `npx`, `tsx` oder einen anderen
Serverprozess nicht für einzelne Blender-Operationen.

<a id="start-a-session"></a>
## Eine Sitzung starten

1. Rufe `bootstrap_vipermesh_session` auf.
2. Inspiziere den vorhandenen Szenenzustand, bevor du ihn änderst.
3. Verwende `search_3d_guidance`, wenn Aufgabenbedeutung oder eine unbekannte Operation Klärung brauchen.
4. Verwende `list_blender_tools` mit einer relevanten Kategorie oder einem Suchbegriff, statt
   die vollständige Registry zu laden.

Bevorzuge deterministische Werkzeuge, wenn sie die beabsichtigte Operation
ausdrücken. Halte `execute_code` für individuelle Geometrie, prozedurale Effekte,
ungewöhnliche Node-Graphs und andere Arbeiten verfügbar, die die strukturierten
Werkzeuge nicht gut abdecken.

Batch-Operationen nur dann ausführen, wenn ihre Eingaben bereits bekannt sind
und kein Zwischenergebnis die nächste Entscheidung ändert. Bewahre Inspektions-
und Reparaturpunkte zwischen sinnvollen Phasen.

Inspiziere vor dem Abschluss die angeforderte Ausgabe und validiere die für
diese Aufgabe wichtigen Beziehungen. Ein erfolgreicher Werkzeugaufruf oder eine
intakte Bilddatei ist kein Qualitätsurteil. Melde ungelöste Defekte. Speichere
nur angeforderte Artefakte an genehmigten Pfaden; wähle eigenständige Werkzeuge,
wenn eine Phase Kamera, Beleuchtung oder Framing eines Künstlers ersetzen würde.

<a id="references"></a>
## Referenzen

- Szenenmutation und Lebenszyklus: [references/scene-operations.md](references/scene-operations.md)
- Kontakt, Orientierung und Freiraum: [references/spatial-validation.md](references/spatial-validation.md)
- Kamera, Beleuchtung, Vorschauen und Abnahme: [references/visual-presentation.md](references/visual-presentation.md)
- Geometrie, Materialien und Assets: [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- Charaktere, Animation und Export: [references/character-animation-export.md](references/character-animation-export.md)

Diese Referenzen liefern nützliche Muster und Prüfungen, keine verpflichtenden
Rezepte. Passe sie an das Ziel des Benutzers, die aktuelle Szene, die aktive
Render-Engine und die verfügbare Evidenz an.

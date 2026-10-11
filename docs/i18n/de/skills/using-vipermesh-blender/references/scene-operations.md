<a id="scene-operations"></a>
# Szenenoperationen

<a id="choose-the-smallest-useful-surface"></a>
## Die kleinste nützliche Oberfläche wählen

- Inspiziere, bevor du eine vorhandene Szene mutierst.
- Suche oder filtere die Registry rund um die aktuelle Aufgabe.
- Bevorzuge eine benannte deterministische Operation, wenn sie zur angeforderten Änderung passt.
- Verwende `execute_code`, wenn individuelle Blender-Logik wesentlich klarer oder leistungsfähiger ist
  als das Zusammensetzen verfügbarer Werkzeuge.

<a id="group-calls-deliberately"></a>
## Aufrufe bewusst gruppieren

`call_blender_tool_batch` ist nützlich für unabhängige oder bereits entschiedene
Aktionen, etwa das Erstellen eines bekannten Blockouts oder das Anwenden mehrerer
bekannter Transformationen. Halte Aufrufe getrennt, wenn die nächste Aktion von
Abmessungen, Kontakt, Topologie, Viewport-Feedback oder einem Render abhängt.

`run_blender_scene_stage` kann gängige Build-, Preview- und Finalize-Arbeit
kompakt machen. Seine Phasen bleiben optional und können Kamera und Beleuchtung
konfigurieren. Setze `preservePresentation: true` bei finalize, um die aktive
Präsentation zu behalten. Eigenständige Werkzeuge eignen sich für gezielte
Reparaturen und Workflows, die nicht in die gestufte Form passen.

<a id="preserve-user-work"></a>
## Benutzerarbeit bewahren

Behandle vorhandene Objekte, Collections, Modifier, Materialien, Animationen und
Dateipfade als benutzereigenen Zustand. Bevorzuge reversible Bearbeitungen und
dupliziere oder speichere vor destruktiven Operationen eine Revision, wenn
Wiederherstellung teuer wäre.

Verwende beschreibende Objekt- und Collection-Namen, wenn spätere Operationen
von Identität abhängen. Organisiere eine Szene nicht nur deshalb um, damit sie
einer bevorzugten Hierarchie entspricht.

<a id="finish-with-evidence"></a>
## Mit Evidenz abschließen

Bestätige vor der Abschlussmeldung, dass die angeforderten Objekte und Änderungen
existieren, und inspiziere strukturelle Hochrisikobeziehungen. Speichere eine
blend-Datei nur, wenn der Benutzer es verlangt, und verwende sein genehmigtes Ziel.
Lasse `blendPath` bei reiner Rendering-Arbeit weg; Inspektions- und Export-
Workflows können eigenständige Werkzeuge verwenden, ohne eine blend-Datei zu
speichern oder zu überschreiben. Erzeuge und inspiziere das angeforderte visuelle
oder Export-Artefakt, bevor du behauptest, es sei bereit.

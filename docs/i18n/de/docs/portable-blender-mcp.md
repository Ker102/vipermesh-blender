<a id="portable-blender-mcp-gateway"></a>
# Portable Blender MCP Gateway

<a id="result-review-and-existing-scenes"></a>
## Ergebnisprüfung und vorhandene Szenen

Bild erzeugende Aufrufe hängen ein PNG/JPEG direkt an, wenn es im Dateisystem des
MCP-Servers verfügbar und höchstens 3 MiB groß ist. Andernfalls verwende den
gemeldeten Artefaktpfad mit einem Bildbetrachter. Das Flag `imageAttached` zeigt
Transportverfügbarkeit an; `visualReviewRequired` bedeutet, dass der Agent die
tatsächliche Ausgabe anhand der Aufgabe beurteilen muss. Bilddatei-Gesundheit und
erfolgreiche Befehle sind keine visuellen Qualitätswerte.

Stage-Helfer sind optionale Komfortoperationen. Setze `preservePresentation:
true` bei finalize, um die aktuelle Kamera, Beleuchtung und Rahmung zu behalten.
`blendPath` ist optional; lasse es für ein Rendering ohne Speichern einer blend-
Datei weg. Speichern über finalize lehnt ein vorhandenes Ziel ab. Verwende einen
eigenständigen Save nur, wenn ein Überschreiben beabsichtigt und autorisiert ist.
Explizite `spatialRelations` werden bei finalize erneut geprüft, und fehlgeschlagene
Beziehungen halten finale Ausgabe zurück. Diagnoseprüfungen können beliebigen
Mesh-Kontakt nicht zertifizieren; inspiziere verdächtige Bereiche aus aufschlussreichen Ansichten.

Das portable Gateway lässt vertrauenswürdige Coding-Agenten ViperMesh-Blender-
Werkzeuge über den standardmäßigen MCP-stdio-Transport aufrufen, einschließlich
`execute_code` zum Messen von Fallback-Verhalten bei lokalen Tests.

Es ist ein vertrauenswürdiger lokaler Connector. Authentifizierte Cloud-Dienste
und kommerzielle Ansprüche bleiben außerhalb des öffentlichen Add-ons und MCP-Pakets.

<a id="execution-paths"></a>
## Ausführungspfade

Das portable Gateway ist additiv:

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

Der MCP-Server behält seinen Blender-Socket für die Lebensdauer des Prozesses,
statt nach jedem Werkzeugaufruf erneut zu verbinden.

<a id="requirements"></a>
## Anforderungen

- Node.js und die installierten Abhängigkeiten dieses Repositorys.
- Blender läuft mit installiertem ViperMesh-Add-on und gestartetem lokalen Server.
- Das Add-on ist unter `127.0.0.1:9876` erreichbar, sofern nicht mit
  `BLENDER_MCP_HOST` und `BLENDER_MCP_PORT` überschrieben.
Lokal eingecheckte Tool-Skill-Suche funktioniert ohne Datenbank- oder Embedding-
Zugangsdaten.

<a id="start-the-gateway"></a>
## Das Gateway starten

Aus dem Repository-Root:

```bash
npm run mcp
```

Der Prozess kommuniziert über stdin/stdout mit MCP JSON-RPC. Startdiagnosen
werden nach stderr geschrieben.

<a id="coding-agent-configuration"></a>
## Coding-Agent-Konfiguration

Verwende den gebauten Einstiegspunkt aus einem absoluten Repository-Pfad:

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/vipermesh-blender/dist/public-portable-blender-mcp.js"
      ]
    }
  }
}
```

Der genaue Konfigurationsort hängt vom Coding-Agenten ab. Starte neu oder öffne
eine neue Agent-Sitzung nach der Registrierung des Servers, wenn der Client MCP-
Server nicht dynamisch neu lädt. Siehe [MCP-Client-Einrichtung](client-setup.md)
für Codex- und Client-Kompatibilitätsdetails.

<a id="available-mcp-tools"></a>
## Verfügbare MCP-Werkzeuge

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` akzeptiert nur Befehle, die in der ViperMesh-Tool-Registry
vorhanden sind. Anders als produktionsgerichtete Oberflächen legt dieses
vertrauenswürdige lokale Gateway `execute_code` offen, damit Tests sichtbar
machen können, wo der Agent noch auf freies Blender-Python zurückfällt.

Beispielanfrage:

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

Verwende `list_blender_tools`, um verfügbare Befehle und ihre Parameterbeschreibungen
zu inspizieren.

`call_blender_tool_batch` akzeptiert bis zu 32 geordnete Befehle und stoppt
standardmäßig nach der ersten fehlgeschlagenen Antwort. Verwende es für einen
bereits entschiedenen Cluster, etwa das Erzeugen mehrerer Primitives oder das
Anwenden mehrerer unabhängiger Materialzuweisungen. Batch nicht über einen Punkt
hinweg, an dem die nächste Aktion von Inspektion, Grounding oder visuellem
Feedback abhängt.

`run_blender_scene_stage` stellt einen additiven kompakten Workflow über denselben
persistent Socket bereit:

- `build` führt einen begrenzten, vom Aufrufer gelieferten Construction-Batch aus.
- `inspect_preview` prüft Grounding und optionale benannte räumliche Beziehungen,
  rahmt und rendert eine leichte Vorschau und inspiziert das Artefakt.
- `finalize` richtet die Präsentationskamera ein und validiert sie, rendert dann
  und speichert nur, wenn die Validierung besteht.

Rufe die Phasen separat auf. Der Agent muss die Vorschau zwischen `inspect_preview`
und `finalize` inspizieren und kann vor einer wiederholten Inspektion jedes
eigenständige Blender-Werkzeug für Reparaturen verwenden. Stage-Antworten geben
absichtlich kompakte Status-, Zähl- und Artefaktfelder statt vollständiger
Blender-Payloads zurück, um Kontext- und Token-Overhead zu reduzieren.
Eigenständige und generische Batch-Aufrufe bleiben verfügbar.

Der Server hält eine lazy Blender-Verbindung offen und serialisiert alle Einzel-
und Batch-Aufrufe darüber. Wenn Blender den Socket schließt, verbindet der Client
beim nächsten Aufruf erneut. MCP-Hosts sollten `npm run mcp` einmal pro Agent-
Sitzung starten, nicht einmal pro Werkzeug.

<a id="agent-context"></a>
## Agent-Kontext

`bootstrap_vipermesh_session` ist der erforderliche erste Aufruf für einen
unvertrauten Agenten. Er prüft Blender, gibt den kompakten Betriebskontext zurück,
identifiziert das persistente Sitzungsmodell und empfiehlt die nächsten Aufrufe.

`get_blender_agent_context` gibt die öffentlichen kompakten Betriebsregeln für
Inspektion, Guidance-Abfrage, direkte Werkzeugpräferenz, begrenztes Batching,
`execute_code`-Fallback, Grounding und visuelle Abnahme zurück. Der private
ViperMesh-Produktprompt und die Orchestrierung werden von diesem Connector nicht verteilt.

Ein beliebiger MCP-Agent sollte zu Sitzungsbeginn ein Profil laden,
`search_3d_guidance` für die konkrete Aufgabe abfragen und `list_blender_tools`
nur für die relevante Fähigkeitskategorie oder den Suchbegriff verwenden. Zum
Beispiel sollte Retopologie-Arbeit die eingecheckte Remesh- und Topologie-Guidance
abrufen, bevor zwischen Decimation, Voxel Remesh, QuadriFlow oder individuellem
Fallback-Code gewählt wird.

<a id="guidance-retrieval"></a>
## Guidance-Abfrage

`search_3d_guidance` unterstützt:

- `source: "local"` für deterministische Suche über die öffentlichen Agent-Skill-
  Referenzen in `skills/using-vipermesh-blender/references`;
- `source: "semantic"` für einen konfigurierten privaten ViperMesh-Semantikadapter;
- `source: "all"` zum Kombinieren beider.

Semantische Abfrage ist ein optionaler Private-Product-Adapter. Der öffentliche
Connector liefert deterministische lokale Tool-Skill-Abfrage und benötigt keine
Datenbank- oder Embedding-Zugangsdaten.

`get_3d_guidance_document` liest einen Markdown-Basisnamen aus
`skills/using-vipermesh-blender/references`. Beliebige Dateisystempfade und
Traversal werden abgelehnt.

Die Skill-Referenzen beschreiben Fähigkeiten, Tradeoffs und Validierungsmuster.
Sie sind Empfehlungen, keine universellen Szenenrezepte. Der private ViperMesh-
RAG-Korpus wird im öffentlichen Connector nicht verteilt.

<a id="security-boundary"></a>
## Sicherheitsgrenze

Dieses lokale Gateway ist für die Nutzung auf einer vertrauenswürdigen Workstation gedacht.

- Es verwendet stdio und öffnet keinen zusätzlichen Netzwerk-Listener.
- Das Blender-Add-on sollte an Loopback gebunden bleiben.
- Es legt freie Python-Ausführung für vertrauenswürdige lokale Fallback-Tests offen.
- Es erzwingt keine Subscriptions und schützt die lokale Add-on-Implementierung nicht.

Eine künftige Produktionsversion sollte eine authentifizierte Remote-ViperMesh-
Control-Plane für Premium-Orchestrierung, private Guidance, Provider-Zugriff und
signierte Aktionspläne verwenden. Lokale Authentifizierung allein kann Software,
die auf einer benutzergesteuerten Maschine läuft, nicht manipulationssicher machen.

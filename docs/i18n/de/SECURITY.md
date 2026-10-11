<a id="security-policy"></a>
# Sicherheitsrichtlinie

<a id="supported-versions"></a>
## Unterstützte Versionen

Sicherheitskorrekturen werden für die neueste veröffentlichte Version bereitgestellt.

<a id="reporting"></a>
## Meldung

Öffne für eine Schwachstelle kein öffentliches Issue. Verwende GitHubs privaten
**Report a vulnerability**-Ablauf im Security-Tab des Repositorys.

Gib die betroffene Version, Reproduktionsschritte, Auswirkungen und mögliche
vorgeschlagene Abhilfen an. Bitte gib den Maintainern vor einer Offenlegung Zeit
für die Untersuchung.

<a id="trust-boundary"></a>
## Vertrauensgrenze

ViperMesh for Blender ist ein Connector für eine vertrauenswürdige lokale Workstation:

- Das Add-on bindet standardmäßig an `127.0.0.1`.
- Der MCP-Server kommuniziert mit Clients über stdio.
- `execute_code` kann beliebigen Python-Code in Blender ausführen.
- Der Connector stellt keine Remote-Authentifizierungsgrenze bereit.

Verbinde nur vertrauenswürdige MCP-Clients. Stelle den Blender-Bridge-Port weder
einem LAN noch dem öffentlichen Internet bereit und verwende den Connector nicht,
um nicht vertrauenswürdige `.blend`-Dateien zu öffnen oder nicht vertrauenswürdige
Prompts ohne Prüfung auszuführen.

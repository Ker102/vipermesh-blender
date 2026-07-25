# Security Policy

## Supported Versions

Security fixes are provided for the latest published release.

## Reporting

Do not open a public issue for a vulnerability. Use GitHub's private
**Report a vulnerability** flow in the repository Security tab.

Include the affected version, reproduction steps, impact, and any suggested
mitigation. Please allow maintainers time to investigate before disclosure.

## Trust Boundary

ViperMesh for Blender is a trusted local-workstation connector:

- The addon binds to `127.0.0.1` by default.
- The MCP server communicates with clients over stdio.
- `execute_code` can run arbitrary Python inside Blender.
- The connector does not provide a remote authentication boundary.

Only connect trusted MCP clients. Do not expose the Blender bridge port to a
LAN or the public internet, and do not use the connector to open untrusted
`.blend` files or execute untrusted prompts without review.

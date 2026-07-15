# Security Policy

## Supported versions

Gremorie is pre 1.0 and ships under a single locked version line (every
`@gremorie/*` package moves together). Security fixes land on the latest
published minor. Older minors are not patched.

| Version | Supported |
| ------- | --------- |
| 0.5.x   | Yes       |
| < 0.5   | No        |

## Reporting a vulnerability

Please do not open a public GitHub issue for security problems.

Report privately through one of these channels:

1. GitHub Security Advisories (preferred): open a draft advisory at
   https://github.com/usegremorie/gremorie/security/advisories/new
2. Email: bkalvner@gmail.com with the subject line `SECURITY: <short summary>`.

Include, when possible:

- the affected package and version (for example `@gremorie/rx-artifacts@0.3.0`)
- a description of the issue and its impact
- steps to reproduce or a minimal proof of concept
- any suggested remediation

## What to expect

- Acknowledgement within 5 business days.
- An initial assessment and severity rating shortly after.
- A fix or mitigation plan communicated before any public disclosure.
- Credit in the release notes if you would like it.

Because Gremorie ships compiled component source that consumers copy or import,
the most valuable reports usually involve unsafe rendering of untrusted model
output (for example HTML, code, or links inside an Artifact or CodeBlock).

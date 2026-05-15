# Runbook — azion-samples

## Service Identity

| Field | Value |
|-------|-------|
| Name | azion-samples |
| Type | Template/sample repository |
| Language | TypeScript, JavaScript, HTML, CSS (multi-framework) |
| Default Branch | dev |
| Consumed By | Azion CLI (`azion init`), Templates API, Console Marketplace |

## Adding a New Template

1. Create directory under `templates/<framework-name>/`
2. Add `info.json` with name, message, preset, and mode fields
3. Add `azion.config.cjs` with build and deployment configuration
4. Include complete `package.json` with dev, build, start scripts
5. Add source code and framework-specific configuration
6. Open PR to `dev` branch
7. After merge, Templates API cron syncs within 1 hour

## Adding a New Sample

1. Create directory under `samples/<sample-name>/`
2. Add `package.json` with minimal metadata (name, version, license)
3. Include edge function source in `functions/` or root
4. Add README with description and usage instructions
5. Open PR to `dev` branch

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| ci-compliance.yml | PR, weekly | Azion compliance checks |
| ci-security.yml | PR, weekly | Security scanning + SonarQube |
| cla.yml | PR/issue comments | CLA signature management |

## Release Process

Templates are released through the Templates API:
1. Merge PR to `dev`
2. Templates API cron job runs hourly, syncs this repo
3. New templates appear in `azion init` template list
4. Console marketplace requires manual admin configuration for first-time templates

## Common Issues

### 1. Template Not Appearing in CLI

**Symptoms**: New template merged but not shown by `azion init`.

**Resolution**: Wait up to 1 hour for Templates API cron sync. Verify `info.json` has valid `name` and `preset` fields. Check Templates API logs for sync errors.

### 2. Build Fails After Template Init

**Symptoms**: `azion build` fails after scaffolding from template.

**Resolution**: Check `azion.config.cjs` preset matches the framework. Verify all dependencies in `package.json` are compatible. Check Node.js version requirements.

### 3. Edge Function Runtime Errors

**Symptoms**: Deployed sample/template returns runtime errors.

**Resolution**: Ensure the function entry point matches the path in `azion.config.cjs`. Check for Node.js APIs not available in the edge runtime (file system, child_process).

### 4. CLA Check Failing

**Symptoms**: External contributor's PR blocked by CLA check.

**Resolution**: Contributor must sign CLA by commenting on the PR. Signatures stored in `aziontech/cla` repo at `/signatures/version1/cla.json`.

## Escalation

| Level | Contact | When |
|-------|---------|------|
| L1 | Team Dev Tools & Integrations | Template bugs, new framework support |
| L2 | Product Content team | Template descriptions, marketplace listing |

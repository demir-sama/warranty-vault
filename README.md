# Warranty Vault

**A UGREEN AI NAS skill that turns the receipts, manuals and serial-label photos already on your NAS into a household asset register, with return-window and warranty alerts and a source file for every date.**

- Live demo: https://warranty-vault-sama-5806.vercel.app
- The skill: [`skill/warranty-vault/SKILL.md`](skill/warranty-vault/SKILL.md) (passes `uliya-skill-kit 0.7.3` static check: 0 errors, 0 warnings)
- Round 1 package: [`public/warranty-vault-skill.zip`](public/warranty-vault-skill.zip) · proposal: [`public/warranty-vault-proposal.pdf`](public/warranty-vault-proposal.pdf)

## What's here

| Path | What |
|---|---|
| `skill/warranty-vault/` | The submitted skill: `SKILL.md` + `references/` (Markdown only) |
| `src/lib/nas.ts` | Simulated household NAS: 12 assets from 8 countries plus noise files |
| `src/lib/vault.ts` | Receipt parser with per-field evidence, reconciliation, alert rules, CSV / Markdown / ICS export |
| `src/app/api/scan` | Streams the skill's expert delegations as NDJSON |
| `src/app/api/extract` | AI extraction for your own receipts, with a verbatim-quote check on every field |
| `src/app/api/claim` | Drafts (never sends) a return request or warranty claim |
| `proposal/` | Proposal source (Markdown, ≤500 words) |

## Run locally

```bash
npm install
npm run dev
```

AI features use Vercel AI Gateway (OIDC on Vercel, or `AI_GATEWAY_API_KEY` locally). Without it, pasted receipts use the rules parser and claim drafts use a template.

## Check the skill

```bash
node uliya-skill-kit/scripts/check-skill.mjs skill/warranty-vault
```

MIT licensed. Independent project, not an official UGREEN skill.

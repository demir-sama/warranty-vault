# Disclosure

## Developed for this Hackathon

All of this Skill was written during the UGREEN Hackathon 2026 submission period: the orchestration workflow, the field schema and evidence rule, the warranty priority and regional defaults, the alert rules, the register format and the examples.

## Third-party components

The Skill package contains Markdown only. No third-party code, libraries or data are bundled. It relies on UGREEN's registered experts (file-agent, photo-agent, document-agent, knowledge-agent) on the user's NAS.

The companion web demo (not part of this package) uses Next.js (MIT), React (MIT), Tailwind CSS (MIT), Framer Motion (MIT), Zod (MIT) and the Vercel AI SDK (Apache-2.0). Source: https://github.com/demir-sama/warranty-vault

## AI tools used

- An AI coding assistant helped draft and review the Skill text and the companion web demo.
- The skill was checked with the official uliya-skill-kit static checker (version 0.7.3).
- At runtime the Skill uses only the models built into the NAS experts. No outside AI service is called and no document leaves the NAS.

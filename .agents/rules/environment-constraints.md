# Environment & Tooling Constraints

These are specific constraints for this project environment regarding deployments, tools, and system compatibility.

## 1. Vercel Hobby Plan & Git Author
**Constraint:** This repository is private and is deployed on a Vercel Hobby plan. Vercel Hobby plans strictly block builds triggered by pushes from non-owner/external collaborator accounts.
**Rule:**
- Whenever making commits and pushing to this repository on behalf of the user, ensure that the local git config matches the repository owner.
- Run `git config user.name "Safuwanlah"` (or whatever the primary owner's name is) before committing if there is any risk of committing under a bot/agent name.
- Do not let the Git author default to an agent string, as it will break the user's Vercel deployment pipeline.

## 2. Shadcn UI / Node.js v22 Compatibility
**Constraint:** The development environment uses Node.js version 22.
**Rule:**
- **DO NOT** attempt to use the automated `shadcn-ui` CLI (`npx shadcn@latest init` or `npx shadcn@latest add`). It currently throws `ERR_MODULE_NOT_FOUND` under Node v22.
- Instead of using the CLI, build all necessary UI components manually.
- For Shadcn-like quality, manually apply Tailwind CSS utilities (focus rings, hover states) and use `framer-motion` for animations, as documented in `ui-guidelines.md`.

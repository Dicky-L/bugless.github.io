# DKYL Interactive Demos — Public Display Repository

This repository serves the public GitHub Pages demos at:
https://dicky-l.github.io/bugless.github.io/

## AETHER — Two-repository architecture

- **Private source and CI:** `Dicky-L/DKYLs-Collection/aether-brand-site/` plus `.github/workflows/aether-deploy.yml`
- **Public compiled output only:** `aether-brand-site/` (generated `index.html`, `assets/*.js`, `assets/*.css`)
- **Live demo:** https://dicky-l.github.io/bugless.github.io/aether-brand-site/
- **New release process:** CI in the private source repository builds and uploads an artifact. To deploy directly to this public repository, configure `PAGES_DEPLOY_TOKEN` in the **private repository** with write permission to this repository.

Do not commit AETHER `src/`, `package.json`, `tsconfig.json`, dependencies, production configuration, or secrets here. The historical commits from before this migration may still contain former public source; removing current files does not rewrite Git history.

## Other demonstrations

- [ServiceHub Console](./servicehub-console/)
- [Energy Visual Editor](./energy-visual-editor/)
- [Energy Studio V2](./energy-studio-v2/)

Older demos might still have source folders here from an earlier workflow; their eventual migration should be handled separately to avoid breaking deployment.
All demos use artificial data and do not contain real customer credentials or production APIs.

# WeGoToCalStateLA

WeGoToCalStateLA is a community-support application for the families and loved ones of
Cal State LA students. The current priority is a web/PWA experience for community
conversations, events, resources, and pseudonymous profiles.

This repository does **not** currently deploy the unfinished API or authentication stack.
The evaluation build uses browser-local sample and user-created data. PHQ/GAD assessments,
AI chat, and clinical tracking are outside the current product scope.

## Deployed sites

- Project overview: <https://wegotocalstatela.org/>
- Evaluation application: <https://wegotocalstatela.org/community-preview-2026>

## Student development and deployment workflow

Normal application changes are automatically checked, merged, and deployed. Do not work
directly on `main`.

### 1. Clone and install

```bash
git clone https://github.com/m5b/WeGoCalStateLA.git
cd WeGoCalStateLA/client
npm ci --legacy-peer-deps
```

Run the web application locally:

```bash
npm run dev
```

Press `w` in Expo when prompted to open the web version.

### 2. Start each task from the latest `main`

Run these commands from the repository root:

```bash
git switch main
git pull origin main
git switch -c feature/short-description
```

Use a descriptive branch name, for example:

```text
feature/improve-events-page
fix/mobile-navigation
docs/update-setup-guide
```

### 3. Make and test the change

Before submitting a change, run:

```bash
cd client
npm run lint
npm run build:web
```

Fix all errors and test the affected flow in a browser. The deferred authentication files
currently produce several known lint warnings; warnings do not block a build.

### 4. Commit and push

From the repository root:

```bash
git add <files-you-changed>
git commit -m "Brief description of the change"
git push -u origin your-branch-name
```

Add the files you intended to change instead of blindly running `git add .`.

### 5. Open a pull request

On GitHub:

1. Open this repository.
2. Create a pull request from your branch into `main`.
3. Explain the outcome and how you tested it.
4. Add screenshots for visible interface changes.
5. Mark the pull request ready for review; do not leave it as a draft.

### 6. Automatic integration and deployment

For a normal non-draft pull request from a project collaborator, GitHub will:

1. Run lint and build the production web application.
2. Squash-merge the pull request when the checks pass.
3. Deploy the resulting `main` commit automatically.

Allow approximately two to three minutes for the complete process. Verify both deployed
URLs afterward.

If the `web` check fails, open its log, fix the problem on the same branch, commit, and push
again. The checks restart automatically. If GitHub reports that the branch is out of date,
use **Update branch** on the pull request and let the checks run again.

## Protected files

Changes under these paths require repository-owner approval and do not follow the fully
automatic path:

```text
.github/
deploy/
infra/
```

These files control GitHub Actions, production deployment, and infrastructure. Ask before
modifying them. Students do not need—and must not receive—server SSH keys, production
credentials, or root access.

## Project rules

- Never push directly to `main`.
- Never commit passwords, tokens, API keys, `.env` files, or real participant data.
- Never use production data for development or testing.
- Keep each pull request focused on one task.
- Do not combine unrelated fixes in one pull request.
- Report a broken deployment immediately and include the pull-request link.
- Do not represent mocked, browser-local, or incomplete behavior as production-ready.

## Current architecture

- Expo and React Native Web frontend in `client/`
- Expo Router file-based navigation
- Static production export served by Nginx
- Atomic, deployment-only publishing through GitHub Actions
- Unfinished Express/API and authentication experiments retained for future assessment

Additional project context is available in [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md),
deployment details are in [deploy/README.md](deploy/README.md), and backend/database team access
is documented in [PROTOTYPE_SERVER.md](PROTOTYPE_SERVER.md).

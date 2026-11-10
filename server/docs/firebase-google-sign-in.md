# Firebase Google sign-in

The web login and signup buttons use Firebase Google sign-in. The backend verifies
Firebase ID tokens and issues the existing HTTP-only WeGo session cookie. Native
Google sign-in is not implemented. Email/password login and SES remain available.

## Configuration

1. Register a Web app in your development Firebase project.
2. Enable Google under Authentication and choose a support email.
3. Add `localhost` to Authentication > Settings > Authorized domains. Add the
   deployed hostname when configuring the deployed environment.
4. Copy `client/.env.example` to the ignored `client/.env.local`, set the four
   `EXPO_PUBLIC_FIREBASE_*` values, and preserve the API URL. Restart Expo.
5. Set `FIREBASE_PROJECT_ID` in `server/.env.development` for local Docker, or
   `.env.prototype` on the shared server. It must match the frontend project.
6. Store the service-account JSON outside the repository. Mount it read-only into
   the backend and set `GOOGLE_APPLICATION_CREDENTIALS` to its container path.
   A Windows host path alone does not work inside a Linux container.
7. Set persistent `VOPRF_PRIVATE_KEY` and `VOPRF_PUBLIC_KEY` values for the existing
   email-hashing service. Keep the same keys across restarts and deployments;
   replacing them prevents matching existing email hashes. Do not copy local
   development keys over an existing deployment's keys.
8. Include the Expo URL (`http://localhost:8081`) in the backend's comma-separated
   `CLIENT_URL` list and apply the database migrations before testing sign-in.

Hosting, Firestore and Analytics are not required. Firebase web configuration is
public; service-account credentials and email-hashing keys are private. Environment
files, private keys and machine-specific Compose overrides stay out of Git.

## Local Docker

A local `compose.firebase.local.yml` can add this backend override. Replace the
source with your credential file's absolute host path; keep the file ignored.

```yaml
services:
  backend:
    environment:
      GOOGLE_APPLICATION_CREDENTIALS: /run/secrets/firebase-admin.json
    volumes:
      - type: bind
        source: /absolute/host/path/firebase-admin.json
        target: /run/secrets/firebase-admin.json
        read_only: true
        bind:
          create_host_path: false
```

From the repository root (shown on one line for PowerShell or a Unix shell):

```bash
docker compose -p wego-firebase-dev --env-file server/.env.development -f server/compose.yml -f composeDev.yml -f compose.firebase.local.yml up -d --build
```

MySQL's TCP health check waits for initialization before migrations start. The
migration container should finish with exit code 0. Recreate the backend after
changing its environment or credential mount.

## Accounts and sessions

- `POST /api/auth/google` accepts only `{ "idToken": "..." }`. Admin verification
  checks signature, audience/project, expiry, revocation and disabled users. The
  service also requires a verified Google email and authentication within five minutes.
- `firebase_identities` maps the Firebase project and case-sensitive UID to a WeGo
  user. New users get a pseudonymous username, no password and no admin privileges.
  User creation and identity mapping commit in one transaction.
- A matching existing email does not automatically link accounts. Sign in using
  the existing username/password, open **Your profile**, and choose **Connect Google**.
  `POST /api/auth/google/link` requires that WeGo session plus fresh Google proof.
  Existing email accounts must use the matching Google email; username-only accounts
  can connect an unclaimed Google email. Existing passwords are preserved.
- `GET /api/auth/google` returns the current account's connection status and requires
  authentication. The old redirect/callback routes and OpenID client are removed.
- **Your profile > Disconnect Google** requires the current WeGo password.
  `DELETE /api/auth/google` removes only the authenticated user's identity mapping;
  it preserves the profile, password and email hash. The server blocks disconnecting
  Google-only accounts and checks for a concurrent password change.
- Firebase state stays in memory and is cleared after the exchange. The WeGo cookie
  restores the session on refresh. Logout clears the cookie and Firebase state.
- Popup cancellation is silent; popup blocking, configuration and linking failures
  appear in the form. Cross-site and non-JSON token exchanges are rejected.

New email signups use lowercase email hashes. Older mixed-case email hashes cannot
be normalized without the original address; review those accounts before rollout.
Username/password sign-in remains available for existing accounts.

## Removing personal test data

Disconnecting Google does not delete the Firebase Authentication user or the
Google account. It also keeps the WeGo email hash needed by password login.
To remove a personal email from the development Firebase project, open Firebase
Console > Authentication > Users and delete only the intended test user. This does
not delete that person's Google/Gmail account. Signing in with Google again creates
a new Firebase user record.

For a completely fresh local application database, the following commands delete
all local profiles, identity mappings, posts and other MySQL data, then rerun the
migrations. They target only the `wego-firebase-dev` project and its database volume;
uploaded files are preserved. These are optional destructive cleanup commands,
not part of normal startup:

```powershell
cd C:\Users\kevin\Downloads\chatprogram\WeGoCalStateLA
$composeArgs = @('-p', 'wego-firebase-dev', '--env-file', 'server/.env.development',
  '-f', 'server/compose.yml', '-f', 'composeDev.yml', '-f', 'compose.firebase.local.yml')
docker compose @composeArgs down
docker volume rm wego-firebase-dev_backend-db-data
docker compose @composeArgs up -d --build
```

Sign out before the reset, or clear the old localhost session afterward. A local
database reset does not remove Firebase's cloud Authentication users. For a clean
test in both places, remove the selected Firebase test users as well. Keep the
service-account JSON and persistent email-hashing keys; database cleanup does not
require replacing them.

## Verification

From `server/`, run `npx vitest run --config vitest.auth.config.mjs` for the frontend
exchange, token validation and session tests. Database transaction tests require
`MYSQL_AUTH_TESTS=1` and access to the MySQL host configured by `DB_*`. They create
and drop their own isolated schema and never reset the application database.

Run `npm run lint` and `npm run build:web` from `client/`. In a browser, verify:

1. New Google sign-in, returning sign-in, refresh and a protected action.
2. Popup cancellation, a blocked popup and a failed/expired token exchange.
3. Existing-account collision, explicit profile linking and subsequent Google login.
4. Logout followed by a protected request, which must require sign-in again.

## Deployment handoff

The frontend deploys automatically on a push to `main`. Prepare its Firebase build
configuration before merging, and coordinate the backend release with the server
manager. The current workflow publishes static files only; backend deployment and
the credential mount require the manager's setup below.

### Firebase project owner

1. Confirm the Firebase project for the deployed app. Use the same project's web
   configuration and Admin credentials on both sides. A separate live project
   needs its own Google provider configuration; local development settings do not
   transfer automatically.
2. Enable Google Authentication, choose the support email, and authorize
   `wegotocalstatela.org` (plus any other hostname actually serving the app).
3. Give the repository/server maintainer the four public web values listed in
   `client/.env.example`: API key, auth domain, project ID and app ID.
4. Provision a separate deployment service-account JSON and transfer it privately
   to the manager. Firebase Console login access is not necessary for the server
   setup. Keep the JSON out of Git and out of frontend build variables.

### Repository maintainer: frontend build

Store the four public values as GitHub variables in the `production` environment.
Update the existing build step in `.github/workflows/deploy.yml` to reference them:

```yaml
      - run: npm run build:web
        working-directory: client
        env:
          EXPO_PUBLIC_FIREBASE_API_KEY: ${{ vars.EXPO_PUBLIC_FIREBASE_API_KEY }}
          EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ vars.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          EXPO_PUBLIC_FIREBASE_PROJECT_ID: ${{ vars.EXPO_PUBLIC_FIREBASE_PROJECT_ID }}
          EXPO_PUBLIC_FIREBASE_APP_ID: ${{ vars.EXPO_PUBLIC_FIREBASE_APP_ID }}
```

These values are embedded during Expo's build. Defining GitHub variables alone
does not pass them to that step; the environment mapping above is required.
Keep the deployed API URL pointing to the public HTTPS site (the current client
defaults to the website's own origin). Do not deploy the local `localhost:3000` URL.

### Droplet manager: backend

These commands assume the documented prototype checkout at `/srv/wego/app` and
`composePrototype.yml`. Confirm that this is the running stack before applying them.

1. Back up the existing database before applying migrations. Preserve its volumes
   and the existing JWT and VOPRF keys. Provision persistent VOPRF keys if the stack
   has never had working email hashing; do not replace keys for existing users.
   Review older mixed-case email hashes before rollout as described above.
2. Store the deployment JSON outside the checkout, for example at
   `/srv/wego/secrets/firebase-admin.json`. Restrict host permissions while ensuring
   the backend container's `dev` user can read the mounted file.
3. Add these values to the existing `/srv/wego/app/.env.prototype` without replacing
   its database settings or existing application secrets:

   ```env
   FIREBASE_PROJECT_ID=your-deployment-project-id
   GOOGLE_APPLICATION_CREDENTIALS=/run/secrets/firebase-admin.json
   ```

4. Create the ignored `/srv/wego/app/compose.firebase.local.yml` on the droplet:

   ```yaml
   services:
     backend:
       volumes:
         - type: bind
           source: /srv/wego/secrets/firebase-admin.json
           target: /run/secrets/firebase-admin.json
           read_only: true
           bind:
             create_host_path: false
   ```

5. After the merge, update, build, migrate and recreate the backend:

   ```bash
   cd /srv/wego/app
   git pull --ff-only origin main
   docker compose -f composePrototype.yml -f compose.firebase.local.yml build backend
   docker compose -f composePrototype.yml -f compose.firebase.local.yml --profile tools run --rm migrate
   docker compose -f composePrototype.yml -f compose.firebase.local.yml up -d --no-deps --force-recreate backend
   docker compose -f composePrototype.yml -f compose.firebase.local.yml ps
   docker compose -f composePrototype.yml -f compose.firebase.local.yml logs --tail 80 backend
   curl --fail https://wegotocalstatela.org/api/health
   ```

   Stop if the build or migration fails. The new migration is
   `20261110000000_create_firebase_identities.sql`. Existing database contents and
   uploaded files remain in place; the local test database reset is not a
   deployment step. Include the override in subsequent commands that recreate the
   backend, so its credential mount remains attached.

6. Verify the existing Nginx `/api/` proxy and HTTPS settings, then test new and
   returning Google users, existing-account linking, refresh, logout and password
   login on the deployed hostname. Also check cancellation and password-confirmed
   disconnection. If the frontend already built without its Firebase values,
   configure the workflow and rerun the deployment.

## References

- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/admin/setup
- https://firebase.google.com/docs/auth/admin/verify-id-tokens

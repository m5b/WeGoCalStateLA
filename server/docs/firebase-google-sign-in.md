# Firebase Google sign-in

The web client uses Firebase Google sign-in. The backend verifies the Firebase
ID token and creates the application's existing session cookie. Native Google
sign-in is not implemented.

## Firebase project

Register a web app in Firebase, enable the Google authentication provider, and
select a support email. Add the application's hostnames under
**Authentication > Settings > Authorized domains**, including `localhost` for
local development.

Use web configuration and backend credentials from the same Firebase project.

## Frontend configuration

Set the following values from the Firebase web app configuration. For local
development, place them in `client/.env.local` and restart Expo:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

These are public web settings. They must be available when the frontend is built.
The deployed frontend is built by GitHub Actions, so configure the four values as
GitHub variables in the `production` environment and pass them to the existing
build step in `.github/workflows/deploy.yml`:

```yaml
      - run: npm run build:web
        working-directory: client
        env:
          EXPO_PUBLIC_FIREBASE_API_KEY: ${{ vars.EXPO_PUBLIC_FIREBASE_API_KEY }}
          EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ vars.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          EXPO_PUBLIC_FIREBASE_PROJECT_ID: ${{ vars.EXPO_PUBLIC_FIREBASE_PROJECT_ID }}
          EXPO_PUBLIC_FIREBASE_APP_ID: ${{ vars.EXPO_PUBLIC_FIREBASE_APP_ID }}
```

Adding variables alone does not pass them to the build; the workflow mapping is
also required. Workflow changes follow the repository's approval rules.
A client environment file on the server does not configure a GitHub Actions build.
Keep the deployed API URL pointing to the public HTTPS backend; the client
uses the website's own origin when `EXPO_PUBLIC_API_URL` is unset.

## Backend configuration

Set these values in the backend environment (`server/.env.development` locally
or `.env.prototype` for the prototype stack):

```env
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/run/secrets/firebase-admin.json
```

Store the service-account JSON outside the repository and mount it read-only
into the backend. For example, an ignored `compose.firebase.local.yml` can add:

```yaml
services:
  backend:
    volumes:
      - type: bind
        source: /absolute/host/path/firebase-admin.json
        target: /run/secrets/firebase-admin.json
        read_only: true
        bind:
          create_host_path: false
```

Replace the source with the actual host path and ensure the backend container's
runtime user can read the file. Include the override whenever recreating the
backend. Keep credentials and environment files out of Git. Service-account
credentials must never be included in the frontend.

## Deployment and verification

Apply `20261110000000_create_firebase_identities.sql` before running the updated
backend. Preserve database and upload volumes and existing JWT and VOPRF keys;
changing VOPRF keys prevents matching existing email hashes. Older mixed-case
email hashes need a compatibility review before rollout.

Rebuild the frontend after changing its configuration and recreate the backend
after changing its environment or credential mount. The GitHub workflow deploys
the frontend; the backend requires a separate release.

Verify new and returning Google sign-in, session persistence after refresh,
existing-account linking, logout, password login, and popup cancellation.
Existing profiles connect Google from the profile page while signed in.
Disconnecting Google requires the current password and is blocked for accounts
whose only sign-in method is Google.

## References

- [Firebase web Google sign-in](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Admin setup](https://firebase.google.com/docs/admin/setup)
- [Expo environment variables](https://docs.expo.dev/guides/environment-variables/)

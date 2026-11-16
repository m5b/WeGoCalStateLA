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

These are public web settings. The deployment workflow passes the same four
settings from GitHub Actions variables into the frontend build. Configure them
as repository variables or in the `production` environment before deployment.
A client environment file on the server does not configure that GitHub build.
Keep the deployed API URL pointing to the public HTTPS backend; the client
uses the website's own origin when `EXPO_PUBLIC_API_URL` is unset.

## Backend configuration

Set the project ID in the backend environment (`server/.env.development` locally
or `.env.prototype` for the prototype stack), then choose one credential method.

### Environment variables

Copy `project_id`, `client_email`, and `private_key` from the service-account JSON
into these backend variables:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="paste-the-private_key-value-from-the-service-account-json"
```

Keep the private key quoted and preserve its `\n` sequences. Both literal `\n`
sequences and actual line breaks are supported. The backend constructs the
credential in memory; no separate JSON file or Docker credential mount is needed.
Both email and private key must be supplied together.

### JSON file or Application Default Credentials

Leave `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` empty to use Application
Default Credentials. For a service-account JSON file, also set:

```env
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
backend. Environment credentials take precedence when both methods are configured.

Keep private credentials and environment files out of Git. Service-account
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

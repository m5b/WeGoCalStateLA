# Firebase Google sign-in: configuration checkpoint

This first commit adds the SDKs and lazy initialization helpers only. It does not
change the login button, create Firebase users, exchange tokens, link accounts, or
replace SES. Existing authentication still runs without Firebase settings.
The first implementation targets the web app.

## Configure a development project

1. Open Firebase Console and select or create a development project.
2. In Project settings, register a Web app. Hosting, Firestore, and Analytics are
   not required for this sign-in integration.
3. In Authentication, enable Google and select the support email.
4. Add `localhost` to Authentication's authorized domains for local testing. Add
   the deployed app's domain when configuring that environment.
5. Copy the four web configuration values from Project settings into the matching
   entries from `client/.env.example` in the ignored `client/.env.local`. Preserve
   the existing API URL. Restart Expo after changing those values.
6. Set `FIREBASE_PROJECT_ID` in the backend's ignored environment file to the same
   project ID. Local Compose uses `server/.env.development`; the shared prototype
   Compose stack uses `.env.prototype`.
7. For a non-Google-hosted backend, the maintainer can configure Application Default
   Credentials with `GOOGLE_APPLICATION_CREDENTIALS`, pointing to a service-account
   JSON file stored outside the repository. On Google-hosted infrastructure, use
   the environment's supported Application Default Credentials instead.
   For Docker, the file must be available inside the container through a secret or
   read-only mount; a Windows host path alone will not work. Container credential
   provisioning is not included in this checkpoint.

Firebase web configuration is public. Admin credentials are private and must never
be committed, copied into the client, or placed in `EXPO_PUBLIC_*` variables.
No credentials are needed to build this checkpoint. Enabling Google in the console
alone will not make the existing Google button use Firebase yet.

## Next commits

1. Add verified Firebase-ID-token exchange and a database identity mapping, using
   the existing WeGo session cookie. Include explicit linking for existing accounts.
2. Connect the Google button, cancellation/errors, and sign-out on the web client.
3. Verify new/returning/linked users, refresh, protected actions, and sign-out in a
   browser. Treat moving email/password recovery off SES as separate work.

## References

- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/auth/web/google-signin
- https://firebase.google.com/docs/admin/setup
- https://firebase.google.com/docs/auth/admin/verify-id-tokens

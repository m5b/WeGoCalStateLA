# WeGo evaluation deployment

The evaluation site is a static Expo web export served by the host's existing Nginx installation.
It intentionally does not run the unfinished API or authentication stack.

- Web root: `/var/www/wegotocalstatela/current`
- Nginx site: `/etc/nginx/conf.d/wegotocalstatela.org.conf`
- Public overview: `/`
- Evaluation entry: `/community-preview-2026`

Build locally from `client/` with `npm run build:web`. Production releases are sent by the
manual GitHub Actions workflow to the restricted `wego-deploy` account. Its SSH key is forced
to run `deploy/deploy-wego`; it cannot open a shell or select a different destination. The
script extracts into a new release directory and atomically updates `current` only after a
valid build arrives. Nginx configuration and other `/var/www` sites remain outside that
account's permissions.

Repository administrators should store the following GitHub environment secrets:

- `WEGO_DEPLOY_HOST`
- `WEGO_DEPLOY_KEY`
- `WEGO_KNOWN_HOSTS`

Keep the `production` GitHub environment restricted to designated reviewers. Students should
never receive the private deployment key or server credentials.

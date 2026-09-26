# Prototype server

The shared backend/database sandbox runs at `146.190.55.14` under `/srv/wego/app`.
It is disposable infrastructure for development and user-evaluation prototypes. It must not
contain confidential, clinical, immigration, or production participant data.

## Connect

Ask the repository/server owner to install your SSH public key before connecting.

```bash
ssh your-linux-username@146.190.55.14
cd /srv/wego/app
```

Every student has an individual account. Do not share accounts, passwords, or private keys.

## Manage MySQL

```bash
cd /srv/wego/app
docker compose -f composePrototype.yml ps
docker compose -f composePrototype.yml logs -f db
docker compose -f composePrototype.yml restart db
```

Open a MySQL prompt using the application account:

```bash
set -a
. ./.env.prototype
set +a
docker compose -f composePrototype.yml exec db \
  mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"
```

The database is bound only to the server's loopback interface. To use a desktop database
client, keep this tunnel running locally:

```bash
ssh -N -L 3307:127.0.0.1:3306 your-linux-username@146.190.55.14
```

Then connect the client to `127.0.0.1`, port `3307`, using the values in
`/srv/wego/app/.env.prototype`.

## Update the shared checkout

Do not develop directly in `/srv/wego/app`. Make changes locally and use the normal GitHub pull
request workflow. To update the server after a merge:

```bash
cd /srv/wego/app
git pull --ff-only origin main
```

## Migrations

Schema changes belong in `server/db/migrations` and must be committed through GitHub. Run:

```bash
docker compose -f composePrototype.yml --profile tools run --rm migrate
```

Several inherited migrations are currently invalid and must be repaired before the complete
migration set will apply. Do not edit the database manually to conceal a migration failure.

## Reset the prototype database

This permanently removes all prototype database contents and recreates an empty MySQL volume:

```bash
docker compose -f composePrototype.yml down
docker volume rm wego-prototype_prototype-db-data
docker compose -f composePrototype.yml up -d db
```

Coordinate with the backend team before resetting shared data.


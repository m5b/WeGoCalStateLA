#!/usr/bin/env bash
# Manage the DEMO database (fake data for showing the dean) that sits next to
# the real one. Run from the repo root:
#
#   bash server/scripts/demo-db.sh <command>
#
# Commands:
#   backup   save a copy of the REAL database to ~/wego-backups (do this first)
#   setup    create the demo database and apply all migrations to it (safe to re-run)
#   migrate  apply new migrations to the demo database (run after deploys that add migrations)
#   seed     wipe the demo content and load fresh fake data (needs DEMO_PASSWORD;
#            optional DEAN_PASSWORD / ADMIN_PASSWORD give the Dean and Admin accounts their own passwords)
#   verify   log in as Dean (needs VERIFY_PASSWORD) and test the site end to end; with
#            VERIFY_ADMIN_PASSWORD it also tests the Admin account's powers
#   use demo point the backend at the demo database
#   use main point the backend back at the real database
#   status   show which database the backend is using
#
# On the server this uses composePrototype.yml and .env.prototype. For local
# development run it with WEGO_ENV=local (uses composeCore/composeDev and
# server/.env.development).
set -euo pipefail

if [ "${WEGO_ENV:-prototype}" = "local" ]; then
    COMPOSE="docker compose -f composeCore.yml -f composeDev.yml"
    ENV_FILE="server/.env.development"
    RECREATE="up -d --force-recreate --no-deps backend"
    TOOLS_PROFILE=""
else
    COMPOSE="docker compose -f composePrototype.yml"
    ENV_FILE=".env.prototype"
    RECREATE="up -d --force-recreate backend"
    TOOLS_PROFILE="--profile tools"
fi

env_value() { grep -E "^$1=" "$ENV_FILE" | head -n 1 | cut -d= -f2- | tr -d '\r"' || true; }

[ -f "$ENV_FILE" ] || { echo "Can't find $ENV_FILE. Run this from the repo root." >&2; exit 1; }
CURRENT_DB="$(env_value DB_DATABASE)"
[ -n "$CURRENT_DB" ] || { echo "DB_DATABASE isn't set in $ENV_FILE." >&2; exit 1; }
MAIN_DB="${CURRENT_DB%_demo}"   # the real database name, even while demo is active
DEMO_DB="${MAIN_DB}_demo"
DB_USER="$(env_value DB_USERNAME)"

# Run mysql inside the db container as root (hides only the password-on-command-line warning).
mysql_root() {
    $COMPOSE exec -T db sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$@"' sh "$@" 2> >(grep -v 'Using a password' >&2)
}

db_exists() {
    local out
    out="$(echo "SHOW DATABASES LIKE '$1';" | mysql_root -N)"
    [ "$out" = "$1" ]
}

cmd_backup() {
    local dir="${BACKUP_DIR:-$HOME/wego-backups}" file
    mkdir -p "$dir"
    file="$dir/${MAIN_DB}-$(date +%Y%m%d-%H%M%S).sql"
    $COMPOSE exec -T db sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines "$1"' sh "$MAIN_DB" > "$file" 2> >(grep -v 'Using a password' >&2)
    echo "Saved $file ($(wc -c < "$file") bytes). This contains real user data, so keep it private."
}

cmd_migrate() {
    local base_url
    base_url="$(env_value DATABASE_URL)"
    [ -n "$base_url" ] || { echo "DATABASE_URL isn't set in $ENV_FILE." >&2; exit 1; }
    # Same connection as the real database, with the database name swapped for the demo one.
    $COMPOSE $TOOLS_PROFILE run --rm -e DATABASE_URL="${base_url%/*}/${DEMO_DB}" migrate
}

cmd_setup() {
    echo "Creating $DEMO_DB (if needed) and giving $DB_USER access to it..."
    printf '%s\n' \
        "CREATE DATABASE IF NOT EXISTS \`$DEMO_DB\`;" \
        "GRANT ALL PRIVILEGES ON \`$DEMO_DB\`.* TO '$DB_USER'@'%';" \
        "FLUSH PRIVILEGES;" | mysql_root
    cmd_migrate
}

cmd_seed() {
    : "${DEMO_PASSWORD:?Set DEMO_PASSWORD first, e.g.  DEMO_PASSWORD='Demo1234!' bash server/scripts/demo-db.sh seed}"
    db_exists "$DEMO_DB" || { echo "$DEMO_DB doesn't exist yet. Run the setup command first." >&2; exit 1; }
    # The backend container needs to be built with seedDemo.mjs and the demo images in it.
    $COMPOSE exec -T -e DB_DATABASE="$DEMO_DB" -e DEMO_PASSWORD="$DEMO_PASSWORD" -e DEAN_PASSWORD="${DEAN_PASSWORD:-}" -e ADMIN_PASSWORD="${ADMIN_PASSWORD:-}" backend node scripts/seedDemo.mjs
}

cmd_verify() {
    : "${VERIFY_PASSWORD:?Set VERIFY_PASSWORD to the Dean password, e.g.  VERIFY_PASSWORD='...' bash server/scripts/demo-db.sh verify}"
    # Tests the backend as it is right now, so run "use demo" first.
    $COMPOSE exec -T -e VERIFY_USER="${VERIFY_USER:-Dean}" -e VERIFY_PASSWORD="$VERIFY_PASSWORD" -e VERIFY_ADMIN_PASSWORD="${VERIFY_ADMIN_PASSWORD:-}" backend node scripts/verifyDemo.mjs
}

cmd_status() {
    echo "Backend is using database: $($COMPOSE exec -T backend printenv DB_DATABASE)"
    echo "(real: $MAIN_DB, demo: $DEMO_DB)"
}

cmd_use() {
    local target="${1:-}" name
    case "$target" in
        main) name="$MAIN_DB" ;;
        demo) name="$DEMO_DB" ;;
        *) echo "Usage: use demo|main" >&2; exit 1 ;;
    esac
    db_exists "$name" || { echo "$name doesn't exist yet. Run the setup command first." >&2; exit 1; }
    if grep -qE '^DB_DATABASE=' "$ENV_FILE"; then
        sed -i.bak "s|^DB_DATABASE=.*|DB_DATABASE=${name}|" "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
    else
        echo "DB_DATABASE=${name}" >> "$ENV_FILE"
    fi
    echo "Restarting the backend on $name..."
    $COMPOSE $RECREATE
    for _ in $(seq 1 30); do $COMPOSE exec -T backend true >/dev/null 2>&1 && break; sleep 1; done
    CURRENT_DB="$name"
    cmd_status
}

case "${1:-}" in
    backup)  cmd_backup ;;
    setup)   cmd_setup ;;
    migrate) cmd_migrate ;;
    seed)    cmd_seed ;;
    verify)  cmd_verify ;;
    status)  cmd_status ;;
    use)     cmd_use "${2:-}" ;;
    *)       sed -n '2,21p' "$0" | sed 's/^# \{0,1\}//' ;;
esac
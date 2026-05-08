#!/usr/bin/env bash
#
# Pre-deploy preflight gate. Run from project root BEFORE rsync / artisan
# migrate to production. Exits non-zero on any unsafe config so the deploy
# pipeline halts.
#
# Checks:
#   1. APP_ENV must be "production"
#   2. APP_DEBUG must be false
#   3. APP_KEY must be set
#   4. DB_USERNAME must NOT be "root"
#   5. SESSION_SECURE_COOKIE must be true / 1
#   6. ADMIN_SEED_PASSWORD (if seeding) must be ≥16 chars
#   7. composer audit must report no critical/high vulnerabilities
#   8. npm audit (prod-only) must report no critical/high
#
# Usage:
#   ./scripts/preflight-prod-check.sh           # run all checks
#   SKIP_DEPS=1 ./scripts/preflight-prod-check.sh   # skip composer/npm audit

set -euo pipefail

red()    { printf "\033[31m%s\033[0m\n" "$*"; }
green()  { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }

fail=0

if [[ ! -f .env ]]; then
    red "FAIL: .env not found"
    exit 1
fi

# shellcheck source=/dev/null
set -a; . ./.env; set +a

assert_eq() {
    local key="$1"; local expected="$2"; local actual="${!1:-}"
    if [[ "$actual" != "$expected" ]]; then
        red "FAIL: $key='$actual' (expected '$expected')"
        fail=1
    else
        green "OK:   $key=$expected"
    fi
}

assert_neq() {
    local key="$1"; local banned="$2"; local actual="${!1:-}"
    if [[ "$actual" == "$banned" ]]; then
        red "FAIL: $key='$banned' (must differ)"
        fail=1
    else
        green "OK:   $key != $banned"
    fi
}

assert_set() {
    local key="$1"; local actual="${!1:-}"
    if [[ -z "$actual" ]]; then
        red "FAIL: $key is empty"
        fail=1
    else
        green "OK:   $key set"
    fi
}

assert_min_len() {
    local key="$1"; local min="$2"; local actual="${!1:-}"
    if [[ ${#actual} -lt $min ]]; then
        red "FAIL: $key length ${#actual} < $min"
        fail=1
    else
        green "OK:   $key length ${#actual} >= $min"
    fi
}

echo "== Environment hygiene =="
assert_eq APP_ENV production
assert_eq APP_DEBUG false
assert_set APP_KEY
assert_neq DB_USERNAME root
case "${SESSION_SECURE_COOKIE:-}" in
    true|1) green "OK:   SESSION_SECURE_COOKIE=$SESSION_SECURE_COOKIE" ;;
    *)      red "FAIL: SESSION_SECURE_COOKIE='${SESSION_SECURE_COOKIE:-}' must be true"; fail=1 ;;
esac

if [[ -n "${ADMIN_SEED_PASSWORD:-}" ]]; then
    assert_min_len ADMIN_SEED_PASSWORD 16
fi

if [[ "${TRUSTED_PROXIES:-}" == "*" ]]; then
    red "FAIL: TRUSTED_PROXIES='*' is rejected in production"
    fail=1
fi

echo
echo "== Dependency audits =="
if [[ -z "${SKIP_DEPS:-}" ]]; then
    if ! composer audit --no-dev --format=plain 2>&1 | tail -20; then
        yellow "WARN: composer audit reported vulnerabilities"
        fail=1
    else
        green "OK:   composer audit clean"
    fi

    if [[ -f package.json ]]; then
        if ! npm audit --omit=dev --audit-level=high 2>&1 | tail -10; then
            yellow "WARN: npm audit reported high/critical vulnerabilities"
            fail=1
        else
            green "OK:   npm audit clean"
        fi
    fi
else
    yellow "SKIP: dependency audits (SKIP_DEPS set)"
fi

echo
if [[ $fail -ne 0 ]]; then
    red "Preflight FAILED — fix the above before deploying."
    exit 1
fi
green "Preflight PASSED — safe to deploy."

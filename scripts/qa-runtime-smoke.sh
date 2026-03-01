#!/usr/bin/env bash

set -u

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-/tmp/colaberry-smoke}"
mkdir -p "$TMP_DIR"

ROUTES=(
  "/"
  "/solutions"
  "/industries"
  "/use-cases"
  "/resources"
  "/resources/articles"
  "/resources/white-papers"
  "/resources/case-studies"
  "/resources/podcasts"
  "/resources/podcasts/company?slug=openai"
  "/resources/podcasts/tag/agentic-ai"
  "/updates"
  "/search?q=agent"
  "/request-demo"
  "/privacy-policy"
  "/cookie-policy"
  "/unsubscribe?email=test%40example.com"
)

pass_count=0
fail_count=0

echo "Runtime smoke check"
echo "Base URL: $BASE_URL"
echo

for route in "${ROUTES[@]}"; do
  safe_name="$(echo "$route" | sed 's#[^a-zA-Z0-9]#_#g')"
  body_file="$TMP_DIR/${safe_name}.html"

  if status="$(curl -sS -L -o "$body_file" -w "%{http_code}" "${BASE_URL}${route}" 2>/dev/null)"; then
    :
  else
    status="000"
  fi

  title_ok=0
  canonical_ok=0
  internal_error_ok=1

  if grep -qi "<title>" "$body_file" 2>/dev/null; then
    title_ok=1
  fi
  if grep -qi 'rel="canonical"' "$body_file" 2>/dev/null; then
    canonical_ok=1
  fi
  if grep -qi "internal server error\\|cannot find module\\|enoent" "$body_file" 2>/dev/null; then
    internal_error_ok=0
  fi

  if [[ "$status" =~ ^2[0-9][0-9]$ ]] && [[ "$title_ok" -eq 1 ]] && [[ "$canonical_ok" -eq 1 ]] && [[ "$internal_error_ok" -eq 1 ]]; then
    printf "PASS  %-70s  %s\n" "$route" "$status"
    pass_count=$((pass_count + 1))
  else
    printf "FAIL  %-70s  %s  (title:%s canonical:%s runtime:%s)\n" \
      "$route" "$status" "$title_ok" "$canonical_ok" "$internal_error_ok"
    fail_count=$((fail_count + 1))
  fi
done

echo
echo "Summary: ${pass_count} passed, ${fail_count} failed"

if [[ "$fail_count" -gt 0 ]]; then
  echo "Artifacts: $TMP_DIR"
  exit 1
fi

exit 0

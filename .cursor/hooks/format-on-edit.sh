#!/bin/bash
# Hook: afterFileEdit — Auto-format files after the agent edits them
#
# Receives JSON on stdin with file_path and other context.
# Runs the appropriate formatter based on file extension.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('file_path',''))" 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  echo '{"permission":"allow"}'
  exit 0
fi

case "$FILE_PATH" in
  *.java)
    # Format Java files with Maven's formatter if available
    if [ -f "backend/mvnw" ]; then
      cd backend && ./mvnw com.spotify.fmt:fmt-maven-plugin:format -q 2>/dev/null
    fi
    ;;
  *.ts|*.tsx|*.js|*.jsx|*.css)
    # Format frontend files with Prettier if available
    if command -v npx &>/dev/null && [ -f "frontend/node_modules/.bin/prettier" ]; then
      npx --prefix frontend prettier --write "$FILE_PATH" 2>/dev/null
    fi
    ;;
esac

echo '{"permission":"allow"}'
exit 0

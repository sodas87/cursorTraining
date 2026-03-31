#!/bin/bash
# Hook: beforeShellExecution — Block dangerous commands
#
# Receives JSON on stdin with the command to be executed.
# Returns permission: "deny" to block, "allow" to proceed, "ask" to prompt the user.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

# Block destructive commands
if echo "$COMMAND" | grep -qE 'rm -rf /|DROP TABLE|DROP DATABASE|git push --force.*main|git reset --hard'; then
  echo "{\"permission\":\"deny\",\"user_message\":\"Blocked dangerous command: $COMMAND\"}"
  exit 2
fi

# Warn on other risky patterns (prompt the user)
if echo "$COMMAND" | grep -qE 'rm -rf|git push --force|git reset --hard|truncate'; then
  echo "{\"permission\":\"ask\",\"user_message\":\"Potentially risky command detected: $COMMAND\"}"
  exit 0
fi

echo '{"permission":"allow"}'
exit 0

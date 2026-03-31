# Agent Hooks — Hands-on Exercises

## Introduction

Hooks are scripts that run **before or after** defined stages of the agent loop. They let you observe, block, or modify agent behavior — making them a key governance and guardrails mechanism.

### Use Cases

| Use Case | Hook Event | Example |
|----------|-----------|---------|
| Auto-format after edits | `afterFileEdit` | Run Prettier on saved files |
| Block dangerous commands | `beforeShellExecution` | Prevent `rm -rf /` or `DROP TABLE` |
| Redact secrets | `beforeReadFile` | Strip API keys before sending to LLM |
| Audit logging | `sessionStart` / `stop` | Log all agent sessions for compliance |
| Gate MCP tools | `beforeMCPExecution` | Require approval for external service calls |
| Auto-test after changes | `afterFileEdit` | Run relevant tests after code changes |

### How Hooks Work

1. Agent reaches a lifecycle event (e.g., about to run a shell command)
2. Cursor runs your hook script, passing **JSON on stdin** with context
3. Your script returns **JSON on stdout** with a decision:
   - `{"permission": "allow"}` — Proceed
   - `{"permission": "deny", "user_message": "..."}` — Block (exit code 2)
   - `{"permission": "ask", "user_message": "..."}` — Prompt the user

---

## Exercise 1: Explore the Existing Hooks

### Objective
Understand how hooks are configured and structured.

### Instructions

1. **Open** `.cursor/hooks.json` and examine the configuration:

   ```json
   {
     "version": 1,
     "hooks": {
       "afterFileEdit": [...],
       "beforeShellExecution": [...]
     }
   }
   ```

2. **Open** `.cursor/hooks/format-on-edit.sh` — This hook auto-formats files after the agent edits them:
   - Detects file type from the `file_path` in the JSON input
   - Runs the appropriate formatter (Maven fmt for Java, Prettier for TS/CSS)

3. **Open** `.cursor/hooks/block-dangerous.sh` — This hook gates dangerous commands:
   - Returns `"deny"` for critically dangerous commands (`rm -rf /`, `DROP DATABASE`)
   - Returns `"ask"` for risky-but-sometimes-needed commands (`git push --force`)
   - Returns `"allow"` for everything else

4. **Notice the pattern**: Each hook script:
   - Reads JSON from stdin
   - Extracts the relevant field (file_path, command, etc.)
   - Makes a decision
   - Returns JSON on stdout

---

## Exercise 2: Agent Lifecycle Events

### Objective
Learn all the hook events available and when they fire.

### Lifecycle Events Reference

| Event | When It Fires | Common Use |
|-------|--------------|------------|
| `sessionStart` | Agent session begins | Set up logging, inject context |
| `sessionEnd` | Agent session ends | Cleanup, send telemetry |
| `beforeSubmitPrompt` | Before prompt goes to the model | Modify/validate prompts |
| `beforeShellExecution` | Before running a shell command | Block dangerous commands |
| `afterShellExecution` | After a shell command completes | Log command results |
| `beforeReadFile` | Before reading a file | Redact secrets, filter content |
| `afterFileEdit` | After editing a file | Auto-format, run linters |
| `beforeMCPExecution` | Before calling an MCP tool | Gate external service access |
| `afterMCPExecution` | After an MCP tool returns | Log MCP interactions |
| `subagentStart` | Before launching a subagent | Control subagent permissions |
| `subagentStop` | After a subagent completes | Collect subagent results |
| `preToolUse` | Before any tool call | Generic tool gating |
| `postToolUse` | After any tool call | Generic tool logging |
| `stop` | Agent completes its task | Final validation, cleanup |

### Hook Input
All hooks receive base fields on stdin:
```json
{
  "conversation_id": "...",
  "model": "...",
  "hook_event_name": "beforeShellExecution",
  "workspace_roots": ["/path/to/project"],
  "user_email": "...",
  "command": "npm test"
}
```

The specific fields vary by event (e.g., `beforeShellExecution` includes `command`, `beforeReadFile` includes `file_path`).

---

## Exercise 3: Create an Audit Logging Hook

### Objective
Build a hook that logs all agent shell commands for compliance auditing.

### Task

1. **Create** `.cursor/hooks/audit-log.sh`:

   ```bash
   #!/bin/bash
   # Hook: afterShellExecution — Log all shell commands for audit trail

   INPUT=$(cat)
   TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
   COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)
   EXIT_CODE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('exit_code',''))" 2>/dev/null)

   # Append to audit log
   echo "[$TIMESTAMP] command=\"$COMMAND\" exit_code=$EXIT_CODE" >> .cursor/hooks/audit.log

   echo '{"permission":"allow"}'
   exit 0
   ```

2. **Make it executable:**
   ```bash
   chmod +x .cursor/hooks/audit-log.sh
   ```

3. **Register it** in `.cursor/hooks.json` — add to the `hooks` object:

   ```json
   "afterShellExecution": [
     {
       "command": ".cursor/hooks/audit-log.sh",
       "type": "command",
       "timeout": 5,
       "failClosed": false
     }
   ]
   ```

4. **Test it** — Ask the agent to run a command (e.g., "list the files in the backend directory"), then check `.cursor/hooks/audit.log`

---

## Exercise 4: Create a Secrets Redaction Hook

### Objective
Build a hook that prevents secrets from being sent to the LLM.

### Task

1. **Create** `.cursor/hooks/redact-secrets.sh`:

   ```bash
   #!/bin/bash
   # Hook: beforeReadFile — Redact secrets from file contents before sending to LLM

   INPUT=$(cat)
   FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('file_path',''))" 2>/dev/null)

   # Block reading of sensitive files entirely
   case "$FILE_PATH" in
     *.env|*.env.*|*credentials*|*secret*|*.pem|*.key)
       echo "{\"permission\":\"deny\",\"user_message\":\"Blocked: $FILE_PATH contains secrets\"}"
       exit 2
       ;;
   esac

   echo '{"permission":"allow"}'
   exit 0
   ```

2. **Make it executable** and **register it** under `beforeReadFile` in `hooks.json`

3. **Test it** — Create a dummy `.env` file and ask the agent to read it. The hook should block the read.

---

## Exercise 5: Configuration Deep Dive

### Objective
Understand hook configuration options.

### Per-Script Options

```json
{
  "command": ".cursor/hooks/my-hook.sh",
  "type": "command",
  "timeout": 10,
  "failClosed": false,
  "matcher": "rm -rf|DROP TABLE",
  "loop_limit": 5
}
```

| Option | Default | Purpose |
|--------|---------|---------|
| `command` | (required) | Script path or shell command |
| `type` | `"command"` | `"command"` (script) or `"prompt"` (LLM-evaluated) |
| `timeout` | — | Max execution time in seconds |
| `failClosed` | `false` | `true` = block on hook failure; `false` = allow on failure |
| `matcher` | — | Regex filter (e.g., only trigger on matching commands) |
| `loop_limit` | 5 | Max times hook can fire per agent loop iteration |

### Prompt-Based Hooks

Instead of scripts, you can use natural language conditions evaluated by the LLM:

```json
{
  "type": "prompt",
  "command": "Only allow this command if it does not modify production data or delete files. The command is: $ARGUMENTS"
}
```

### Hook Priority

When hooks are defined at multiple levels, they execute in this order:
1. **Enterprise** — System-wide (MDM/IT managed)
2. **Team** — Cloud-distributed via Cursor dashboard
3. **Project** — `.cursor/hooks.json` (version-controlled)
4. **User** — `~/.cursor/hooks.json` (personal)

### Task

Review the `failClosed` setting:
- In the `format-on-edit.sh` hook, `failClosed: false` means if the formatter crashes, the agent continues.
- In the `block-dangerous.sh` hook, what would happen if you set `failClosed: true`? (Answer: if the hook script itself errors out, the command would be blocked — safer but potentially disruptive.)

---

## Exercise 6: Design a Hook Strategy

### Objective
Think about which hooks your team should implement for governance.

### Discussion

Consider these scenarios and decide which hooks to implement:

1. **Compliance team** wants an audit trail of all AI-generated code changes
   - Which events? What should be logged?

2. **Security team** wants to prevent the agent from:
   - Running `curl` to arbitrary URLs
   - Reading `.env` files
   - Writing to production config files

3. **Platform team** wants to ensure:
   - All code is formatted before being committed
   - Tests pass after every code change
   - No direct database queries (must use JPA)

### Task

Pick ONE scenario and implement it as a hook. Create the script and register it in `hooks.json`.

---

## Key Takeaways

1. **Hooks are governance primitives** — They give teams control over what the agent can do
2. **fail-open vs fail-closed** — Choose based on risk: `failClosed: true` for security hooks, `false` for convenience hooks
3. **Start simple** — Begin with `afterFileEdit` (formatting) and `beforeShellExecution` (safety) before adding more
4. **Version control hooks** — `.cursor/hooks.json` and scripts in `.cursor/hooks/` should be committed
5. **Layer your defenses** — Use hooks alongside rules, subagent `readonly` flags, and code review
6. **Partner ecosystem** — Pre-built hooks exist from Semgrep, Snyk, 1Password, and others for security scanning and secrets management

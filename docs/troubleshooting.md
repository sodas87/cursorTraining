# Troubleshooting Guide

## Backend Issues

### "Port 8080 already in use"
```bash
# Find what's using the port
lsof -i :8080
# Kill the process
kill -9 <PID>
```

### "JAVA_HOME not set"
```bash
# macOS
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Linux
export JAVA_HOME=/usr/lib/jvm/java-17

# Add to ~/.zshrc or ~/.bashrc for persistence
```

### "mvnw: Permission denied"
```bash
chmod +x backend/mvnw
```

### "H2 Console not working"
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:shopcursor`
- Username: `sa`
- Password: (empty)

---

## Frontend Issues

### "Module not found" errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "Vite proxy not connecting to backend"
- Make sure backend is running on port 8080 first
- Check `vite.config.ts` proxy settings
- Try accessing http://localhost:8080/api/products directly

### "CORS errors in browser console"
- The backend has CORS configured for localhost:5173
- Make sure you're accessing the frontend via http://localhost:5173 (not 127.0.0.1)

---

## Playwright Issues

### "Browser not found"
```bash
cd e2e
npx playwright install chromium
```

### "Tests timing out"
- Make sure both backend AND frontend are running
- Increase timeout in `playwright.config.ts` if needed
- Check that `webServer` config has correct commands

### "Tests pass locally but fail in CI"
- Use `retries: 2` in CI config
- Add `await page.waitForLoadState('networkidle')` for flaky tests
- Check that CI has the correct Node.js and Java versions

---

## Cursor IDE Issues

### "AI suggestions not appearing"
- Check your Cursor subscription status
- Try `Cmd+Shift+P` → "Reload Window"
- Check if `.cursorrules` has syntax errors

### "MCP server not connecting"
1. Open Cursor's output panel (`Cmd+Shift+U`)
2. Select "MCP" from the dropdown
3. Look for error messages
4. Common fixes:
   - Ensure `npx` is in your PATH
   - Check that the MCP package exists
   - Verify environment variables in `.cursor/mcp.json`

### "Composer not generating multi-file changes"
- Make sure you've selected all relevant files with @ references
- Try being more explicit about which files to create/modify
- Break large changes into smaller Composer sessions

---

## General Tips

- **Reset the database**: Just restart the backend (H2 is in-memory)
- **Reset the cart**: Clear localStorage in browser DevTools
- **Start fresh**: `git checkout .` to reset all files
- **Need help?**: Ask the instructor or check the `labs/*/solution/` directories

# AI Governance and Best Practices

## Overview

As AI-assisted development becomes more prevalent, it's crucial to establish governance practices that ensure code quality, security, and maintainability. This session covers:

- Code review practices for AI-generated code
- Security auditing
- Identifying anti-patterns
- Establishing team standards
- **Cursor security settings and data leakage prevention**

## Why AI Governance Matters

AI tools like Cursor are powerful, but they can:
- Generate vulnerable code
- Introduce anti-patterns
- Create technical debt
- Bypass security best practices
- Make assumptions about requirements
- **Send proprietary code and secrets to external LLM providers**

**Your role as a developer**: Be the critical reviewer and decision-maker.

## Exercise 1: Code Review - Review AI-Generated PR

You've been assigned to review a PR where a teammate used Cursor to add a new feature. Review the code below and identify issues.

### PR Description
```
Feature: Add user profile update endpoint

Used Cursor to generate a REST endpoint for updating user profiles.
Implemented validation and database update.
```

### Code to Review

**File**: `src/main/java/com/shopcursor/controller/UserController.java`

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/{userId}/profile")
    public ResponseEntity<String> updateProfile(
            @PathVariable String userId,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address) {

        // Update user profile
        String sql = "UPDATE users SET email = '" + email +
                     "', phone = '" + phone +
                     "', address = '" + address +
                     "' WHERE id = " + userId;

        jdbcTemplate.execute(sql);

        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping("/{userId}/orders")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String userId) {
        String sql = "SELECT * FROM orders WHERE user_id = " + userId;
        List<Order> orders = jdbcTemplate.query(sql, new OrderRowMapper());
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        // No authentication check - endpoint is public
        String sql = "DELETE FROM users WHERE id = " + userId;
        jdbcTemplate.execute(sql);
        return ResponseEntity.ok("User deleted");
    }
}
```

### Your Task

Identify all issues in this code. Consider:
1. **Security vulnerabilities**
2. **Error handling**
3. **Input validation**
4. **API design**
5. **Authentication/Authorization**
6. **Database practices**

### Identified Issues

<details>
<summary>Click to reveal issues</summary>

#### Critical Issues (Security)

1. **SQL Injection Vulnerability** ⚠️ CRITICAL
   - Lines 13-16: Direct string concatenation in SQL
   - Lines 24, 32: User input directly in SQL queries
   - **Impact**: Attacker can execute arbitrary SQL
   - **Fix**: Use PreparedStatement or named parameters

2. **Missing Authentication** ⚠️ CRITICAL
   - No `@PreAuthorize` or auth checks
   - Any user can update/delete any profile
   - **Fix**: Add authentication and verify user owns resource

3. **Missing Authorization** ⚠️ HIGH
   - Delete endpoint has no admin check
   - **Fix**: Add role-based access control

#### High Priority Issues

4. **No Input Validation**
   - Email format not validated
   - Phone format not checked
   - No length limits
   - **Fix**: Use `@Valid` with validation annotations

5. **No Error Handling**
   - Database errors exposed to client
   - No try-catch blocks
   - **Fix**: Add global exception handler

6. **No Response Validation**
   - What if user doesn't exist?
   - What if update affects 0 rows?
   - **Fix**: Check affected rows, return 404 if not found

#### Medium Priority Issues

7. **Poor API Design**
   - POST used for updates (should be PUT or PATCH)
   - `@RequestParam` for structured data (should be `@RequestBody`)

8. **Direct JDBC Usage**
   - Should use JPA/Hibernate for type safety
   - No transaction management

9. **Missing Logging**
   - No audit trail for profile updates/deletes

10. **No Rate Limiting**
    - Endpoints vulnerable to abuse

</details>

### Corrected Version

**File**: `src/main/java/com/shopcursor/controller/UserController.java`

```java
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}/profile")
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.id")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {

        log.info("Updating profile for user: {}", userId);

        UserProfileResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/orders")
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.id")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable Long userId) {
        log.info("Fetching orders for user: {}", userId);

        List<OrderResponse> orders = userService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        log.warn("Admin deleting user: {}", userId);

        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}

@Data
@Valid
class UpdateProfileRequest {
    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;

    @NotBlank
    @Size(max = 255)
    private String address;
}
```

### Review Checklist for AI-Generated Code

When reviewing AI-generated code, always check:

- [ ] **SQL Injection**: No string concatenation in queries
- [ ] **Authentication**: Protected endpoints have auth checks
- [ ] **Authorization**: Users can only access their resources
- [ ] **Input Validation**: All inputs validated
- [ ] **Error Handling**: Proper exception handling
- [ ] **Logging**: Important operations logged
- [ ] **Type Safety**: Proper types (Long vs String for IDs)
- [ ] **API Design**: RESTful conventions followed
- [ ] **Testing**: Unit tests included
- [ ] **Documentation**: API documented

## Exercise 2: Security Audit

Audit this AI-generated authentication service for security issues.

### Code to Audit

**File**: `src/main/java/com/shopcursor/service/AuthService.java`

```java
@Service
public class AuthService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String SECRET_KEY = "mySecretKey123";

    public String login(String username, String password) {
        // Query user from database
        String sql = "SELECT * FROM users WHERE username = '" + username +
                     "' AND password = '" + password + "'";

        List<User> users = jdbcTemplate.query(sql, new UserRowMapper());

        if (users.isEmpty()) {
            return null;
        }

        User user = users.get(0);

        // Generate JWT token
        String token = Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getRole())
            .setIssuedAt(new Date())
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();

        return token;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void register(String username, String email, String password) {
        String sql = "INSERT INTO users (username, email, password) VALUES ('" +
                     username + "', '" + email + "', '" + password + "')";
        jdbcTemplate.execute(sql);
    }
}
```

### Your Task

Find all security vulnerabilities. Consider:
1. Authentication security
2. Password handling
3. Token security
4. SQL injection
5. Cryptography

### Identified Vulnerabilities

<details>
<summary>Click to reveal vulnerabilities</summary>

#### Critical Vulnerabilities

1. **SQL Injection** ⚠️ CRITICAL
   - Lines 11-12, 40-41: Direct string concatenation
   - Attacker can bypass authentication: `' OR '1'='1`

2. **Plaintext Password Storage** ⚠️ CRITICAL
   - Passwords stored in database without hashing
   - Passwords compared in plaintext
   - **Fix**: Use BCrypt or Argon2

3. **Hardcoded Secret Key** ⚠️ CRITICAL
   - Line 7: Secret in source code
   - Weak key: "mySecretKey123"
   - **Fix**: Use environment variable, generate strong key

4. **Weak JWT Implementation**
   - No expiration time
   - HS256 with weak key
   - **Fix**: Add expiration, use RS256, strong key

5. **No Password Requirements**
   - No minimum length
   - No complexity requirements
   - **Fix**: Validate password strength

6. **No Rate Limiting**
   - Vulnerable to brute force attacks
   - **Fix**: Add login attempt throttling

7. **Information Disclosure**
   - Same response for invalid username/password
   - Actually good! But could add timing attacks

8. **No Account Lockout**
   - Failed login attempts not tracked
   - **Fix**: Lock account after N failed attempts

</details>

### Secure Implementation

```java
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by username (using parameterized query via JPA)
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Verify password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // Check if account is locked
        if (user.isLocked()) {
            throw new AccountLockedException("Account is locked");
        }

        // Generate secure JWT token with expiration
        String token = tokenService.generateToken(user);

        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public void register(RegisterRequest request) {
        // Validate password strength
        validatePasswordStrength(request.getPassword());

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already taken");
        }

        // Hash password with BCrypt
        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordHash);
        user.setRole("USER");

        userRepository.save(user);
    }

    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new WeakPasswordException("Password must be at least 8 characters");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new WeakPasswordException("Password must contain uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new WeakPasswordException("Password must contain lowercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new WeakPasswordException("Password must contain a number");
        }
    }
}
```

## Exercise 3: Anti-Patterns

Identify common anti-patterns in AI-generated code.

### Anti-Pattern 1: Over-Engineered Solution

```java
// AI generated this for "add logging to the service"
@Service
public class ProductService {

    @Autowired
    private LoggingService loggingService;

    @Autowired
    private LoggingContextBuilder contextBuilder;

    @Autowired
    private LoggingFormatter formatter;

    public Product getProduct(Long id) {
        LogContext context = contextBuilder
            .withTimestamp(System.currentTimeMillis())
            .withMethod("getProduct")
            .withParams(Map.of("id", id))
            .withSeverity(LogSeverity.INFO)
            .build();

        loggingService.log(formatter.format(context));

        Product product = productRepository.findById(id).orElse(null);

        LogContext resultContext = contextBuilder
            .from(context)
            .withResult(product)
            .build();

        loggingService.log(formatter.format(resultContext));

        return product;
    }
}
```

**Issues:**
- Over-complicated for simple logging
- Custom logging framework instead of standard (SLF4J/Logback)
- Lots of boilerplate
- Harder to maintain

**Simple Solution:**
```java
@Service
@Slf4j
public class ProductService {

    public Product getProduct(Long id) {
        log.info("Fetching product with id: {}", id);

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        log.debug("Found product: {}", product);
        return product;
    }
}
```

### Anti-Pattern 2: God Class

```java
// AI generated this when asked to "create a service for orders"
@Service
public class OrderService {

    // User management
    public User createUser() { }
    public User updateUser() { }
    public void deleteUser() { }

    // Product management
    public Product createProduct() { }
    public Product updateProduct() { }
    public void deleteProduct() { }

    // Order management
    public Order createOrder() { }
    public Order updateOrder() { }
    public void deleteOrder() { }

    // Payment processing
    public Payment processPayment() { }
    public void refundPayment() { }

    // Email notifications
    public void sendOrderConfirmation() { }
    public void sendShippingNotification() { }

    // Inventory management
    public void updateInventory() { }
    public void checkStock() { }

    // Analytics
    public Report generateReport() { }
    public List<Metric> getMetrics() { }
}
```

**Issues:**
- Single class doing everything
- Violates Single Responsibility Principle
- Hard to test and maintain
- Poor separation of concerns

**Fix**: Separate into focused services
- `UserService`
- `ProductService`
- `OrderService`
- `PaymentService`
- `NotificationService`
- `InventoryService`
- `AnalyticsService`

### Anti-Pattern 3: Copy-Paste Code

```java
// AI generated similar code for each entity
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error fetching user", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

public class ProductController {
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        try {
            Product product = productRepository.findById(id).orElse(null);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            log.error("Error fetching product", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

// ... same pattern repeated 10 more times
```

**Fix**: Create reusable abstraction

```java
@RestController
public abstract class BaseController<T, ID> {

    protected abstract JpaRepository<T, ID> getRepository();

    @GetMapping("/{id}")
    public ResponseEntity<T> getById(@PathVariable ID id) {
        return getRepository()
            .findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController<User, Long> {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected JpaRepository<User, Long> getRepository() {
        return userRepository;
    }
}
```

### Common AI Anti-Patterns Checklist

- [ ] Over-engineered solutions (KISS principle violated)
- [ ] God classes (too many responsibilities)
- [ ] Copy-paste code (DRY principle violated)
- [ ] Premature optimization
- [ ] Missing abstractions
- [ ] Inappropriate use of design patterns
- [ ] Over-use of inheritance
- [ ] Missing error boundaries
- [ ] Inconsistent naming conventions
- [ ] Magic numbers and hardcoded values

## Exercise 4: Project Rules & .cursorrules Best Practices

Cursor 2.0 introduced **Project Rules** (`.cursor/rules/*.mdc`) as the recommended replacement for the legacy `.cursorrules` file. This exercise covers both.

### Project Rules vs .cursorrules

| Feature | `.cursorrules` (Legacy) | `.cursor/rules/*.mdc` (New) |
|---------|------------------------|----------------------------|
| Location | Project root | `.cursor/rules/` directory |
| Scope | Entire project | Per-file via glob patterns |
| Auto-attach | Always applied | Only when matching files are referenced |
| Format | Plain Markdown | MDC (Markdown Component) with frontmatter |
| Granularity | One file for everything | Separate files per concern |

### MDC File Format

```markdown
---
description: When this rule applies (shown to Agent)
globs: ["backend/**/*.java"]    # Auto-attach to matching files
---

# Rule content here
Your coding standards and instructions...
```

### Task: Create Project Rules

Explore the existing rules in `.cursor/rules/`:
- `java-backend.mdc` — Java/Spring Boot standards (auto-attached to .java files)
- `react-frontend.mdc` — React/TypeScript standards (auto-attached to .tsx/.ts files)
- `workshop.mdc` — Workshop context (applied to all files)

### Exercise: Create a Security Rule

Create `.cursor/rules/security.mdc`:

```markdown
---
description: Security standards for all code
globs: ["**/*.java", "**/*.tsx", "**/*.ts"]
---

# Security Rules

- NEVER use string concatenation in SQL queries
- ALWAYS use parameterized queries or JPA
- ALWAYS hash passwords with BCrypt
- NEVER hardcode secrets or API keys
- ALWAYS validate and sanitize user input
- Use @PreAuthorize for endpoint security
```

### Legacy .cursorrules

The legacy `.cursorrules` file still works but is a single file for everything. Here's an example:

Create `.cursorrules` in your project root:

```markdown
# ShopCursor Project Rules

## Code Style

- Use Java 17 features
- Follow Google Java Style Guide
- Maximum line length: 120 characters
- Use Lombok annotations (@Data, @Builder, @Slf4j)

## Security

- NEVER use string concatenation in SQL queries
- ALWAYS use parameterized queries or JPA
- ALWAYS hash passwords with BCrypt
- NEVER hardcode secrets or API keys
- ALWAYS validate and sanitize user input
- Use @PreAuthorize for endpoint security

## API Design

- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate status codes
- Use @RequestBody for complex data
- Use @PathVariable for resource IDs
- Always validate with @Valid
- Return DTOs, not entities

## Error Handling

- Use @RestControllerAdvice for global exception handling
- Create custom exceptions for business logic
- Never expose stack traces to clients
- Log errors with context

## Testing

- Write unit tests for services
- Use Mockito for mocking
- Integration tests for controllers
- Achieve minimum 80% code coverage

## Database

- Use JPA/Hibernate, not raw JDBC
- Enable SQL logging in development
- Use @Transactional appropriately
- Define proper relationships (@OneToMany, @ManyToOne)

## Dependencies

- Never add dependencies without approval
- Use Spring Boot starters when possible
- Keep dependencies up to date

## Example Code

When generating REST controllers, follow this pattern:

```java
@RestController
@RequestMapping("/api/resource")
@Slf4j
public class ResourceController {

    private final ResourceService service;

    @Autowired
    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResourceResponse> getById(@PathVariable Long id) {
        log.info("Fetching resource: {}", id);
        ResourceResponse response = service.findById(id);
        return ResponseEntity.ok(response);
    }
}
```

## Prohibited Patterns

- ❌ SQL injection vulnerable code
- ❌ Plaintext password storage
- ❌ Hardcoded credentials
- ❌ Missing input validation
- ❌ Exposing entities in REST APIs
- ❌ God classes
- ❌ Missing error handling
```

### Testing Your .cursorrules

Ask Cursor to generate code and verify it follows your rules:

```
Generate a REST controller for managing products with CRUD operations.
```

Check that the generated code:
- Uses proper annotations
- Includes security
- Has error handling
- Follows the patterns you defined

### Advanced .cursorrules Patterns

**Project-specific conventions:**
```markdown
## Naming Conventions

- Controllers: `{Entity}Controller`
- Services: `{Entity}Service`
- Repositories: `{Entity}Repository`
- DTOs: `{Entity}Request`, `{Entity}Response`
- Exceptions: `{Entity}NotFoundException`

## Package Structure

```
com.shopcursor
├── controller
├── service
├── repository
├── model
├── dto
├── exception
└── config
```
```

**Technology-specific rules:**
```markdown
## React/TypeScript Frontend

- Use functional components with hooks
- Use TypeScript strict mode
- Prop types required for all components
- Use React Query for API calls
- Use Zod for validation
- Follow Airbnb style guide
```

## Exercise 5: Cursor Security Settings & Data Leakage Risks

AI coding assistants introduce a new class of security concerns — your **source code, prompts, and context** are sent to external LLM providers. This exercise covers Cursor's built-in security controls and best practices for preventing data leakage.

### Why This Matters

When you use Cursor, the following data may leave your machine:

| Data Type | When It's Sent | Where It Goes |
|-----------|---------------|---------------|
| Code in open files | Every prompt, autocomplete, Cmd+K | LLM provider (OpenAI, Anthropic, or Cursor's API) |
| Codebase index | When indexing is enabled | Cursor's servers (for embeddings) |
| Terminal output | Agent mode shell commands | LLM provider |
| File contents | `@file` references, agent reads | LLM provider |
| Error messages | Debugging prompts | LLM provider |
| Chat history | Ongoing conversation | LLM provider |

**Risk**: Proprietary code, secrets, API keys, PII, and internal business logic can leak to third-party servers.

---

### Part A: Cursor Privacy Settings

Open **Cursor > Settings > Privacy** (or `Cmd+,` → search "privacy") and review these settings:

#### 1. Privacy Mode

| Setting | Behavior |
|---------|----------|
| **Privacy Mode: OFF** (default) | Code snippets may be stored by LLM providers for improvement |
| **Privacy Mode: ON** | Code is sent for inference only — **not stored, not used for training** |

> **Best practice**: Always enable Privacy Mode for proprietary/client code. Cursor states that with Privacy Mode on, no code is retained by any third party.

**To enable:**
- Settings → Privacy → Toggle **"Privacy Mode"** ON
- Or in `settings.json`: `"cursor.privacy.mode": true`

#### 2. Codebase Indexing

Codebase indexing sends file contents to Cursor's servers to build a semantic search index used by `@codebase` queries.

| Setting | What Happens |
|---------|-------------|
| **Indexing ON** | Files are chunked, embedded, and stored on Cursor's servers |
| **Indexing OFF** | No codebase data leaves your machine (but `@codebase` won't work) |

**To control:**
- Settings → Features → **"Codebase Indexing"**
- For sensitive projects, disable indexing entirely

#### 3. Telemetry

| Setting | What's Collected |
|---------|-----------------|
| **Telemetry ON** | Usage analytics, crash reports, feature usage |
| **Telemetry OFF** | Nothing sent |

**To disable:**
- Settings → Privacy → Toggle telemetry OFF
- Or `"telemetry.telemetryLevel": "off"` in `settings.json`

---

### Part B: `.cursorignore` — Preventing Sensitive Files from Reaching the LLM

The `.cursorignore` file (placed at project root) tells Cursor to **never read, index, or send** matching files to any LLM. This is your most important defense against data leakage.

**Create `.cursorignore` in your project root:**

```gitignore
# Secrets and credentials
.env
.env.*
*.pem
*.key
*.p12
*.jks
credentials.json
service-account.json
**/secrets/

# Infrastructure
terraform.tfstate
terraform.tfstate.backup
*.tfvars
docker-compose.override.yml

# CI/CD secrets
.github/secrets/
.gitlab-ci-secrets/

# Database
*.sql.bak
**/migrations/seed-data/

# Client/proprietary data
**/data/customers/
**/data/exports/
**/fixtures/real-data/

# Internal documentation
docs/internal/
docs/architecture/threat-model*
SECURITY.md

# IDE and local config
.cursor/mcp.json       # may contain API tokens
.idea/
```

#### Your Task

1. Create a `.cursorignore` file for the ShopCursor project
2. Include at minimum: `.env`, `*.pem`, `*.key`, `credentials.json`, and any files containing real customer data
3. Test it: open a file that matches your ignore patterns and try referencing it with `@file` — Cursor should refuse

---

### Part C: `.cursorindexingignore` — Controlling What Gets Indexed

Separate from `.cursorignore`, the `.cursorindexingignore` file prevents files from being **indexed** (sent to Cursor's embedding servers) while still allowing them to be read locally in chat.

```gitignore
# Don't index large generated files
**/dist/
**/build/
**/node_modules/
**/*.min.js
**/*.bundle.js

# Don't index binary/media
**/*.png
**/*.jpg
**/*.mp4
**/*.woff2

# Don't index test fixtures
**/test/fixtures/large-*.json
```

> **Key difference**: `.cursorignore` = LLM never sees it. `.cursorindexingignore` = not indexed for `@codebase` search but can still be opened/referenced manually.

---

### Part D: MCP Server Security Risks

MCP (Model Context Protocol) servers extend Cursor's capabilities, but they also expand the attack surface:

#### Risks

| Risk | Example |
|------|---------|
| **Token leakage** | API tokens in `.cursor/mcp.json` sent to LLM in error messages |
| **Over-permissioned tools** | Filesystem MCP with access to `~/.ssh/` or `~/.aws/` |
| **Tool injection** | Malicious MCP server returning crafted output to manipulate the agent |
| **Unreviewed actions** | Agent calling MCP tools that modify production systems |

#### Best Practices

1. **Scope filesystem MCP servers narrowly:**
   ```json
   {
     "filesystem": {
       "command": "npx",
       "args": ["-y", "@modelcontextprotocol/server-filesystem",
                "./backend/src", "./frontend/src"]
     }
   }
   ```
   Never give access to `~/`, `/`, or directories containing secrets.

2. **Never put raw tokens in `mcp.json`** — use environment variables:
   ```json
   {
     "github": {
       "command": "npx",
       "args": ["-y", "@modelcontextprotocol/server-github"],
       "env": {
         "GITHUB_TOKEN": "${GITHUB_TOKEN}"
       }
     }
   }
   ```

3. **Audit MCP tool calls** — use hooks to log every MCP execution:
   ```json
   {
     "event": "beforeMCPExecution",
     "scripts": [{ "command": ".cursor/hooks/audit-mcp.sh" }]
   }
   ```

4. **Review MCP server source code** before adding third-party servers

---

### Part E: Agent Mode Security Considerations

Agent mode is powerful but has elevated risk because the AI can autonomously:
- Read any file on your filesystem
- Execute shell commands
- Make network requests
- Modify multiple files in sequence

#### Guardrails

| Control | How to Set Up |
|---------|---------------|
| **Shell command blocking** | Hook on `beforeShellExecution` (see `block-dangerous.sh`) |
| **File read restrictions** | `.cursorignore` for sensitive paths |
| **Command approval** | Set Agent mode to require confirmation for shell commands |
| **Secrets redaction** | Hook on `beforeReadFile` to block `.env`, `*.pem` |
| **Network restrictions** | Corporate firewall / proxy rules for `api.cursor.com`, LLM endpoints |

#### Agent Mode Permission Settings

In Cursor Settings → Features → Agent:
- **"Always allow"** — Agent runs commands without asking (fast but risky)
- **"Ask for approval"** — Agent pauses for your confirmation before shell commands (recommended)
- **"Never allow"** — Agent cannot run shell commands

> **Best practice**: Use **"Ask for approval"** and review every command, especially those involving `curl`, `git push`, database commands, or package installs.

---

### Part F: Team & Enterprise Security Checklist

Use this checklist when rolling out Cursor to your team:

#### Before Onboarding

- [ ] **Enable Privacy Mode** across all team members (enforce via admin settings if on Business plan)
- [ ] **Create `.cursorignore`** in every repository — commit it to source control
- [ ] **Create `.cursorindexingignore`** to exclude build artifacts and large files
- [ ] **Audit `.cursor/mcp.json`** — ensure no secrets are hardcoded
- [ ] **Set up `block-dangerous.sh`** hook to prevent destructive commands
- [ ] **Set up secrets redaction hook** to prevent `.env` / credential files from being read

#### Ongoing Governance

- [ ] **Review agent activity logs** periodically for unexpected file reads or commands
- [ ] **Rotate any API keys** that may have been exposed in prompts or error messages
- [ ] **Disable codebase indexing** for repositories containing sensitive IP or customer data
- [ ] **Pin MCP server versions** — don't use `npx -y` with `latest` in production
- [ ] **Educate developers**: never paste secrets, PII, or credentials into chat prompts
- [ ] **Disable telemetry** if required by compliance (SOC 2, HIPAA, etc.)

#### Network & Compliance

- [ ] **Allowlist endpoints**: `api2.cursor.sh`, `api.openai.com`, `api.anthropic.com`
- [ ] **Block endpoints** if using only specific providers
- [ ] **Proxy all LLM traffic** through corporate proxy for logging if required
- [ ] **Document data flow**: where code goes, which providers, retention policies
- [ ] **Review Cursor's privacy policy** and ToS with legal/compliance team

---

### Part G: Common Data Leakage Scenarios

| Scenario | How It Happens | Prevention |
|----------|---------------|------------|
| Secrets in autocomplete context | Cursor reads `.env` to provide context | `.cursorignore` |
| API key in error message | Agent runs a failing `curl` with token in URL | Secrets redaction hook |
| Proprietary algorithm indexed | Codebase indexing sends embeddings to Cursor | `.cursorindexingignore` or disable indexing |
| PII in test fixtures | Agent reads `test/fixtures/users.json` with real data | `.cursorignore`, use synthetic data |
| Credentials in MCP config | `mcp.json` with hardcoded tokens visible to agent | Use env vars, add `mcp.json` to `.cursorignore` |
| Internal docs in prompt | Developer pastes confidential doc into chat | Training & awareness |
| Production DB credentials | Agent reads `application-prod.yml` | `.cursorignore`, separate prod config |

### Exercise: Identify and Fix Leakage Risks

Look at the ShopCursor project and identify potential data leakage risks:

1. Check if `.env` files exist or are referenced
2. Review `.cursor/mcp.json` for hardcoded tokens
3. Check if any test fixtures contain realistic data
4. Verify that `application.properties` doesn't contain production credentials
5. Create a `.cursorignore` file that addresses all risks you find

<details>
<summary>Click to reveal example .cursorignore for ShopCursor</summary>

```gitignore
# Environment and secrets
.env
.env.*
*.pem
*.key
credentials.json

# MCP config (may contain API tokens)
.cursor/mcp.json

# Database files
*.db
*.sqlite

# IDE secrets
.idea/
*.iml

# Production configs
**/application-prod.*
**/application-staging.*

# Build outputs (reduce noise, not security)
**/target/
**/dist/
**/node_modules/
**/build/
```

</details>

---

## Exercise 6: Agent Hooks for Governance

Hooks are a key governance mechanism — see the dedicated **[Hooks Exercise](hooks.md)** for hands-on exercises covering:
- Auto-formatting after agent edits
- Blocking dangerous shell commands
- Audit logging for compliance
- Secrets redaction

## Key Takeaways

1. **AI is a tool, not a replacement**: Always review and understand generated code
2. **Security first**: Never compromise on security, even for speed
3. **Establish standards**: Use Project Rules (`.cursor/rules/`) to guide AI behavior
4. **Use hooks for guardrails**: Auto-format, block dangerous commands, audit agent actions
5. **Review everything**: Treat AI code like junior developer code
6. **Build knowledge**: Learn from good AI generations, fix bad ones
7. **Iterate**: Improve prompts, rules, and hooks over time
8. **Team alignment**: Share `.cursor/` config (rules, hooks, commands, skills) across the team
9. **Document decisions**: Explain why certain patterns are preferred
10. **Control data flow**: Use Privacy Mode, `.cursorignore`, and indexing controls to prevent sensitive data from leaving your machine
11. **Secure MCP servers**: Scope narrowly, use env vars for tokens, audit tool calls
12. **Educate your team**: Data leakage prevention requires awareness — technical controls alone aren't enough

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Java Secure Coding Guidelines](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
- [Cursor Privacy Policy](https://www.cursor.com/privacy)
- [Cursor Security Documentation](https://docs.cursor.com/privacy)
- [MCP Specification](https://modelcontextprotocol.io/)

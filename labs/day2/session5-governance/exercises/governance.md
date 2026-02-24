# AI Governance and Best Practices

## Overview

As AI-assisted development becomes more prevalent, it's crucial to establish governance practices that ensure code quality, security, and maintainability. This session covers:

- Code review practices for AI-generated code
- Security auditing
- Identifying anti-patterns
- Establishing team standards

## Why AI Governance Matters

AI tools like Cursor are powerful, but they can:
- Generate vulnerable code
- Introduce anti-patterns
- Create technical debt
- Bypass security best practices
- Make assumptions about requirements

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

## Exercise 4: .cursorrules Best Practices

Create effective `.cursorrules` to guide Cursor toward better code generation.

### Sample .cursorrules

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

## Key Takeaways

1. **AI is a tool, not a replacement**: Always review and understand generated code
2. **Security first**: Never compromise on security, even for speed
3. **Establish standards**: Use `.cursorrules` to guide AI behavior
4. **Review everything**: Treat AI code like junior developer code
5. **Build knowledge**: Learn from good AI generations, fix bad ones
6. **Iterate**: Improve prompts and rules over time
7. **Team alignment**: Share .cursorrules across the team
8. **Document decisions**: Explain why certain patterns are preferred

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Java Secure Coding Guidelines](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)

---
description: Scaffolds a complete full-stack feature across the Java backend and React frontend, creating model, repository, service, controller, TypeScript types, API client functions, and React component.
name: add-feature
---

# Scaffold Full-Stack Feature

## When to Use
When you need to add a new entity/feature to ShopCursor that spans both backend and frontend — for example, adding Wishlists, Product Reviews, or Coupons.

## Step-by-Step Instructions

### 1. Backend — Model Entity
Create a JPA entity in `backend/src/main/java/com/shopcursor/model/`:
- Use `@Entity`, `@Id`, `@GeneratedValue`
- Add `@Column` annotations with constraints
- Follow the pattern in `Product.java`

### 2. Backend — Repository
Create a Spring Data JPA repository in `backend/src/main/java/com/shopcursor/repository/`:
- Extend `JpaRepository<Entity, Long>`
- Add custom query methods as needed
- Follow the pattern in `ProductRepository.java`

### 3. Backend — Service
Create a service in `backend/src/main/java/com/shopcursor/service/`:
- Use constructor injection with `final` fields
- Add `@Transactional` for write operations
- Throw `ResourceNotFoundException` for missing entities
- Never return null — use `Optional` or throw
- Follow the pattern in `ProductService.java`

### 4. Backend — REST Controller
Create a controller in `backend/src/main/java/com/shopcursor/controller/`:
- Use `@RestController` with `@RequestMapping("/api/<resource>")`
- Return `ResponseEntity<T>` from all endpoints
- Add `@Valid` for request body validation
- Follow the pattern in `ProductController.java`

### 5. Frontend — TypeScript Types
Add interfaces in `frontend/src/types/index.ts`:
- Use `interface` (not `type`) for object shapes
- Match the backend entity field names

### 6. Frontend — API Client
Add API functions in `frontend/src/api/client.ts`:
- Use `async/await`
- Follow the existing axios patterns

### 7. Frontend — React Component
Create a component in `frontend/src/components/`:
- Functional component with hooks
- Keep under 150 lines
- Co-locate a CSS file
- Add `data-testid` attributes for E2E testing
- Handle loading and error states

## Conventions
- REST endpoints: `/api/<plural-noun>` (e.g., `/api/reviews`)
- Use Java 17 features (records for DTOs, text blocks, pattern matching)
- Use BEM-like CSS class naming
- Keep services thin — business logic only

## After Scaffolding
- Suggest a curl command to test each endpoint
- Suggest E2E test scenarios for the new feature

# Day 1 Lab: Refactor & Enhance ShopCursor

## Overview
In this lab, you'll apply the prompt engineering techniques and Cursor IDE features you learned today to refactor and enhance the ShopCursor e-commerce application.

**Time**: 2-3 hours

**Objectives**:
- Apply refactoring techniques using Cursor's AI features
- Improve code quality in both backend (Java) and frontend (React)
- Build a new feature using Cursor Composer
- Practice effective prompting strategies

---

## Prerequisites

### Environment Setup
Ensure you have:
- Cursor IDE installed and configured
- ShopCursor project open in Cursor
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:3000`

### Files You'll Need
- `labs/day1/lab/starter/CartService.java` - Starting point for backend refactoring
- `labs/day1/lab/starter/ProductList.tsx` - Starting point for frontend refactoring
- `labs/day1/lab/solution/` - Reference solutions (try not to peek!)

---

## Part 1: Refactor CartService.java (45 minutes)

### Context
The `CartService.java` file has several code smells and anti-patterns that make it hard to maintain and test. Your job is to refactor it using Cursor's AI capabilities.

### Starting Point
Copy the starter file to your backend:
```bash
cp labs/day1/lab/starter/CartService.java backend/src/main/java/com/shopcursor/service/CartService.java
```

### Issues to Fix

1. **Magic Numbers**
   - Hardcoded `99` for max quantity
   - Hardcoded `0` for minimum quantity

2. **Poor Error Handling**
   - Methods return `null` instead of throwing exceptions
   - Generic error messages that don't help debugging

3. **Code Duplication**
   - Logic to find cart items is repeated in multiple methods
   - Similar validation patterns duplicated

4. **Missing Validation**
   - No validation for null inputs
   - No validation for product existence

5. **Unclear Variable Names**
   - Single letter variables
   - Non-descriptive method parameters

### Your Tasks

#### Task 1.1: Extract Magic Numbers (10 minutes)
**Cursor Feature**: Use Chat + Inline Edit (Cmd+K)

1. Open `CartService.java` in Cursor
2. Open Chat (Cmd+L) and ask:
   ```
   @CartService.java identify all magic numbers and suggest constants
   ```
3. Review the suggestions
4. Select the class and use Cmd+K:
   ```
   Extract all magic numbers to well-named constants at the top of the class
   ```

**Expected Result**:
```java
private static final int MAX_QUANTITY_PER_ITEM = 99;
private static final int MIN_QUANTITY_PER_ITEM = 0;
```

#### Task 1.2: Improve Error Handling (15 minutes)
**Cursor Feature**: Inline Edit (Cmd+K) + Tab Completion

1. Select the `addToCart` method
2. Press Cmd+K and prompt:
   ```
   Refactor to throw proper exceptions instead of returning null:
   - ResourceNotFoundException for cart/product not found
   - IllegalArgumentException for invalid quantity
   - IllegalStateException for max quantity exceeded
   Include descriptive error messages with context
   ```
3. Repeat for `updateQuantity` and `removeFromCart` methods
4. Use Tab completion to add the exception imports

**Expected Result**:
- Methods throw specific exceptions with helpful messages
- No more null returns
- Example: `throw new ResourceNotFoundException("Cart not found with id: " + cartId)`

#### Task 1.3: Extract Duplicate Logic (10 minutes)
**Cursor Feature**: Chat + Inline Edit

1. Ask Chat:
   ```
   @CartService.java what logic is duplicated across methods?
   ```
2. Select the duplicated logic in one method
3. Press Cmd+K:
   ```
   Extract this cart item finding logic to a private helper method findCartItemByProductId
   ```
4. Use Tab completion to replace other occurrences with the helper method

**Expected Result**:
```java
private CartItem findCartItemByProductId(Cart cart, Long productId) {
    return cart.getItems().stream()
        .filter(item -> item.getProduct().getId().equals(productId))
        .findFirst()
        .orElse(null);
}
```

#### Task 1.4: Add Validation (10 minutes)
**Cursor Feature**: Composer or Inline Edit

1. Use Cmd+K on the entire class:
   ```
   Add a private validation method validateCartOperation that checks:
   - Cart is not null
   - Product is not null
   - Quantity is within valid range (use the constants)
   Call this at the start of each public method
   ```

**Expected Result**:
```java
private void validateCartOperation(Cart cart, Product product, Integer quantity) {
    if (cart == null) {
        throw new IllegalArgumentException("Cart cannot be null");
    }
    if (product == null) {
        throw new IllegalArgumentException("Product cannot be null");
    }
    if (quantity != null && (quantity < MIN_QUANTITY_PER_ITEM || quantity > MAX_QUANTITY_PER_ITEM)) {
        throw new IllegalArgumentException(
            String.format("Quantity must be between %d and %d", MIN_QUANTITY_PER_ITEM, MAX_QUANTITY_PER_ITEM)
        );
    }
}
```

### Verification
1. Run the backend tests: `mvn test`
2. Test manually through the UI
3. Compare with `labs/day1/lab/solution/CartService.java`

---

## Part 2: Refactor ProductList.tsx (45 minutes)

### Context
The `ProductList.tsx` component is doing too much - fetching data, managing state, filtering, and rendering. It needs to be refactored for better maintainability.

### Starting Point
```bash
cp labs/day1/lab/starter/ProductList.tsx frontend/src/components/ProductList.tsx
```

### Issues to Fix

1. **No Custom Hooks**
   - Data fetching logic mixed with component logic
   - State management is cluttered

2. **No Memoization**
   - Filtered products recalculated on every render
   - Performance issues with large product lists

3. **Magic Strings**
   - Category names hardcoded throughout
   - No single source of truth

4. **Large Component**
   - Too many responsibilities
   - Hard to test

### Your Tasks

#### Task 2.1: Extract Custom Hook (15 minutes)
**Cursor Feature**: Composer

1. Open Composer (Cmd+Shift+I)
2. Prompt:
   ```
   Extract the product fetching logic from ProductList.tsx into a custom hook called useProducts.

   The hook should:
   - Fetch products from the API
   - Manage loading and error states
   - Return { products, loading, error, refetch }
   - Handle errors gracefully

   Create the hook in frontend/src/hooks/useProducts.js
   Update ProductList.tsx to use this hook
   ```

**Expected Result**:
- New file: `frontend/src/hooks/useProducts.js`
- ProductList.tsx uses the hook: `const { products, loading, error } = useProducts();`

#### Task 2.2: Add Memoization (10 minutes)
**Cursor Feature**: Inline Edit (Cmd+K)

1. Select the filtering logic in ProductList.tsx
2. Press Cmd+K:
   ```
   Wrap this filtering logic in useMemo to prevent unnecessary recalculations.
   Dependencies should be: products, selectedCategory, searchTerm
   ```

**Expected Result**:
```jsx
const filteredProducts = useMemo(() => {
  return products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [products, selectedCategory, searchTerm]);
```

#### Task 2.3: Extract Constants (10 minutes)
**Cursor Feature**: Chat + Inline Edit

1. Ask Chat:
   ```
   @ProductList.tsx identify all hardcoded strings and arrays that should be constants
   ```
2. Press Cmd+K on the component:
   ```
   Extract the categories array to a constant PRODUCT_CATEGORIES at the top of the file
   ```

**Expected Result**:
```jsx
const PRODUCT_CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];
```

#### Task 2.4: Improve Component Structure (10 minutes)
**Cursor Feature**: Inline Edit

1. Select the entire component
2. Press Cmd+K:
   ```
   Reorganize this component to follow best practices:
   - Hooks at the top
   - Computed values next
   - Event handlers after that
   - Conditional returns early
   - Main JSX return at the end
   Add comments for each section
   ```

**Expected Result**:
Clean, organized component with logical sections and improved readability.

### Verification
1. Run frontend: `npm start`
2. Test filtering and search
3. Check browser console for performance (no unnecessary re-renders)
4. Compare with `labs/day1/lab/solution/ProductList.tsx`

---

## Part 3: Add Wishlist Feature (60-90 minutes)

### Context
ShopCursor needs a wishlist feature where users can save products for later. This requires changes across the full stack.

### Requirements

#### Backend (Java/Spring Boot)
- Wishlist entity with relationship to User and Product
- WishlistRepository
- WishlistService with methods:
  - `addToWishlist(userId, productId)`
  - `removeFromWishlist(userId, productId)`
  - `getWishlistByUser(userId)`
  - `isInWishlist(userId, productId)`
- WishlistController with REST endpoints
- Proper exception handling and validation

#### Frontend (React)
- WishlistButton component (heart icon)
- WishlistPage component to view all wishlist items
- API service functions
- Optimistic UI updates
- Toast notifications for add/remove

### Your Tasks

#### Task 3.1: Plan with Chat (10 minutes)
**Cursor Feature**: Chat with @ references

1. Open Chat (Cmd+L)
2. Ask:
   ```
   I need to add a wishlist feature to ShopCursor. Review @backend/model/ @backend/service/ @backend/controller/ and suggest:
   1. The entity structure for Wishlist
   2. Repository methods needed
   3. Service layer design
   4. REST API endpoints

   Follow the existing patterns in the codebase.
   ```
3. Review the suggestions and refine if needed

#### Task 3.2: Generate Backend with Composer (30 minutes)
**Cursor Feature**: Composer

1. Open Composer (Cmd+Shift+I)
2. Use a comprehensive prompt:
   ```
   Create a wishlist feature for ShopCursor backend:

   1. Wishlist Entity:
   - Fields: id (Long), user (ManyToOne), product (ManyToOne), addedAt (LocalDateTime)
   - Add unique constraint on (user, product) combination
   - Proper JPA annotations

   2. WishlistRepository:
   - Extend JpaRepository
   - Custom query methods: findByUserId, findByUserIdAndProductId, deleteByUserIdAndProductId

   3. WishlistService:
   - addToWishlist: Check if already exists, validate product exists
   - removeFromWishlist: Delete if exists
   - getWishlistByUser: Return list of products in wishlist
   - isInWishlist: Check if product is in user's wishlist
   - Proper exception handling (ResourceNotFoundException, IllegalStateException)

   4. WishlistController:
   - POST /api/wishlist/{userId}/{productId} - Add to wishlist
   - DELETE /api/wishlist/{userId}/{productId} - Remove from wishlist
   - GET /api/wishlist/{userId} - Get user's wishlist
   - GET /api/wishlist/{userId}/check/{productId} - Check if in wishlist
   - Return appropriate HTTP status codes

   Follow the existing code patterns in @backend/model/ @backend/service/ @backend/controller/
   ```

3. Review the generated files
4. Make refinements with follow-up prompts if needed

#### Task 3.3: Generate Frontend with Composer (30 minutes)
**Cursor Feature**: Composer

1. Open Composer (Cmd+Shift+I)
2. Prompt:
   ```
   Create wishlist feature for ShopCursor frontend:

   1. wishlistService.js in frontend/src/services/:
   - addToWishlist(userId, productId)
   - removeFromWishlist(userId, productId)
   - getWishlist(userId)
   - checkIsInWishlist(userId, productId)
   - All functions should use axios and handle errors

   2. WishlistButton.jsx component:
   - Props: productId, userId, initialIsInWishlist
   - Heart icon button (filled if in wishlist, outline if not)
   - Click toggles wishlist status
   - Optimistic UI updates
   - Show toast notification on success/error
   - Use React hooks for state management

   3. WishlistPage.jsx component:
   - Fetch and display user's wishlist
   - Show product cards with remove button
   - Loading and empty states
   - "Add to Cart" button on each item

   4. Update ProductCard.jsx:
   - Add WishlistButton in the top-right corner

   Follow patterns in @frontend/src/components/ and @frontend/src/services/
   Use Material-UI or the existing component library for icons
   ```

3. Review generated files
4. Test integration

#### Task 3.4: Integration & Testing (10-20 minutes)

1. **Backend Testing**:
   - Start backend: `mvn spring-boot:run`
   - Test endpoints with Postman or curl
   - Check database for wishlist entries

2. **Frontend Testing**:
   - Start frontend: `npm start`
   - Click heart icon on products
   - Navigate to wishlist page
   - Test add/remove functionality
   - Verify optimistic updates

3. **Use Chat for Debugging**:
   If you encounter issues:
   ```
   @WishlistController.java @wishlistService.js I'm getting a 404 error when trying to add to wishlist. Help me debug the issue.
   ```

### Bonus Challenges

If you finish early, try these enhancements:

1. **Wishlist Count Badge**:
   - Show number of items in wishlist in navbar
   - Use Cmd+K to add to navigation component

2. **Persist Wishlist in Local Storage**:
   - Cache wishlist data locally
   - Use Chat to ask about best practices:
   ```
   @web What are best practices for syncing wishlist data between local storage and backend API in React?
   ```

3. **Share Wishlist**:
   - Generate shareable link to wishlist
   - Use Composer to add this feature

---

## Submission Checklist

Before you finish, ensure:

### Part 1: CartService Refactoring
- [ ] Magic numbers extracted to constants
- [ ] Proper exceptions thrown with descriptive messages
- [ ] Helper method for finding cart items
- [ ] Validation method added
- [ ] Tests pass
- [ ] Code follows consistent style

### Part 2: ProductList Refactoring
- [ ] Custom hook `useProducts` extracted
- [ ] `useMemo` used for filtered products
- [ ] Categories extracted to constant
- [ ] Component well-organized with comments
- [ ] No console errors
- [ ] Performance improved (check React DevTools)

### Part 3: Wishlist Feature
- [ ] Backend entities, repositories, services created
- [ ] REST endpoints working
- [ ] Frontend components render correctly
- [ ] Add/remove wishlist functionality works
- [ ] UI updates optimistically
- [ ] Error handling in place
- [ ] Code follows project patterns

---

## Reflection Questions

Answer these to consolidate your learning:

1. **Which Cursor feature did you find most useful and why?**

2. **What prompting technique worked best for the refactoring tasks?**

3. **How did using @ references improve your interactions with Cursor?**

4. **What challenges did you face when using Composer for the wishlist feature?**

5. **How would you approach a similar feature addition in your own projects?**

---

## Solutions

Reference solutions are available in `labs/day1/lab/solution/`:
- `CartService.java` - Refactored backend service
- `ProductList.tsx` - Refactored frontend component

**Note**: These are reference implementations. Your solution may differ and still be correct. The goal is to apply the concepts, not match the solution exactly.

---

## Getting Help

If you're stuck:

1. **Use Chat to debug**: `@file explain this error and suggest fixes`
2. **Ask instructors** - we're here to help!
3. **Collaborate** - discuss approaches with other participants
4. **Check documentation**: Use `@web` to search for solutions

---

## Next Steps

Tomorrow (Day 2), you'll learn:
- Advanced Cursor features (codebase indexing, rules, custom instructions)
- Cursor Agents and workflow automation
- Testing strategies with AI assistance
- Team collaboration with Cursor
- Security and best practices

Great job on Day 1! See you tomorrow!

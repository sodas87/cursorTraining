# Scaffold REST Endpoint

Generate a complete REST endpoint for the ShopCursor application.

## What I Need
Tell me the HTTP method, path, and what it should do. Example:
"GET /api/products/featured — return top 4 products by stock"

## Steps

1. **Service Method**: Add the business logic method to the appropriate service in `backend/src/main/java/com/shopcursor/service/`

2. **Controller Endpoint**: Add the REST endpoint to the appropriate controller in `backend/src/main/java/com/shopcursor/controller/`

3. **Repository Query** (if needed): Add a custom query method to the repository in `backend/src/main/java/com/shopcursor/repository/`

## Conventions to Follow
- Return `ResponseEntity<T>` from controllers
- Use constructor injection
- Add proper error handling with `ResourceNotFoundException`
- Follow existing patterns in @backend/src/main/java/com/shopcursor/controller/ProductController.java
- Follow service patterns in @backend/src/main/java/com/shopcursor/service/ProductService.java

## After Generation
- Show me the complete code for each file modified
- Suggest a curl command to test the endpoint
- Suggest a test case for ProductControllerTest.java

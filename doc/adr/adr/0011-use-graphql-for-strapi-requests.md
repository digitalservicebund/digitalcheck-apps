# 11. Use GraphQL Instead of REST for Data Requests to Strapi

**Date:** 2025-01-02

## Status

Accepted

## Context

When designing our application’s data-fetching strategy, we considered two primary approaches for interacting with Strapi: REST and GraphQL. Both options have their benefits and drawbacks.

Strapi supports both REST and GraphQL, and while REST has long been the standard for APIs, GraphQL’s flexibility provides significant advantages in terms of query precision. Our project’s requirements demanded:

- **Dynamic Querying:** The ability to fetch deeply nested data structures efficiently.
- **Flexibility:** Customizable and precise data fetching to minimize over-fetching and under-fetching.
- **Scalability:** Support for future requirements such as aggregations and advanced filtering without rewriting existing endpoints.

### Evaluated Options

1. **REST API**

   - **Pros:**
     - Simple and well-documented.
     - Familiar to most developers and integrates easily with a variety of tools.
     - Requires no additional configuration in Strapi.
   - **Cons:**
     - Over-fetching or under-fetching is common, especially for nested data structures.
     - Requires separate endpoints for different data needs, leading to increased maintenance overhead.
     - Limited flexibility in defining query shapes.

2. **GraphQL API**

   - **Pros:**
     - Query only the data you need, reducing over-fetching and under-fetching.
     - Single endpoint for all requests, simplifying API management.
     - Built-in support for nested queries, relationships, and filtering.
     - Easier to adapt and extend as requirements evolve.
   - **Cons:**
     - Not as common and familiar as REST.
     - Potential performance overhead for complex queries if not optimized correctly.

## Decision

We chose to use **GraphQL** for our data requests to Strapi due to its flexibility and efficiency in handling our specific use cases.

Key considerations for choosing GraphQL:

- **Optimized Data Retrieval:** GraphQL’s ability to query only the required fields and relationships reduces unnecessary data transfer and speeds up response times.
- **Simplified API Structure:** A single endpoint handles all queries, reducing the need for managing multiple REST endpoints.
- **Nested Queries:** Easily handles our deeply nested data requirements, which are common in our application.
- **Future-Proof:** GraphQL’s schema flexibility ensures that our API can evolve without breaking changes or significant rewrites.

## Consequences

The decision to use GraphQL for data requests brings several benefits and challenges. GraphQL optimizes data retrieval
by allowing our client to request only the necessary fields, reducing over-fetching and under-fetching.
The single-endpoint architecture simplifies API management, particularly
as the application scales, and its schema flexibility allows the API to evolve without
significant rewrites or versioning.

However, there are challenges to consider. Developers unfamiliar with GraphQL may need onboarding.
Also, poorly optimized queries could strain server resources, making caching and query optimization
critical for maintaining performance (see [caching](0010-use-serverside-caching.md)).

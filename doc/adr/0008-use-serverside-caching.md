# 8. Use Server-Side Caching with NodeCache for Strapi Data Fetching

**Date:** 2024-12-05

## Status

Accepted

## Context

Fetching data from Strapi frequently can result in performance
bottlenecks and increased latency, especially when querying the same
data repeatedly in a short time span. This can impact user experience.

Previously, our approach did not involve caching, leading to:

- **Repeated requests** for identical GraphQL queries, increasing load on the Strapi server.
- **Higher response times** for end-users, particularly for frequently accessed resources.

To address these issues, we evaluated multiple solutions for
implementing caching to reduce redundant calls and improve performance.

### Evaluated Options

1. **Caching in Strapi with Apollo:**

   - Apollo's built-in caching features were explored for use within Strapi.
   - However, integration issues made it impractical for our needs, and it failed to provide the expected benefits.

2. **External Caching Services (e.g., Redis):**

   - High scalability and flexibility.
   - Requires additional infrastructure setup and maintenance.
   - Overhead may not be justified for our current scale.

3. **In-Memory Caching with NodeCache:**
   - Simple to integrate directly into the application code.
   - Minimal setup with built-in TTL (time-to-live) and periodic cleanup.
   - Well-suited for small-scale, server-side caching needs.

## Decision

We decided to use **NodeCache** for implementing server-side caching in our data-fetching layer.
This approach is lightweight and integrates seamlessly with our existing architecture.

Key considerations for choosing NodeCache:

- **Simplicity:** Straightforward Integration.
- **Low Overhead:** As an in-memory solution, it requires no additional external service or infrastructure.
- **Global Caching:** We opted to cache entire responses for specific queries globally instead of caching individual fields. This is because we do not have a large variety of different requests, making global caching simpler and more effective.
- **TTL Management:** Built-in support for automatic expiration of cached data aligns with our need for caching dynamic content with a short lifespan.
- **Immediate Benefits:** It reduces repeated requests for identical GraphQL queries to Strapi, improving performance and decreasing server load.

## Consequences

We will use `node-cache` to cache requests to Strapi.

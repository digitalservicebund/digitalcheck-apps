# 16. Use Server-Side Caching with NodeCache for Strapi Data Fetching

Date: 2024-12-05

## Status

Accepted

## Context

Fetching data from Strapi frequently can result in performance
bottlenecks and increased latency, especially when querying the same
data repeatedly in a short time span. This can impact user experience as well as
infrastructure load, efficiency and cost.

Previously, our approach did not involve caching, leading to:

- **Repeated requests** for identical GraphQL queries, increasing load on the Strapi server.
- **Higher response times** for end-users, particularly for frequently accessed resources.

This is especially important for our service, as we use deeply nested queries to fetch data,
which increases complexity and slows down processing.
To address these issues, we evaluated multiple solutions for
implementing caching to reduce redundant calls and improve performance.

### Evaluated Options

1. **Caching in Strapi Cloud with Apollo Server:**

   - Apollo's built-in caching features were explored for use within Strapi.
   - However, integration issues made it impractical for our needs, and it failed to provide the expected benefits.
   - Does not support easy cache invalidation.

2. **Caching on the Client/Remix Server with Apollo Client**

   - Apollo Client supports caching out of the box and comes with additional quality-of-life features and a comprehensive documentation.
   - Features like a custom hook, Suspense support and normalized caching are a strong suite.
   - Better fit for Client-side caching, but also supports SSR.

3. **External Caching Services (e.g. Redis):**

   - High scalability and flexibility.
   - Requires additional infrastructure setup and maintenance.
   - Overhead may not be justified for our current scale.

4. **In-Memory Caching with NodeCache:**

   - Simple to integrate directly into the application code.
   - Minimal setup with built-in TTL (time-to-live) and periodic cleanup.
   - Well-suited for small-scale, server-side caching needs.

## Decision

We decided to use **NodeCache** for implementing server-side caching in our data-fetching layer.
This approach is lightweight and integrates seamlessly with our existing architecture.

Key considerations for choosing NodeCache:

- **Simplicity:** Straightforward Integration.
- **Low Overhead:** As an in-memory solution, it requires no additional external service or infrastructure.
- **Global Caching:** We opted to cache entire responses for specific queries globally instead of caching individual fields. This is because we do not have a large variety of different requests and no user specific data, making global caching simpler and more effective.
- **TTL Management:** Built-in support for automatic expiration of cached data aligns with our need for managing dynamic content with a long lifespan, especially once the initial dataset has been fully inserted.
- **Immediate Benefits:** It reduces repeated requests for identical GraphQL queries to Strapi, improving performance and decreasing server load.

## Consequences

We use `node-cache` to cache Strapi requests, reducing redundant queries and improving response times. Each query is cached with a unique key based on the query and variables, ensuring granular caching.

### How It Works

- **Cache Check**: All queries to Strapi go through a central method, `fetchStrapiData`. Each query is assigned a unique cache key, generated based on the query string and variables. Queries are first checked in the cache; if a matching entry exists, it is returned immediately. Otherwise, Strapi is queried, and a new cache entry is created. Each cache entry remains valid for the duration specified in the TTL configuration.
- **Automatic Expiration**: Cached data expires after the configured TTL, balancing data freshness with performance.
- **TTL and Check Period**: The standard ttl `stdTTL` determines how long a cache entry remains valid before it is marked as expired. The `checkperiod` ensures that expired entries are purged at regular intervals, maintaining cache efficiency and up-to-date data availability.

### Possible Side Effects

- **Outdated Data**: Users might see outdated data if Strapi content is updated while the cache is still valid and has not yet expired.
- **Memory Usage**: Increased memory consumption for caching, especially with large datasets.
- **Stale Data Mitigation**: Updates in Strapi could be handled by manually clearing caches or integrating a webhook.

This approach works well for our infrequent content updates, balancing performance and data freshness.

If we decide to move to SSR in React Router 7 we will reevaluate our caching needs and setup.

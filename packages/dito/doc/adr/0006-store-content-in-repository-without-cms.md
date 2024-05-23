# 6. Store content in the repository without using a CMS

Date: 2024-05-23

## Status

Accepted

## Context

We need to decide where we store the (textual) content of the application. We considered the following options:

- store the content in an external content management system (CMS) and fetch it via API at build or runtime
- store the content alongside with the code in the repository

The biggest advantage of using a CMS is that it allows non-technical users to easily maintain content.
Additionally, the code remains cleaner and more focused on functionality.

However, a CMS introduces technical complexity and adds another dependency to the application, which must be managed.
It needs to be either purchased as a managed service or self-hosted, both of which require setup
and maintenance effort.

Remix ist not capable of SSG, so we would need to fetch the content at runtime,
which would slow down the application and lead to added load on the CMS.
We could however make use of SWR to cache the content and mitigate this issue.

Looking ahead, this increased complexity can make it more difficult to hand over the project to another party
for operation or further development. However, once it is running, it might be easier for non-technical users to manage.

It is currently not planned to frequently iterate the content of the application.

## Decision

We do not use an external CMS to store the content since the increased complexity and effort is not justified
by the benefits it brings considering that the content is not being iterated frequently.

## Consequences

The content will be integrated into the code repository, stored alongside and tightly coupled with the code.

# 15. Use a CMS for the new example pages content

Date: 2024-11-20

## Status

Accepted

## Context

For the new example pages, we need a way to allow multiple users to update the content, including potentially external contributors.
Additionally, the content schema might change frequently in the beginning.

The two main approaches we considered were continuing with our current approach of using a single content file or using a CMS.
We are experiencing some painpoints with the current approach of a single content file, which has grown exceedingly large and difficult to manage.
However, a CMS also isn't without drawbacks, such as the need for additional infrastructure and potential complexity in setup and maintenance.

## Decision

We decided to use a CMS for the new example pages content to support potential external contributors and because it allows for quicker setup and changes in the content schema.

## Consequences

We will evaluate multiple CMS options and choose one that best fits our needs.

We will also up the necessary infrastructure and processes for managing the CMS content, including user access and content review workflows.

We will create utility functions to fetch the content from the CMS and integrate it into our components.

We will document our experience and any challenges we encounter with the CMS to inform future decisions around content management.

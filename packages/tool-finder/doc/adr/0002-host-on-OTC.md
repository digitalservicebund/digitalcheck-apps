# 2. Host on OTC

Date: 2024-04-02

## Status

Accepted

## Context

The website needs to be hosted somewhere for public access.
This hosting has to generally conform with the demands of GDPR and specifically with the needs of the BMI, which is the patron of the project.
We identified two possible hosting options with their respective pros and cons:

1. **GitHub pages** (GH pages) is a managed solution and allows for a very simple setup and integration with the repository.
   - The servers (and thus IP logging) are located in the United States. The BMI would be fine with that aslong as a data processing agreement is in place. However, we would need to write that data processing agreement.
   - GH pages only support hash-based navigation with negative implications for scroll-to elements and source-tags for tracking.
   - GH pages only support static websites, there is no possibility of adding a backend.
   - Security headers cannot be configured on GH pages.
2. **Open Telekom Cloud** (OTC), which is supported by our plattform team and allows for a more custom configuration.
   - This solution is GDPR-conform out of the box but needs more engineering work to setup and maintain and also incurrs additional costs for the infrastructure. It allows us to reuse existing data processing agreements, however.
   - OTC comes with the option of later adding a staging environment and/or backend.
   - We would need to setup an additional repository for the infrastucture code, i.e. terraform and kubernetes and keep it up to date.

## Decision

We will host the application on **Open Telekom Cloud**, using the existing templates provided by our plattform team. The additional work (manageable, 1-2 days of migration and a few hours each months for upkeep) and cost (negligible, a few dozen euros per month) are worth the added benefit of a more custom configuration, real client side navigation and reduced regulatory overhead.

## Consequences

We setup nginx as a server for our application and use docker for building a shippable image.
We create an additional infrastrucure repository and follow the platform docs to deploy our application on the DigitalService kubernetes cluster.

There is a higher risk of the application breaking down. We either need to make sure to always have an engineer not on vacation or live with that risk (someone from plattform could probably also mitigate the issue). This is especially relevant from 2025 on, as we might not work on the project anymore.

We will set up a security modelling workshop to identify possible threats and requirements due to hosting on OTC.

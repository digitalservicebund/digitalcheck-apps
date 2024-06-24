# 1. Use Feature Flags

Date: 2024-06-22

## Status

Proposed

## Context

We need to add Feature Flags to the application in order to control the release of features once they reach the main branch and thus production. Implementing this before releasing the production application into the wild makes sense, so that we don't have to integrate this in an already running application that is receiving traffic.

Standard options available to us within Digitalservice are:

- **Environment variables**: A home-spun solution that checks for environment variables to display/hide features.
- **PostHog**: All-in-one platform that provides Feature Flags as just one of many features for large scale applications.
- **Unleash**: An open-source, self-hosted solution that offers basic functionality.

Environment variables offer a way to quickly hide/show functionality without needing to leave the codebase for an external interface, adding an external dependency, or requiring considerations to performance. However, they can quickly get unwieldy and difficult to manage with more than a few of them set in an application. Making changes to their values also requires code changes and a deployment, which can take some time and introduce undesired friction.

[PostHog](https://posthog.com/) offers a plethora of features and a highly integrated solution that goes beyond Feature Flags — it offers A/B testing, Analytics, Session replay, Surveys and many other features that can be useful for certain types of application development. Typically this would be a large scale application with many visitors where quantative data on user activity is useful for decision making. These features come at a cost however, with effeciency of scale only making sense with many thousands or millions of users. Adopting PostHog would also entail additional privacy and procurement considerations.

[Unleash](https://www.getunleash.io/) is well tested and integrated in multiple Digitalservice projects already. Because it is self-hosted and [already established](https://features.p.digitalservice.dev/) amongst the Platform offerings at DigitalService, set-up is frictionless and there is plenty of domain knowledge within the organisation to provide support. Costs are also much more manageable.

## Decision

We will use **Unleash** for Feature Flags within the Digitalcheck project. Our audience is very small, and the complexity of features requiring Feature Flags we can envision in the future is relatively low. PostHog offers a bunch of functionality that we likely won't need with our audience size, or have alternatives for e.g. tracking. It's costs are also prohibitive for an application of our scale. Environment variables were also considered, but the advantages of an easy to administer dashboard for instant toggling of features as well as the relatively low cost and friction of installation for Unleash outweighed a home-spun solution.

## Consequences

- We will integrate the Unleash Node.JS SDK into our application and favour Feature Flags that act server-side
- We will need to clear usage of Unleash with our legal department
- We will need to configure our environments (local & production) with credentials to connect to Unleash
- We need to take note of cost implications and feed these back to Project leadership

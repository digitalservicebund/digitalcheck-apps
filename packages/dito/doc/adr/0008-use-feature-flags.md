# 1. Use Feature Flags

Date: 2024-06-22

## Status

Proposed

## Context

We need to implement Feature Flags to the application in control the release of features once in production. Implementing this before releasing the production application into the wild makes sense, so that we don't have to integrate this in an already running application that is receiving traffic.

Standard options available to us within Digitalservice are:

- **PostHog**: All-in-one platform that provides Feature Flags as just one of many features for large scale applications
- **Unleash**: An open-source, self-hosted solution that offers basic functionality.

[PostHog](https://posthog.com/) offers a plethora of features and a highly integrated solution that goes beyond Feature Flags — it offers A/B testing, Analytics, Session replay, Surveys and many other features that can be useful for certain types of application development. Typically this would be a large scale application with many visitors where quantative data on user activity is useful for decision making. These features come at a cost however, with effeciency of scale only making sense with many thousands or millions of users.

[Unleash](https://www.getunleash.io/) is well tested and integrated in multiple Digitalservice projects already. Because it is self-hosted and [already established](https://features.p.digitalservice.dev/) amongst the Platform offerings at DigitalService, set-up is frictionless and there is plenty of domain knowledge within the organisation to provide support. Costs are also much more manageable.

## Decision

We will use **Unleash** for Feature Flags within the Digitalcheck project. Our audience is very small, and the complexity of features we can envisage in the future that would require Feature Flags are relatively uncomplicated. PostHog offers a bunch of functionality that we likely won't need with our audience size, or have alternatives for e.g. tracking. It's costs are also prohibitive for an application of our scale.

## Consequences

- We will integrate the Unleash Node.JS SDK into our application and favour Feature Flags that act server-side
- We will need to clear usage of Unleash with our legal department
- We will need to configure our environments (local & production) with credentials to connect to Unleash
- We need to take note of cost implications and feed these back to Project leadership

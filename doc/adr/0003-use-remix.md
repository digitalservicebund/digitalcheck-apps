# 3. Use Remix as the meta framework for React

Date: 2024-05-17

## Status

Accepted

## Context

For the digital touchpoint, we need both some kind of backend (to handle emails and PDF generation) as well as a way to serve the frontend.
For React, multiple solutions that handle both tasks simultaneously exist.
The most popular ones are Next.js and Remix.
Both provide all the necessary features to build a full-stack application.
Both come with production ready servers to run the application and serve the frontend.

While Next.js is more popular and has a larger community, there is more experience with using Remix in the DigitalService and Digitalcheck team specifically.
The platform team also provides an easy to get started with [template](https://github.com/digitalservicebund/remix-application-template) for setting up a Remix project.

Further benefits of Remix are:

- The more fine grained control over routing
- Easier data fetching
- Subjectively better dev experience

Downsides of Remix include:

- Worse documentation
- A mental model that can be hard to grasp
- Potentially larger files
- Calling multiple APIs from the same route can be more complex, not suited for SPAs

## Decision

We will use Remix as the meta framework for serving React and building the backend, as its model aligns well with the DiTo architecture.

## Consequences

We will use the [Remix template](https://github.com/digitalservicebund/remix-application-template) provided by the platform team to set up the project.

We will proactively share knowledge about how to best structure code / data loading to get a common understanding of best practices and pitfalls.

We will make sure to split files once they get too large to keep the project maintainable.

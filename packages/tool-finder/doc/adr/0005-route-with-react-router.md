# 5. Use React Router for routing

Date: 2024-04-15

## Status

Accepted

## Context

React in and of itself does not provide a routing solution, which we need for a URL-based navigation in the tool finder.
To handle routing in a React application, we thus need to choose a routing library.
As the tool finder is a simple form-based and static single page application, we do not need a backend and want to opt for the simplest solution possible.
Options include React Router, Remix, Next.js.
All of these are modern and well-maintained and come with a solution for routing in React applications.
However, Remix and Next.js are primarily suited for more complex applications requiring backend integration or server-side rendering.

## Decision

We will use React Router and not Remix, Next.js or a similar meta-framework to handle routing, as it is the simplest solution that fits our needs.

## Consequences

We will deploy the application as a frontend-only static site, reducing infrastructure requirements. However, we still need a server to host the static files, but this will be a simple nginx server according to [ADR 0002](/doc/adr/0002-host-on-OTC.md).

The following drawbacks are to be considered:

- **Flexibility:** React Router is not as feature-rich as Remix or Next.js. This is not a problem for the tool finder at the start, as we do not need server-side rendering or other dynamic features. If full-stack functionalities are required in the future we will need to reevaluate our choice and might switch to one of the full-fletched meta-frameworks.
- **Future Proofing:** There is also the likely possibility of [React Router being merged with Remix](https://twitter.com/ryanflorence/status/1767560366027129211) in the near future, at which point we would have to address this development by switching our routing solution.

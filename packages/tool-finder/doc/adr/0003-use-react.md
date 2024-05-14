# 3. Use React as the frontend framework

Date: 2024-04-11

## Status

Accepted

## Context

We need to decide on the frontend framework for developing the tool finder, a simple form-based and static single page application. The technology needs to meet the following requirements:

- We want to get it out of the door fast by re-using knowledge and code available
- The application should be operable with low set-up and maintenance costs
- The used technologies should be proven, well maintained and state-of-the-art

At DigitalService, we mainly have built websites using React, with some teams opting for different technologies such as Vue or Svelte.
Each of those is proven and capable enough to be the basis for the tool finder, however React has the edge over the others when it comes to experience in the Digitalcheck team and existing code in the company.
We also already have experience with specific libraries that aid with building forms in React.

React brings the following advantages:

- **Code re-usability:** React components from other projects in the company could be re-used for development velocity.
- **Knowledge Transfer:** Existing knowledge within the company regarding React could be leveraged.
- **Onboarding:** There is a high likelihood that new team members are already familiar with React, which reduces the onboarding time. If not, there are many resources available for learning React.

The following potential drawbacks are to be considered:

- **Application Size:** React is a larger library compared to other frontend frameworks, which might impact the initial load time of the application.
- **Performance:** React applications can be optimized for performance, but require additional effort compared to more modern frameworks like Svelte.
- **Learning Curve:** React can have a steeper learning curve compared to other frontend frameworks, when it comes to applying more advanced features. This might require additional time for onboarding new team members.

These downsides - especially application size and performance - are not critical for the tool finder, as it is a simple application with static data and does not require complex interactions.

## Decision

We will use React as the frontend framework since it aligns well with the outlined requirements and considerations.

## Consequences

- We re-use components from other projects.
- We build up knowledge for React in the team by leveraging the knowledge and learnings of other teams.
- There is no need to build up knowledge with another frontend framework.
- We use a suitable build tool to generate a static site from the React project to be operated without a backend.

# 5. Do not use an external dependency as state machine

Date: 2024-05-21

## Status

Accepted

## Context

The digital touchpoint application will feature a dialog form that guides users through a series of questions.
We need to decide whether to use an external dependency, such as [xstate](https://xstate.js.org/),
which provides a state machine implementation, or to implement the flow ourselves. The application
will ask users a fixed number of questions (currently five), with a set order and no conditional
logic for skipping questions. This setup is not expected to change in the near future.
The answers will determine different outcomes on a result page.

The benefits of using an external state machine dependency include:

- Easier addition of new questions or changes to the order once set up
- Improved management of complexity if the dialog form evolves, reducing the risk of errors and minimizing code changes

However, there are also some drawbacks:

- Introducing a dependency adds maintenance work and increases the software’s complexity and size
- The mental model of the dependency must be understood
- Learning to use the dependency requires additional effort

## Decision

We do not use an external dependency as a state machine, as it would introduce unnecessary overhead given the
current simplicity of the dialog form.

## Consequences

We will implement our own dialog form flow for the five consecutive questions without relying on an external dependency.

We will reassess this approach if the complexity of the dialog form increases.

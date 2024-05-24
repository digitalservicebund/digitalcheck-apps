# 2. Use TypeScript

Date: 2024-05-22

## Status

Accepted

## Context

We need to decide on whether to use TypeScript or pure JavaScript for developing the web applications.

TypeScript is a superset of JavaScript that adds static type definitions.
It is widely used in the industry and has been adopted by many companies, including DigitalService, for frontend development.
Through its type safety, TypeScript improves reliability and maintainability while adding a moderate amount of engineering overhead.
The usage of TypeScript is independent of the frontend framework chosen, but it is for example well-suited for React, as it allows for type-safe components and props and can be integrated into the build process with minimal effort.
TypeScript also offers good tooling support, such as autocompletion and type checking in the editor.

## Decision

We will use TypeScript for developing the web applications.

## Consequences

Developers will benefit from TypeScripts type safety by having more confidence in deployments and better maintainablity.
Development might appear to be slower due to the additional time needed for writing type definitions.

The build pipeline will be slightly slower due to the time needed for type checking.

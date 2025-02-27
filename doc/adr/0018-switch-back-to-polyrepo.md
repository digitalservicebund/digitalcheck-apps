# 18. Switch back from monorepo to polyrepo

Date: 2025-02-27

## Status

Accepted

## Context

We have decided to sunset the Tool Finder and remove it from the monorepo.

There are currently no other packages in the monorepo and no plans to build new applications.

## Decision

We will switch back to a polyrepo setup, i.e. this repository will only contain the Digital Touchpoint application.

## Consequences

We will remove all the Tool Finder related files and references to it.

We will simplify the GitHub Actions setup and remove the dynamic pipeline.

We will consolidate the configurations of the tools we are using, like TypeScript, Tailwind, ESLint, Prettier, Playwright, etc.

We will adapt the docker files for the new setup.

We will manually test that all the npm commands still work as expected.

We will update the README to reflect the new polyrepo setup.

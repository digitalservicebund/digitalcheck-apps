# 6. Guidelines for testing

Date: 2024-06-22

## Status

Accepted

## Context

We need to ensure our application is well tested, while considering the complexity of our application, and the experience of developers working on it.

We could do everything between requiring draconian testing standards, to having no tests. The sweet spot is likely somewhere in the middle. This ADR will document some basic guidelines around tests.

## Decision

- We prefer mostly end-to-end, unit/component tests only where it makes sense — Inspiration: Write tests. Not too many. Mostly end-to-end.
- Put unit/component test files co-located with the components they are testing.
- Seperate tests into multiple files when it makes sense to test different parts of the application.
- Use beforeEach/beforeAll and similar when running through repetitive sections of the application when needing to test a certain area that is dependent on those previous steps.
- Prefer testing happy paths, and having exceptions for testing edge cases.
- DRY is not so applicable in tests, explicitly repeating ourselves sometimes is good to ensure tests are covering what we think they are and force us to take another look at tests files occasionally.
- Quality of life — it can be good to add some logically placed line breaks and comments to dense tests for readability and comprehension.
- Consider if tests can be parallelised, but also don't pre-optimise.
- We **won't** enforce tests to be passing before committing code, but consider that broken tests will prevent deployment pipelines from succeeding and could impact your colleagues working on other features and/or make urgent hotfixes difficult in the case of incidents.

## Consequences

- Some clean-up & refactoring of existing tests

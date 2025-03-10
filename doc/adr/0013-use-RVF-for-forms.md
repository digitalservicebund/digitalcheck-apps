# 13. Use RVF for implementing forms in React and Remix

Date: 2024-08-30

## Status

Accepted

## Context

While we do not technically need a library for implementing forms in React and Remix, it makes the implementation of forms easier and more consistent.

So far, we have been using [React Hook Form](https://react-hook-form.com/), but the integration with Remix was cumbersome and led to us reinventing the wheel a few times.

We identified the following, possibly suitable replacements that specifically support Remix:

- [Remix Hook Form](https://github.com/forge42dev/remix-hook-form), based on the aforementioned React Hook Form
- [RVF](https://www.rvf-js.io/), the successor to [Remix Validated Form](https://www.remix-validated-form.io/), which a colleague recommended
- [Conform](https://conform.guide/)
- [Remix Forms](https://remix-forms.seasoned.cc/), another wrapper for React Hook Form

Two additional requirements are that the form should be able to be submitted natively (to trigger file downloads) and that it should integrate well with zod. It is unclear whether Remix Forms is still actively maintained and supports native form submissions.

In the end, we probably could have gone with either one of the remaining solutions.
RVF and Conform seem to be the best maintained and most popular out of the three.
RVF has the lowest amount of open issues, Conform has the highest amount of stars.
Both support native form submissions and integrate well with zod.

## Decision

We will use RVF for implementing forms in React and Remix.
The decision came down to us preferring its documentation and server side syntax over Conform.

## Consequences

We will migrate all forms to RVF.
We will use `@rvf/react` for the tool finder and `@rvf/react-router` for DiTo.

We will use `@rvf/zod` for direct integration with our form validation.

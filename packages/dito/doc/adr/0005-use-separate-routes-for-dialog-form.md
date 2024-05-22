# 5. Use separate routes for each page of the dialog form

Date: 2024-05-22

## Status

Accepted

## Context

The digital touchpoint application will include a dialog form designed to guide users through a series of questions.
We need to determine whether each question should have its own route or if we should use a multi-page form approach,
where all questions share a single route and only the page content changes.

If each question has its own route, tracking page-views and utilizing browser navigation will work seamlessly.
This setup would also allow users to bookmark or share specific questions via deep links. However, using a single
route with changing content could provide smoother transitions between questions and prevent users from accidentally
skipping questions by using deep links.

## Decision

We use separate routes for each question.

## Consequences

We create a separate page for each question, linking them to allow users to navigate back and forth.

We implement a logic that redirects users to the first unanswered question if any are accidentally skipped.

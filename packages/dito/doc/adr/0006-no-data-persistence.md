# 6. No permanent persistence of user data

Date: 2024-05-22

## Status

Accepted

## Context

We need to determine whether user data should be stored permanently or only for the duration of a single session.
The data under consideration includes the answers to the dialog form flow questions and contextual information about
the user and the policy they are working on.

Currently, we do not intend to implement a feature that allows users to store and re-access data after their session
ends. Instead, we plan to provide functionality for users to export their data at the end of the flow,
such as by downloading a PDF document or receiving it via email.

Persisting user data would increase the complexity of our infrastructure, as well as our privacy and data retention policies.

## Decision

We do not persist user data permanently since there is no use case which would justify the effort.

## Consequences

We store user data only for the duration of the session and exclusively on the user's client device.

Additionally, we offer users the option to export and save the results of their session, e.g. as pdf document or via mail.

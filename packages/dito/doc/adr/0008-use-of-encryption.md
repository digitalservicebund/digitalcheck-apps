# 7. Use of encryption

Date: 2024-09-06

## Status

Accepted

## Context

To release a new feature we encountered a scenario where we wanted to embed potentially sensitive data into a unique URL to transport it between different parties, without revealing the information in clear text or behind a simple encoding such as base64. For this reason, a solution to do so was required.

Another common pattern to solve this would to be generate a unique identifier that was stored in a databse along with a reference to the full URL (known as URL shortening). Shortening the URL itself was not deemed important in this case, however. Additionally, since the application does not have a database at this time, and the size of this feature did not appear to justify adding one, another solution was required.

## Decision

We introduce basic encryption mechanisms to be able to encode plain text content into a unique and encrypted string, that can also be decrypted using a combination of an encryption key and uniquely generated initialization vector that is created at the time of the content being encrypted.

## Consequences

A unique encryption key must be generated, safely stored in the team vault within 1Password (in case of the need for retrieval), sealed as a secret, and included within the application infrastructure. The application can now use this key to encrypt and decrypt content.

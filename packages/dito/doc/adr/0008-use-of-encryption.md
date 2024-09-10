# 8. Use of encryption

Date: 2024-09-06

## Status

Accepted

## Context

We need to communicate potentially sensitive data between two parties using only an URL, without revealing the information in clear text or behind a simple encoding such as base64.

One option is to encrypt the data using a key that is only accessible on the server.

Another common pattern to solve this would to be generate a unique identifier that was stored in a database along with a reference to the full URL (known as URL shortening). Shortening the URL itself was not deemed important in this case, however. Additionally, the application does not have a database at this time, and the size of this feature does not appear to justify adding one.

## Decision

We introduce basic encryption mechanisms to encode plain text content into a unique and encrypted string, that can then be decrypted using a combination of an encryption key and uniquely generated initialization vector that is created at the time of the content being encrypted.

## Consequences

A unique encryption key must be generated, safely stored in the team vault within 1Password (in case of the need for retrieval), sealed as a secret, and included within the application infrastructure. The application can now use this key to encrypt and decrypt content.

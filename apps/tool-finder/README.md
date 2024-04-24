# Digitalcheck Werkzeugfinder aka Tool Finder

[![Pipeline](https://github.com/digitalservicebund/digitalcheck-tool-finder/actions/workflows/pipeline.yml/badge.svg)](https://github.com/digitalservicebund/digitalcheck-tool-finder/actions/workflows/pipeline.yml)

A simple web-application to enable anyone working on policy making in the german government to find the right tools for visualisation.

## Prerequisites

### Node.js

We aim to use the current active [LTS version of nodejs](https://nodejs.dev/en/about/releases/), which is V20 at the time of writing.
There is a `.node-version` file to simplify setup using [nodenv](https://github.com/nodenv/nodenv).

### Testing

For E2E and a11y testing with [Playwright](https://playwright.dev/docs/intro) you will need to install the supported browsers:

```bash
npx playwright install
```

### Git Hooks

For the provided Git hooks you will need to install [lefthook](https://github.com/evilmartians/lefthook/blob/master/docs/full_guide.md)
(git hook manager):

```bash
brew install lefthook
./run.sh init
```

The following hooks are specified in the `lefthook.yml`:

- `commitlint` - write [conventional commit messages](https://chris.beams.io/posts/git-commit/)
- `lint` - avoid committing code violating linting rules
- `format` - avoid committing wrongly formatted code

Before pushing, the following checks are additionally ran:

- `licenses-audit` - uses `license-checker` to verify depency licenses

### security.txt

This template contains a [security.txt](https://securitytxt.org/), where you probably want to update the expiration date. The following entries may also be added:

```
Policy: https://raw.githubusercontent.com/digitalservicebund/<<REPO_NAME>>/main/SECURITY.md
Canonical: https://<<PROJECT_URL>>/.well-known/security.txt
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Testing

The application has

- unit tests (using [Jest](https://jestjs.io/docs/getting-started))
- end-to-end tests (using [Playwright](https://playwright.dev/docs/intro))
- a11y tests (using [axe-playwright](https://www.npmjs.com/package/axe-playwright))

**Test commands**

- Run unit tests: `npm test`
- Run unit tests with watcher: `npm test -- --watch`
- Run E2E tests: `npm run test:e2e`
- Run accessibility tests: `npm run test:a11y`
- Run all tests: `npm run tests`

### Code quality checks (linting & formatting)

The project uses [ESLint](https://eslint.org/docs/latest/) for linting and [Prettier](https://prettier.io/docs/en/). for formatting.

**Commands**

- Check formatting: `npm run format:check`
- Autofix formatting issues: `npm run format:fix`
- Check lint: `npm run lint:check`
- Autofix lint issues: `npm run lint:fix`
- Check style (formatting & linting): `npm run style:check`
- Autofix style issues (formatting & linting): `npm run style:fix`

## Build and start

Build the app for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run start
```

## Architecture Decision Records

The `docs/adr` directory contains [architecture decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
For adding new records the [adr-tools](https://github.com/npryce/adr-tools) command-line tool is useful but not strictly necessary:

```bash
brew install adr-tools
```

## Contributing

🇬🇧
Everyone is welcome to contribute the development of the _digitalcheck-tool-finder_. You can contribute by opening pull request,
providing documentation or answering questions or giving feedback. Please always follow the guidelines and our
[Code of Conduct](CODE_OF_CONDUCT.md).

🇩🇪  
Jede:r ist herzlich eingeladen, die Entwicklung der _digitalcheck-tool-finder_ mitzugestalten. Du kannst einen Beitrag leisten,
indem du Pull-Requests eröffnest, die Dokumentation erweiterst, Fragen beantwortest oder Feedback gibst.
Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT_DE.md).

### Updating the content

To update texts or links, change [data.ts](resources/data.ts).

To add images, upload them to [/resources/img](resources/img) and edit [data.ts](resources/data.ts) with the corresponding path. Don't forget to add a fitting alt text.

### Contributing code

🇬🇧
Open a pull request with your changes and it will be reviewed by someone from the team. When you submit a pull request,
you declare that you have the right to license your contribution to the DigitalService and the community.
By submitting the patch, you agree that your contributions are licensed under the MIT license.

Please make sure that your changes have been tested befor submitting a pull request.

🇩🇪  
Nach dem Erstellen eines Pull Requests wird dieser von einer Person aus dem Team überprüft. Wenn du einen Pull-Request
einreichst, erklärst du dich damit einverstanden, deinen Beitrag an den DigitalService und die Community zu
lizenzieren. Durch das Einreichen des Patches erklärst du dich damit einverstanden, dass deine Beiträge unter der
MIT-Lizenz lizenziert sind.

Bitte stelle sicher, dass deine Änderungen getestet wurden, bevor du einen Pull-Request sendest.

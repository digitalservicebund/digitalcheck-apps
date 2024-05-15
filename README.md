# Digitalcheck Monorepo

[![Pipeline](https://github.com/digitalservicebund/remix-application-template/actions/workflows/pipeline.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/pipeline.yml)
[![Scan](https://github.com/digitalservicebund/remix-application-template/actions/workflows/scan.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/scan.yml)
[![Secrets Check](https://github.com/digitalservicebund/remix-application-template/actions/workflows/secrets-check.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/secrets-check.yml)

This repository contains web applications in the Digitalcheck context.

## Prerequisites

### Node.js

We aim to use the current active [LTS version of nodejs](https://nodejs.dev/en/about/releases/), which is V20 at the time of writing.
There is a `.node-version` file to simplify setup using [nodenv](https://github.com/nodenv/nodenv).

### Dependencies

Install the dependencies using npm.

```bash
npm install
```

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

- `licenses-audit` - uses `license-checker` to verify dependency licenses

## Development

### Run locally

From your terminal:

```sh
npm run dev --workspace="packages/<app-name>"
```

This starts your app in development mode, rebuilding assets on file changes.

### Testing

The applications have

- unit tests (using [Jest](https://jestjs.io/docs/getting-started))
- end-to-end tests (using [Playwright](https://playwright.dev/docs/intro))
- accessibility tests (using [Playwright](https://playwright.dev/docs/intro) and [Axe](https://www.deque.com/axe/))

**Test commands**

- Run all tests: `npm run tests`
- Run unit tests: `npm run test`
- Run unit tests with watcher: `npm run test -- --watch`
- Run E2E tests: `npm run test:e2e`
- Run A11y tests: `npm run test:a11y`

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

Build all apps for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run start --workspace="packages/<app-name>"
```

## Add a new application

Do the following steps to add a new application to this Monorepo.

1. Create a new directory under `packages/`
2. Depending on the tech stack, make sure that:
   - shared dependencies are configured in the top-level [package.json](./package.json)
   - the `tailwind.config.js` uses the top-level [tailwind.preset.js](./tailwind.preset.js)
   - the `tsconfig.json` extends the top-level [tsconfig.base.json](./tsconfig.base.json)
3. The new project needs at least:
   - a `package.json` which defines the project specific dependencies an implements the following scripts:
     - `build`: build the application for production
     - `test`: run unit tests
     - `test:e2e`: run e2e tests
     - `test:a11y`: run a11y tests
     - `tests`: run all tests
   - a `Dockerfile` which builds a Docker container from your application (and if needed a `Dockerfile.dockerignore`)
4. Add the application code. It should now be able to import shared components.
5. Before proceeding with the next step, make sure the infrastructure of the application is in place.
   Follow the steps in the [digitalcheck-apps-infra README.md](https://github.com/digitalservicebund/digitalcheck-apps-infra).
6. Add the new package to the list in the [pipeline.yml](./.github/workflows/pipeline.yml) workflow at the `build-and-deploy` step.
7. You are done! The new application will be build and deployed on commit.

## Contributing

🇬🇧
Everyone is welcome to contribute the development of the Digitalcheck applications. You can contribute by opening pull request,
providing documentation or answering questions or giving feedback. Please always follow the guidelines and our
[Code of Conduct](CODE_OF_CONDUCT.md).

🇩🇪
Jede:r ist herzlich eingeladen, die Entwicklung der Digitalcheck Applikationen mitzugestalten. Du kannst einen Beitrag leisten,
indem du Pull-Requests eröffnest, die Dokumentation erweiterst, Fragen beantwortest oder Feedback gibst.
Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT_DE.md).

## Contributing code

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

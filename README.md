# Digitalcheck Digital Touchpoint (DiTo)

[![Pipeline](https://github.com/digitalservicebund/remix-application-template/actions/workflows/pipeline.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/pipeline.yml)
[![Scan](https://github.com/digitalservicebund/remix-application-template/actions/workflows/scan.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/scan.yml)
[![Secrets Check](https://github.com/digitalservicebund/remix-application-template/actions/workflows/secrets-check.yml/badge.svg)](https://github.com/digitalservicebund/remix-application-template/actions/workflows/secrets-check.yml)

A digital touchpoint for the Digitalcheck: Digitaltaugliche Regelung erarbeiten.

## Prerequisites

The application requires a `.env` file with the following values configured. You can copy and rename the file `.env.example`, and if running locally shouldn't need to change many of the values there.

- `ENCRYPTION_KEY`: Key used to encrypt & decrypt sensitive content on the server.
- `UNLEASH_KEY`: Authorization key used for connecting to Unleash feature flag tool.

### Node.js

We aim to use the current active [LTS version of nodejs](https://nodejs.dev/en/about/releases/).
There is a `.node-version` file to simplify setup using [nodenv](https://github.com/nodenv/nodenv).

### Dependencies

Install the dependencies using npm.

```bash
npm install --ignore-scripts @strapi/blocks-react-renderer
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
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Testing

There are

- unit tests (using [Vitest](https://vitest.dev/)): `npm run test`
- end-to-end tests (using [Playwright](https://playwright.dev/docs/intro)): `npm run test:e2e`
- accessibility tests (using [Playwright](https://playwright.dev/docs/intro) and [Axe](https://www.deque.com/axe/)): `npm run test:a11y`
- run all tests: `npm run tests`

#### Snapshot Testing

This package supports snapshot testing via [Playwright](https://playwright.dev/docs/test-snapshots).

On the first run, `npm run test:snapshots` will create the snapshots for multiple different devices.
[playwright-snapshot.config.ts](./tests/playwright-snapshot.config.ts) contains the configuration for the snapshot tests.
On subsequent runs, new snapshots are compared to the existing ones.
If they match, the test will pass, otherwise it will fail and show the differences.

An examplory usecase would be to check that everything still looks the same after a refactoring. You could verify that the following way:

1. `npm run test:snapshots`
2. Make changes to the code or switch to a different branch / commit
3. `npm run test:snapshots`
4. If the tests pass, you can be confident that the changes have not changed the UI

To update existing snapshots, execute `npm run test:update-snapshots`.

##### Considerations

- The snapshots currently only capture the static routes, not the dynamic routes like the PreCheck and result page. This could be improved in the future by adding a `afterEach` hook that takes a screenshot of the page after each e2e-test.
- The snapshots can be flaky, especially for Webkit/Safari. We are waiting for the `h1` element on each page to render and afterwards wait for 100ms additionally before taking the screenshot to account for layout shifts, but this might not be enough and images sometimes still render differently.
- Tablet-sized viewports are not part of the configuration at the moment, so be careful when making changes to the responsive layouts.

### Code quality checks (linting & formatting)

The project uses [ESLint](https://eslint.org/docs/latest/) for linting and [Prettier](https://prettier.io/docs/en/) for formatting.

#### Commands

- Check formatting: `npm run format:check`
- Autofix formatting issues: `npm run format:fix`
- Check lint: `npm run lint:check`
- Autofix lint issues: `npm run lint:fix`
- Check style (formatting & linting): `npm run style:check`
- Autofix style issues (formatting & linting): `npm run style:fix`

## Build for Production

Build all apps for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run start
```

## Deployment

### Docker

Build and run an app locally to simulate the production environment.

```sh
npm run docker
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/`
- `public/build/`

## Contributing

🇬🇧
Everyone is welcome to contribute the development of the Digitalcheck applications. You can contribute by opening a pull request,
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

Please make sure that your changes have been tested before submitting a pull request.

🇩🇪
Nach dem Erstellen eines Pull Requests wird dieser von einer Person aus dem Team überprüft. Wenn du einen Pull-Request
einreichst, erklärst du dich damit einverstanden, deinen Beitrag an den DigitalService und die Community zu
lizenzieren. Durch das Einreichen des Patches erklärst du dich damit einverstanden, dass deine Beiträge unter der
MIT-Lizenz lizenziert sind.

Bitte stelle sicher, dass deine Änderungen getestet wurden, bevor du einen Pull-Request sendest.

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

## Build & run via Docker

Build and run an app locally to simulate the production environment.

```sh
npm run docker # to build and run all apps
npm run docker:<app-name>
```

## Add a new application

Do the following steps to add a new application to this Monorepo.

1. Create a new directory under `packages/`
2. Depending on the tech stack, make sure that:
   - shared dependencies are configured in the top-level [package.json](./package.json)
   - the `tailwind.config.js` uses the top-level [tailwind.preset.js](./tailwind.preset.js)
   - the `tsconfig.json` extends the top-level [tsconfig-base.json](./tsconfig-base.json)
3. The new project needs at least:
   - a `package.json` which defines the project specific dependencies an implements the following scripts:
     - `build`: build the application for production
     - `test`: run unit tests
     - `test:e2e`: run e2e tests
     - `test:a11y`: run a11y tests
     - `tests`: run all tests
   - a `Dockerfile` which builds a Docker container from your application (and if needed a `Dockerfile.dockerignore`)
     - also add your service to the [docker-compose.yml](./docker-compose.yml) file
4. Add the application code. It should now be able to import shared components.
5. Before proceeding with the next step, make sure the infrastructure of the application is in place.
   Follow the steps in the [digitalcheck-apps-infra README.md](https://github.com/digitalservicebund/digitalcheck-apps-infra).
6. Update the [pipeline.yml](./.github/workflows/pipeline.yml) by copying an existing filter in the job `changes` and substituting the new application name.
7. You are done! The new application will be build and deployed on commit.

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

---

# Digitalcheck Digital Touchpoint

A digital touchpoint for the Digitalcheck. Digitaltaugliche Regelung erarbeiten.

## Prerequisites

!!! See prerequisites section in the top-level README.md.

The application requires a `.env` file with the following values configured. You can copy and rename the file `.env.example`, and if running locally shouldn't need to change many of the values there.

- `ENCRYPTION_KEY`: Key used to encrypt & decrypt sensitive content on the server.
- `UNLEASH_KEY`: Authorization key used for connecting to Unleash feature flag tool.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

Build and run the app in production mode:

```sh
npm run build
npm start
```

### Docker

The project includes a Dockerfile to create a Docker image for the project.

Because we are using a monorepo, there are a few caveats to be aware of. The application relies on components within a shared package, so the most straightforward way is to run docker commands from the root of the application.

For convenience, an interactive script has been created in the root directory called `docker.sh`. From the root of the application, run it with the following command:

```sh
npm run docker
```

You will be prompted to select which app to build and run.

It can be annoying to constantly switch directories though, so for even more convenience the script accepts a parameter to pre-select the app to run. You can run the same command from above _from within the package directory of your app of choice_ and it will run the helper script with this parameter already set.

After running this command, the website is then available under http://localhost:3000

If you want to include any additional files during the build that are not in the `app` or `public` directories you need to add them to the `.dockerignore` file.

The pipeline GitHub Action includes a job to build the Docker Image and push it to GitHub Packages. This job is currently deactivated. To enable it you need to remove the `&& false` from the end of the `if` predicate of the `build-and-push-image` job.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/`
- `public/build/`

## Snapshot Testing

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

### Considerations

- The snapshots currently only capture the static routes, not the dynamic routes like the PreCheck and result page. This could be improved in the future by adding a `afterEach` hook that takes a screenshot of the page after each e2e-test.
- The snapshots can be flaky, especially for Webkit/Safari. We are waiting for the `h1` element on each page to render and afterwards wait for 100ms additionally before taking the screenshot to account for layout shifts, but this might not be enough and images sometimes still render differently.
- Tablet-sized viewports are not part of the configuration at the moment, so be careful when making changes to the responsive layouts.

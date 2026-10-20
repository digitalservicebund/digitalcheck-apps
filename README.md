# Digitalcheck Digital Touchpoint / Website (DiTo)

[![Pipeline](https://github.com/digitalservicebund/digitalcheck-dito/actions/workflows/pipeline.yml/badge.svg)](https://github.com/digitalservicebund/digitalcheck-dito/actions/workflows/pipeline.yml)
[![Scan](https://github.com/digitalservicebund/digitalcheck-dito/actions/workflows/scan.yml/badge.svg)](https://github.com/digitalservicebund/digitalcheck-dito/actions/workflows/scan.yml)

The website code for [_Digitalcheck: Digitaltaugliche Regelung erarbeiten_](https://digitalcheck.bund.de).
Built with [Astro](https://astro.build/) as a static site, with React for interactive parts (see [ADR 27](./doc/adr/0027-migrate-to-astro.md)).

## Setup

### 1. Node.js & Dependencies

We aim to use the current active [LTS version of nodejs](https://nodejs.dev/en/about/releases/). We use [mise](https://mise.jdx.dev/) to manage the runtimes and tools for development.

You need to have mise installed on your computer; see the [mise installation docs](https://mise.jdx.dev/installing-mise.html) for the available options.

Install the dependencies by [integrating mise into your shell](https://mise.jdx.dev/getting-started.html#activate-mise).

### 2. Git Hooks

The project uses [Lefthook](https://github.com/evilmartians/lefthook) to manage Git hooks. These hooks help ensure code quality and security before you commit and push.

To activate the hooks, run:

```bash
./run.sh init
```

The following hooks are configured in `lefthook.yml`:

- **On `git commit`**:
  - `commitlint`: Enforces [conventional commit messages](https://chris.beams.io/posts/git-commit/).
  - `lint`: Fixes and checks for linting errors in staged files.
  - `format`: Formats staged files using Prettier.
  - `talisman` & `gitleaks`: Scan for secrets and sensitive information in your commit.
- **On `git push`**:
  - `licenses-audit`: Verifies that dependency licenses comply with the project's policy.

### 3. Playwright Browsers

For end-to-end (E2E) and accessibility (a11y) testing with [Playwright](https://playwright.dev/docs/intro), you need to install the required browser binaries:

```bash
pnpm exec playwright install
```

## Staging-only Features

Unreleased features are shown on staging and locally, but hidden in production (see [ADR 28](./doc/adr/0028-stage-based-feature-flags.md)):

- **Parts of a page:** check `isProduction` from `src/config/stage.ts`.
- **Whole pages:** set `isStagingOnly: true` in the page's route metadata.

To release a feature, remove the check.

## Development

### Run Locally

Start the app in development mode. It will automatically rebuild assets when you change a file.

```sh
pnpm dev
```

### Testing

The project includes unit, end-to-end, and accessibility tests.

- Run unit tests (with [Vitest](https://vitest.dev/)): `pnpm test`
- Run end-to-end tests (with [Playwright](https://playwright.dev/)): `pnpm test:e2e`
- Run accessibility tests (with [Playwright](https://playwright.dev/docs/intro) & [Axe](https://www.deque.com/axe/)): `pnpm test:a11y`
- Run all tests sequentially: `pnpm tests`

#### Snapshot Testing

This package supports snapshot testing via [Playwright](https://playwright.dev/docs/test-snapshots) and [Vitest](https://vitest.dev/guide/snapshot.html). Snapshots are useful for verifying that UI components and layouts have not changed unexpectedly.

##### Playwright Snapshot Testing

The snapshot tests capture screenshots of static routes across different devices, as defined in `tests/playwright-snapshots.config.ts`.

- Create initial snapshots: `pnpm test:snapshots`. On the first run, this command generates the baseline snapshots.
- If you've made intentional changes and need to update the snapshots: `pnpm test:update-snapshots`.

> [!NOTE]
>
> - Snapshots currently only cover static routes, not dynamic ones.
> - Snapshot tests can sometimes be flaky, especially for Webkit/Safari, due to minor rendering differences.
> - Tablet-sized viewports are not currently included in the snapshot configuration.

##### Vitest Snapshot Testing

To create a component snapshot with Vitest, use `toMatchSnapshot()` in your test file. For example:

```ts
// In a test like src/components/global/Footer.spec.ts
const { html } = await renderToDOM(Footer as AstroComponentFactory);
expect(html).toMatchSnapshot();
```

To update failing snapshots, run all tests and press `u` in the interactive prompt, or use the update flag directly:

```sh
pnpm test -- -u
```

For more details, see the [Vitest Snapshot documentation](https://vitest.dev/guide/snapshot.html#updating-snapshots).

### Code Quality (Linting & Formatting)

The project uses [ESLint](https://eslint.org/docs/latest/) for linting and [Prettier](https://prettier.io/docs/en/) for formatting. It's recommended to set up the [Git Hooks](#2-git-hooks) to automate this process.

- Check formatting: `pnpm format`
- Autofix formatting issues: `pnpm format:fix`
- Check for linting errors: `pnpm lint`
- Autofix linting issues: `pnpm lint:fix`
- Check types: `pnpm typecheck`

## Build for Production

To build the application for production:

```sh
pnpm build
```

This creates a static site in the `dist/` directory.

To preview the production build locally:

```sh
pnpm preview
```

## Deployment

### Docker

You can build and run the application in a Docker container to simulate the production environment. The image serves the static build with nginx on http://localhost:8080.

```sh
pnpm docker:dev
```

Stop the container with `pnpm docker:stop`.

### DIY

The output of `pnpm build` in `dist/` is a static site that can be served by any web server.

## Contributing

🇬🇧
Everyone is welcome to contribute to the development of the Digitalcheck applications. You can contribute by opening a pull request,
providing documentation, answering questions, or giving feedback. Please always follow the guidelines and our
[Code of Conduct](CODE_OF_CONDUCT.md).

🇩🇪
Jede:r ist herzlich eingeladen, die Entwicklung der Digitalcheck Applikationen mitzugestalten. Du kannst einen Beitrag leisten,
indem du Pull-Requests eröffnest, die Dokumentation erweiterst, Fragen beantwortest oder Feedback gibst.
Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT_DE.md).

## Contributing Code

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

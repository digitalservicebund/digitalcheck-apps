# Digitalcheck Digital Touchpoint

A digital touchpoint for the Digitalcheck.

## Prerequisites

!!! See prerequisites section in the top-level README.md.

The application requires a `.env` file with the following values configured. You can copy and rename the file `.env.example`, and if running locally shouldn't need to change many of the values there.

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

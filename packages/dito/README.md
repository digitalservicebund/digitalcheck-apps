# Digitalcheck Digital Touchpoint

A digital touchpoint for the Digtialcheck.

## Prerequisites

See prerequisites section in the top-level README.md.

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

The project includes a Dockerfile to create a Docker Image for the project.

You can build the Docker Image using

```sh
docker build -t remix-application-template .
```

and then start it using

```sh
docker run -d -p 3000:3000 --name remix-application-template remix-application-template
```

The website is then available under http://localhost:3000

If you want to include any additional files during the build that are not in the `app` or `public` directories you need to add them to the `.dockerignore` file.

The pipeline GitHub Action includes a job to build the Docker Image and push it to GitHub Packages. This job is currently deactivated. To enable it you need to remove the `&& false` from the end of the `if` predicate of the `build-and-push-image` job.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/`
- `public/build/`

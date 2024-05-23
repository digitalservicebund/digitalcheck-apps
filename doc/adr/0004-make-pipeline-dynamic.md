# 4. Make pipeline run dynamically for applications based on changes

Date: 2024-05-22

## Status

Accepted

## Context

The applications in this monorepo need to have a CI/CD pipeline. We could either use a simplistic global pipeline that always runs all checks, tests, builds and deployments for all applications or we could create a more modular pipeline that only runs these steps for apps whose code changed. A modular approach has the benefit of being faster and less resource intensive, but it is also more complex to set up.

During deployments, the [GitHub deployment action provided by the platform team](https://github.com/digitalservicebund/argocd-deploy) changes the image tag in [the respective infra repository](https://github.com/digitalservicebund/digitalcheck-apps-infra).
With our mono repo setup, this can lead to git conflicts arising due to the code being changed and pushed simultaneously, regardless of the chosen approach. This could be mitigated in the following ways:

- Running the application workflows in one pipeline sequentially. This would increase the time it takes to deploy all applications and won't help in the case of multiple pipelines being started.
- Making the GitHub action more parallelizable. However, we did not identify a clear cut solution to achieve this and also wanted to avoid touching the central action.
- Retrying the deployment step. This would only hide the problem and increase the time it takes to deploy all applications.
- Using [GitHub's concurrency groups](https://docs.github.com/en/actions/using-jobs/using-concurrency) to make sure only one deployment happens at a time. This creates a new problem: you can set workflows in groups to not cancel running workflows, but workflows that are pending (i.e. waiting for a workflow of the same group to finish) will still be canceled. This could lead to skipped deployments of apps if all apps were to use the same concurrency group. If they use different concurrency groups, deployments could still run simultaneously, leading to the same problem as before.

For the modular pipeline specifically, we identified several approaches that could be employed to only react to changes in specific applications:

- Using GitHub's [on.<push|pull_request|pull_request_target>.<paths|paths-ignore>](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore) and creating multiple pipeline files, one for each application (and possibly a shared file).
- Implementing a custom solution that filters the paths that changed and only runs the steps for the applications whose code changed.
- Using a third-party action that allows for more complex path filtering like [dorny/paths-filter](https://github.com/marketplace/actions/paths-changes-filter).

## Decision

We will build a modular pipeline that takes into consideration whose applications code changed. We will only run E2E tests, A11y tests, build and deployment steps for these applications. However, we will install dependencies, audit licenses, check format, lint, check types and run unit tests globally, as these steps are less time sensitive.

We will use a shared pipeline file that employs [dorny/paths-filter](https://github.com/marketplace/actions/paths-changes-filter) with application specific path filters. The output is used as part of a matrix strategy to run the steps for all applications whose code changed.

To mitigate the twofold issue of git conflicts and pending deployments being cancelled, we will implement a solution consisting of two parts described in the context:

- The matrix strategy will only allow for one deployment to run at a time, meaning deployments of a pipeline run are sequential and don't run into conflicts.
- We will use an app specific concurrency group to make sure that only one deployment runs at a time for each application. Cancellation of pending deployments for the same application in the case of pushes in quick succession is not an issue, as a deployment of a newer commit will be running.

## Consequences

The pipeline will be sped up and less resource intensive.

Adding new applications will only require adding a new filter in the shared pipeline file instead of a pipeline file for each application. We will include this setup in the README.

While the sequential matrix strategy assures that only one deployment of the same workflow runs at the same time, it does not prevent deployments of different workflows (sequential pushes/PRs) from running at the same time. This could lead to the same problem as before, but less frequently. We will also get notified of each failure and can retry the deployment manually.

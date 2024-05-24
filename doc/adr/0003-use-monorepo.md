# 3. Use a Monorepo for All Digitalcheck Applications

Date: 2024-05-23

## Status

Accepted

## Context

We have the option to organize the Digitalcheck codebase in one of three ways:

- a single repository that unifies all applications into one monolith
- a monorepo that keeps the applications somewhat separate but allows for shared dependencies and configuration
- leave each application separate in its own repository (polyrepo)

Each approach has distinct advantages and disadvantages that we need to consider:

### Unified Application

<table>
<tr>
<th> Pros </th>
<th> Cons </th>
</tr>
<tr>
<td>

- Clear-cut path for new developments with many decisions taken already
- Shared security setup
- Shared testing setup
- Shared build and deployment process

</td>
<td>

- We would need to rewrite the _tool finder_ in parts, as it uses React Router, while the _Digital Touchpoint_ uses Remix
- More complex routing when using a mixture of subdomains and nested paths
- Way less flexibility when adding new functionality with different technological requirements and also when removing or separating parts in the future
- Potentially larger bundle size (not that relevant)

</td>
</tr>
</table>

### Monorepo

The usual concerns of (large) monorepos such as sluggish performance, unrelatedness of projects or teams, notification spam etc. do not apply in our case.

<table>
<tr>
<th> Pros </th>
<th> Cons </th>
</tr>
<tr>
<td>

Compared to a polyrepo:

- Easier reuse of components and styles across applications
- Shared dependencies and versioning (less maintenance work)
- Less setup work for future applications
- Shared pipeline
- Consistent coding standards through base typescript, formatting and linting configurations
- Architecture iterations and refactorings can be done for all applications at once, we will thus update outdated code more likely

Compared to a single app:

- No need to rewrite the _tool finder_
- More flexibility to add new applications with separate technological requirements
- Easier to remove applications
- Better separation of concerns

</td>
<td>

- Extra work to setup the monorepo, not easily done and no template exists in DigitalService
- Increased complexity of development, build and deployment setup
- We might want to iterate on the component architecture and not reuse components
- A broken pipeline, main branch or shared code can affect all applications

</td>
</tr>
</table>

### Polyrepo

<table>
<tr>
<th> Pros </th>
<th> Cons </th>
</tr>
<tr>
<td>

- Clear-cut and proven setup process for applications
- Even better separation of concerns and possibility to retire applications
- Possibility to use completely different frameworks for different applications (which would negate the benefits of the monorepo approach to some extent)

</td>
<td>

- Components cannot be reused directly without extra effort (only copy-pasted or published as package)
- More maintenance work as we need to keep multiple repositories up to date, with all configurations, pipelines and dependencies this entails
- Might lead to less care for "old" apps and them falling out of date
- Could result in more work for setting up future apps as we need to start from scratch every time and take many decisions again

</td>
</tr>
</table>

## Decision

We will use a monorepo for Digitalcheck application code. This means that all Digitalcheck applications will live in the same single repository.

We will separate applications into different folders under `/packages`, each containing a separate application with an additional `/packages/shared` folder for shared components and utility functions.

We will use a shared pipeline setup for all applications.

We will provide base formatting and linting configurations on the root level that all applications will use.
We will not use [typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) as we are using vite to build the applications, but we we will still have a base typescript config that all projects will extend in their respective `tsconfig.json`s.

We use npm workspaces to manage dependencies and scripts across applications from a root `package.json` and install shared dependencies there.

We will have shared ADRs that apply to all applications in the monorepo as well as application specific ADRs.

We will deploy all applications using a shared setup on OTC to reduce organizational and technical overhead.

## Consequences

We will create a monorepo structure and migrate the existing _tool finder_ into the new repository.

We will reap the benefits described in the context section, such as easier reuse of components and styles, shared dependencies, less maintenance and consistent coding standards.

We will create a robust, shared CI/CD pipeline setup that is capable of deploying applications conditionally if their codebase was touched.
We thereby manage and mitigate the risk of pipeline issues.

We will establish clear guidelines for code structure and dependencies to reduce interference and maintain separation of concerns.

Overall, moving to a monorepo will streamline our development process, improve code reuse, and reduce maintenance overhead, making it the best choice for our organization at this time.

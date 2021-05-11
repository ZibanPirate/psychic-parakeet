# psychic-parakeet

Search movies from 2001 that has space in their title.

## Getting started

### Install dependencies:

i'm using [Yarn](https://yarnpkg.com/) on this repo, it is required because i'm using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

```sh
yarn
```

### Run it locally:

First, create an .env file in `./api` with the following content:

```conf
# API keys and auth tokens
OMDBAPI_API_KEY=6d936d4c
MANUAL_CRON_JOB_EXECUTION_TOKEN="some-custom-token"

# db env vars:
DB_URI="postgresql://test:test@localhost:6060/dev"
SEARCH_DB_URI="redis://localhost:5050/0"
```

To fire up both web server and api server locally, make sure you have link [docker](https://www.docker.com/) installed, then run:

```sh
yarn dev
```

then on the browser, go to http://localhost:8080 for frontend.

for api server, go to http://localhost:7070/docs which provides a swagger UI.

## Linting and Code Quality

for linting JS/TS files, i'm using [Eslint](https://eslint.org/) configured with [Typescript](https://www.typescriptlang.org/), for the rest of the files i'm using [prettier](https://prettier.io/)

to lint all files run:

```sh
yarn lint:check
```

to apply possible fixes, run:

```sh
yarn lint:fix
```

when committing, the code will be fixed automatically before it gets committed, thanks to [husky](https://typicode.github.io/husky) and [lint-staged](https://github.com/okonet/lint-staged).

### Tests and Test Coverage:

i'm using [Jest](https://jestjs.io/) for unit tests and code coverage.

to run tests, run

```sh
yarn test
```

to run tests with coverage, run

```sh
yarn test:cov
```

coverage data is stored in `./api/coverage` and `./web/coverage` directories

to run e2e tests, run

```sh
cd api && yarn test:e2e && cd ..
```

## CI/CD

CI pipelines are configured to run only the needed tests (unit tests with code coverage and e2e tests) on each Pull Request and requires them to pass before merging.

Check the PRs tab to see how is this project built over time (a PR per feature)

Also, planning to deploy it to parakeet.zakiii.com whenever i have time

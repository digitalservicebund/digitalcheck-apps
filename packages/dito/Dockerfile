# Download and install the dependencies for building the app
FROM 22.4.1-alpine3.20 AS build-dependencies

WORKDIR /src
COPY package*.json ./
COPY packages/dito/package.json packages/dito/
COPY packages/shared/package.json packages/shared/
RUN npm ci

# Download and install the dependencies for running the app
FROM 22.4.1-alpine3.20 AS production-dependencies

ENV NODE_ENV production
WORKDIR /src
COPY package*.json ./
COPY packages/dito/start.sh packages/dito/
COPY packages/dito/package.json packages/dito/
COPY packages/shared/package.json packages/shared/
RUN npm ci

# Build the app
FROM 22.4.1-alpine3.20 AS build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /src

# Copy the build dependencies
COPY --from=build-dependencies /src/node_modules /src/node_modules

# Required files are whitelisted in dockerignore
COPY . ./
RUN npm run build --workspace packages/dito

# Final image that runs the app
FROM node:22.1.0-alpine3.18

USER node
ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

ARG UNLEASH_KEY
ENV UNLEASH_KEY=$UNLEASH_KEY

WORKDIR /home/node/src
# Move only the files to the final image that are really needed
COPY --chown=node:node package*.json LICENSE SECURITY.md ./
COPY --chown=node:node packages/dito/package.json packages/dito/
COPY --chown=node:node --from=production-dependencies /src/node_modules/ ./node_modules/
COPY --chown=node:node --from=production-dependencies /src/packages/dito/start.sh packages/dito/
COPY --chown=node:node --from=build /src/packages/dito/build/ ./packages/dito/build/
# We need to explicitly bring in the public folder here, so that dynamic PDF generation can happen on the server 
COPY --chown=node:node --from=build /src/packages/dito/public/ ./packages/dito/public/

EXPOSE 3000
CMD ["sh", "packages/dito/start.sh"]


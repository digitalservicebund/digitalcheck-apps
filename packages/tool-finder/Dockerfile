FROM node:22.1.0 AS build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /src
# NOSONAR Required files are whitelisted in dockerignore
COPY . ./
RUN npm ci --ignore-scripts && npm run build --workspace packages/tool-finder && npm prune --production --workspace packages/tool-finder

FROM nginxinc/nginx-unprivileged:1.25.5-alpine3.19

COPY packages/tool-finder/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/packages/tool-finder/dist /usr/share/nginx/html

EXPOSE 8080

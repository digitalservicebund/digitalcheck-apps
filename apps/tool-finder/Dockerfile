FROM node:20.11.1 AS build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /src
# NOSONAR Required files are whitelisted in dockerignore
COPY . ./
RUN npm ci --ignore-scripts && npm run build && npm prune --production

FROM nginxinc/nginx-unprivileged:1.25.4-alpine3.18

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 8080

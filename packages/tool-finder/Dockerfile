FROM node:22.1.0 AS build

# Create app directory
WORKDIR /src
# Copy root level files and shared
COPY package.json package-lock.json tailwind.preset.js tsconfig-base.json ./
COPY packages/shared/ packages/shared/

# Copy tool-finder files
COPY packages/tool-finder/src/ packages/tool-finder/src/
COPY packages/tool-finder/index.html packages/tool-finder/nginx.conf packages/tool-finder/package.json packages/tool-finder/postcss.config.js packages/tool-finder/tailwind.config.ts packages/tool-finder/tsconfig.json packages/tool-finder/vite.config.ts packages/tool-finder/
RUN npm ci --ignore-scripts && npm run build --workspace packages/tool-finder && npm prune --production --workspace packages/tool-finder

FROM nginxinc/nginx-unprivileged:1.25.5-alpine3.19

COPY packages/tool-finder/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/packages/tool-finder/dist /usr/share/nginx/html

EXPOSE 8080

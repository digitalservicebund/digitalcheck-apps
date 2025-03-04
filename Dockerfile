# Download and install the dependencies for building the app
FROM node:22.4.1-alpine3.20 AS build-dependencies

WORKDIR /src
COPY ./package.json package-lock.json /src/
RUN npm ci --ignore-scripts

# Download and install the dependencies for running the app
FROM node:22.4.1-alpine3.20 AS production-dependencies

ENV NODE_ENV=production
WORKDIR /src
COPY ./package.json package-lock.json /src/
RUN npm ci --ignore-scripts

# Build the app
FROM node:22.4.1-alpine3.20 AS build

# Create app directory
WORKDIR /src

# Copy the build dependencies
COPY --from=build-dependencies /src/node_modules node_modules/

# Copy root level files
COPY package.json package-lock.json tailwind.config.js tsconfig.json postcss.config.js vite.config.ts ./
COPY app/ app/
COPY public/ public/

RUN npm run build

# Final image that runs the app
FROM node:22.4.1-alpine3.20

ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm

WORKDIR /home/node/src
# Move only the files to the final image that are really needed
COPY package.json package-lock.json ./
COPY --from=production-dependencies /src/node_modules/ ./node_modules/
COPY --from=build /src/build/ ./build/
# We need to explicitly bring in the public folder here, so that dynamic PDF generation can happen on the server 
COPY --from=build /src/public/ ./public/

# Ensure the node user owns all files in the working directory
RUN chown -R node:node /home/node/src

# Switch to non-root user
USER node

EXPOSE 3000

CMD ["npm", "run", "start"]

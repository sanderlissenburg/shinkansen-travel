# DEV STEP
FROM node:11-alpine as dev

ENV NODE_ENV developement

WORKDIR /app

COPY package.json yarn.lock tsconfig.json /app/

RUN yarn && yarn cache clean

COPY . /app

# BUILD STEP
FROM node:11-alpine as build

WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock tsconfig.json /app/

COPY . /app

RUN yarn && yarn cache clean

RUN yarn run build

# PROD STEP
FROM node:11-alpine as prod

WORKDIR /app

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules

CMD ["yarn", "run", "prod"]
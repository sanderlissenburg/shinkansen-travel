# DEV STEP
FROM node:11-alpine as dev

ENV NODE_ENV developement

WORKDIR /app

COPY package.json package-lock.json tsconfig.json /app/

RUN npm install && npm cache clean --force

COPY . /app

# BUILD STEP
FROM node:11-alpine as build

WORKDIR /app

ENV NODE_ENV production

COPY package.json package-lock.json tsconfig.json /app/

COPY . /app

RUN npm install && npm cache clean --force

RUN npm run build

# PROD STEP
FROM node:11-alpine as prod

WORKDIR /app

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules

CMD ["npm", "run", "prod"]
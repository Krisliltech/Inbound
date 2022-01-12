FROM node:16-alpine AS BUILD
WORKDIR /tmp/compilation
COPY . .
RUN yarn
RUN yarn tsc

FROM node:16-alpine AS INSTALL
WORKDIR /tmp/install
COPY ./package.json .
RUN yarn install --production

FROM node:16-alpine AS APP
WORKDIR /apps/microservice1
COPY --from=BUILD /tmp/compilation/dist ./dist
COPY --from=INSTALL /tmp/install/node_modules ./node_modules
COPY package.json package.json
COPY prisma prisma
COPY .env .env
EXPOSE 3000
CMD ["yarn", "start"]





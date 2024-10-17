# syntax=docker/dockerfile:1-labs

FROM node:20-alpine AS build
WORKDIR /usr/src/dev
COPY --exclude=node_modules --exclude=dist . .
RUN npm install
RUN npm run build

FROM build
ENV PORT=3001
WORKDIR /usr/src/app
COPY --from=build /usr/src/dev/dist ./dist
COPY --from=build /usr/src/dev/schema.gql .
COPY --from=build /usr/src/dev/package*.json .
RUN npm install --production
RUN rm -rf /usr/src/dev

EXPOSE 3001
CMD ["npm", "run", "start:prod"]

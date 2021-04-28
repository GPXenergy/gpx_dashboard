### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:16.0-alpine3.11 as builder

## Storing node modules
RUN mkdir -p /gpx
WORKDIR /gpx

COPY . /gpx
RUN npm ci

RUN npm run build-prod


### STAGE 2: Setup ###

FROM nginx:1.16.1-alpine

## Copy nginx configs (no conditional copy in docker, so copy both and delete one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /gpx/dist/gxp-dashboard /usr/share/nginx/html

## EXPOSE port 4200
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]

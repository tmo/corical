FROM node:15-alpine AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn --frozen-lockfile

COPY . /app

RUN yarn build

FROM nginx:1.19 AS serve

COPY --from=build /app/build/ /usr/share/nginx/html/

# url rewriting
RUN sed -i "s/index  index.html index.htm;/try_files \$uri \$uri\/ \/index.html;/g" /etc/nginx/conf.d/default.conf

CMD nginx -g "daemon off;"

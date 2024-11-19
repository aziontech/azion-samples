ARG NODE_VERSION=22.2.0
ARG NPM_REGISTER=https://registry.npmjs.org

# Builder
FROM node:$NODE_VERSION-bookworm AS builder
WORKDIR /app
ARG NPM_REGISTER
COPY . ./
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm -v \
    && npm config set registry $NPM_REGISTER \
    && npm install -g pnpm \
    && pnpm -v \
    && pnpm config set registry $NPM_REGISTER \
    && pnpm install \
    && pnpm build

# Nginx Server
FROM nginx:1.25.5-alpine3.19-slim
WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/docs/.vuepress/dist/ ./
RUN echo "<script>window.location.href = '/vuepress-solid-template/'</script>" > /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

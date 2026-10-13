ARG NPM_REGISTER=https://registry.npmjs.org

# Builder — node:22.2.0-bookworm, pinned by digest
FROM node@sha256:a723b54c35a76e947095a20a67d39585bb09c862e6b1adeb8a9f518f95e34fb0 AS builder
WORKDIR /app
ARG NPM_REGISTER
COPY . ./
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# pnpm comes from corepack at the version in package.json "packageManager",
# rather than an unpinned `npm install -g pnpm`.
RUN corepack enable \
    && corepack prepare --activate \
    && pnpm -v \
    && pnpm config set registry $NPM_REGISTER \
    && pnpm install \
    && pnpm build

# Nginx Server — nginx:1.25.5-alpine3.19-slim, pinned by digest
FROM nginx@sha256:abe47724e466aeab9a345d8e46a221c2fa8953c7848bb4a3bd9976a7199f8cf2
WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/docs/.vuepress/dist/ ./
RUN echo "<script>window.location.href = '/vuepress-solid-template/'</script>" > /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

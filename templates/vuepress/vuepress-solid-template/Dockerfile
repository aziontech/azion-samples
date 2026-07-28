ARG NPM_REGISTER=https://registry.npmjs.org

# Builder — node:22.2.0-bookworm, pinned by digest
FROM node@sha256:a8ba58f54e770a0f910ec36d25f8a4f1670e741a58c2e6358b2c30b575c84263 AS builder
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
FROM nginx@sha256:22414422d1ba07234d9b784f6453b4f150c0fa573ad0b62e163da12b68488ae1
WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/docs/.vuepress/dist/ ./
RUN echo "<script>window.location.href = '/vuepress-solid-template/'</script>" > /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm run build

# build production image

FROM node:18-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app && chmod -R 755 /app

RUN pnpm add pm2

COPY ecosystem.config.js .

USER node

EXPOSE 5513

CMD ["pnpm", "exec", "pm2-runtime", "ecosystem.config.js"]
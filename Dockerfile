# Pomodoro Timer - Dockerfile
# Next.js 16 + pnpm + Turbopack対応

# ベースイメージ（Node.js 20）
FROM node:20-alpine AS base

# 作業ディレクトリを設定
WORKDIR /app

# pnpmのインストール
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# 依存関係のインストールステージ
FROM base AS deps

# package.jsonとpnpm-lock.yamlをコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ビルドステージ
FROM base AS builder

# 依存関係を前のステージからコピー
COPY --from=deps /app/node_modules ./node_modules

# アプリケーションのソースをコピー
COPY . .

# Next.jsのテレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED=1

# Next.jsビルド実行
RUN pnpm build

# 本番実行ステージ
FROM base AS runner

# 本番環境設定
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# グループとユーザーを作成（セキュリティのため）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# publicディレクトリをコピー
COPY --from=builder /app/public ./public

# Standaloneビルド対応（Next.js 16のoutput: 'standalone'使用時）
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 通常のビルド（standalone未使用時）
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# nextjsユーザーに切り替え（セキュリティのため非rootで実行）
USER nextjs

# ポート3000を公開
EXPOSE 3000

# アプリケーション起動
CMD ["pnpm", "start"]

# Pomodoro Timer

Next.js 16 + TypeScript + TailwindCSS 4 で構築したモダンなポモドーロタイマーアプリ

## 🚀 技術スタック

- **Framework**: Next.js 16 (App Router + Turbopack)
- **言語**: TypeScript 5.9
- **スタイリング**: TailwindCSS 4
- **状態管理**: Zustand 5 (persist middleware)
- **テスト**: Vitest 2 + React Testing Library
- **パッケージマネージャー**: pnpm 9

## ✨ 機能

### 実装済み（Phase 2まで）

- ✅ ポモドーロタイマー（25分 Focus / 5分 Short Break / 15分 Long Break）
- ✅ サークル型プログレスバー
- ✅ セッション進捗表示（ドット + サイクルカウント）
- ✅ モダンなUIデザイン（PCブラウザ対応）
- ✅ ローカルストレージによる状態永続化
- ✅ 147テスト（全テスト通過）

### 今後実装予定

- ⬜ タスク管理機能（Phase 3）
- ⬜ PWA対応（Phase 4）
- ⬜ 統計・設定・通知機能（Phase 5）

## 📦 セットアップ

### 前提条件

- Node.js 20.9.0以上
- pnpm 9.0.0以上

### ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（Turbopack）
pnpm dev

# ブラウザで開く
open http://localhost:3000
```

### テスト

```bash
# 全テスト実行
pnpm test

# テストカバレッジ
pnpm test:coverage

# テストUI（ブラウザ）
pnpm test:ui
```

### ビルド

```bash
# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## 🐳 Docker開発環境

### 前提条件

- Docker Desktop がインストール済みで起動していること
- Docker Compose が利用可能であること

### 開発環境（ホットリロード対応）

```bash
# コンテナ起動
docker-compose up

# バックグラウンド起動
docker-compose up -d

# ログ確認
docker-compose logs -f app

# ヘルスチェック確認
docker-compose ps

# コンテナ停止
docker-compose down

# コンテナとボリューム削除（完全クリーンアップ）
docker-compose down -v
```

ブラウザで http://localhost:3000 にアクセス

**特徴:**

- ✅ ホットリロード対応（ソースコード変更時に自動更新）
- ✅ ヘルスチェック機能（30秒ごとに状態確認）
- ✅ リソース制限（CPU: 2コア、メモリ: 2GB上限）
- ✅ 自動再起動（unless-stopped）

### 本番ビルド

```bash
# イメージビルド（マルチステージビルド）
docker build -t pomodoro-timer .

# コンテナ起動
docker run -p 3000:3000 pomodoro-timer

# 本番環境変数を指定して起動
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOSTNAME=0.0.0.0 \
  pomodoro-timer
```

### トラブルシューティング

**Docker Daemonが起動していない**

```
Cannot connect to the Docker daemon at unix:///...
```

→ Docker Desktop を起動してください

**ポート3000が既に使用中**

```
Error: bind: address already in use
```

→ docker-compose.yml の ports を変更（例: `3001:3000`）

**コンテナが起動しない**

```bash
# ログ確認
docker-compose logs app

# イメージを再ビルド
docker-compose build --no-cache

# 完全リセット
docker-compose down -v
docker-compose up --build
```

## 📁 プロジェクト構造

```
pomodoro-nextjs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # トップページ
├── components/              # Reactコンポーネント
│   └── timer/              # タイマー関連コンポーネント
│       ├── CircularTimer.tsx
│       ├── TimerControls.tsx
│       └── SessionIndicator.tsx
├── stores/                  # Zustandストア
│   └── timer-store.ts      # タイマー状態管理
├── lib/                     # ユーティリティ
│   ├── timer-utils.ts      # タイマー関連関数
│   ├── storage.ts          # ローカルストレージ
│   └── constants.ts        # 定数
├── types/                   # TypeScript型定義
│   ├── timer.ts
│   ├── task.ts
│   └── app.ts
├── __tests__/               # テスト
│   ├── unit/               # ユニットテスト
│   └── integration/        # 統合テスト
├── Dockerfile               # Docker設定
├── docker-compose.yml       # Docker Compose設定
└── README.md               # このファイル
```

## 🧪 テスト

- **ユニットテスト**: 77テスト
- **統合テスト**: 70テスト
- **合計**: 147テスト（全テスト通過）

TDD（Test-Driven Development）アプローチで開発

## 🎨 デザイン

- PCブラウザ向けモダンUI
- グラデーション＆シャドウ効果
- ホバー・アクティブアニメーション
- レスポンシブ対応

## 📝 ライセンス

MIT

## 👤 作成者

R-Tsukada

## 🔗 リンク

- [GitHub Repository](https://github.com/R-Tsukada/pomodoro-timer-task)
- [Live Demo](https://pomodoro-timer-task.vercel.app)

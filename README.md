# TODOアプリ

モダンで機能豊富なTODOアプリケーション

## 🚀 主要機能

- ✅ **基本的なタスク管理** - 追加、編集、削除、完了
- 🌙 **ダークモード** - システム設定検出とアニメーション付きトグル
- 📝 **インライン編集** - タスクテキストをクリックして編集
- 🔄 **ドラッグ&ドロップ** - タスクの並び替え
- 🎯 **フィルタリング** - ステータス、優先度、検索による絞り込み
- 💾 **ローカル保存** - ブラウザのlocalStorageで永続化
- 📱 **PWA対応** - オフライン動作、インストール可能
- 🎤 **音声入力** - Web Speech APIによる日本語音声認識
- 📊 **統計ダッシュボード** - 詳細な進捗分析と可視化
- ✨ **リッチアニメーション** - Framer Motionによる滑らかな動作

## 🛠 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **ドラッグ&ドロップ**: @dnd-kit
- **テスト**: Vitest + React Testing Library
- **開発手法**: Test-Driven Development (TDD)

## 💻 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- pnpm 10以上

### インストールと起動

```bash
# リポジトリをクローン
git clone https://github.com/ikura1/todo-app.git
cd todo-app

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

### 利用可能なコマンド

```bash
pnpm dev          # 開発サーバーの起動
pnpm build        # プロダクションビルド
pnpm start        # プロダクションサーバーの起動
pnpm lint         # ESLintの実行
pnpm test         # テストの実行
pnpm test:watch   # テストのウォッチモード
pnpm test:coverage # カバレッジ付きテスト
pnpm typecheck    # TypeScriptの型チェック
```

🤖 Generated with [Claude Code](https://claude.ai/code)

# GitHub Actions Workflows

このディレクトリには、プロジェクトの自動化に使用されるGitHub Actionsワークフローが含まれています。

## ワークフロー一覧

### 🚀 `deploy.yml` - デプロイメント
**トリガー**: `master`ブランチへのpush、手動実行
**目的**: GitHub Pagesへの自動デプロイ

**実行内容**:
1. **品質チェック** (`quality-check` job)
   - TypeScriptの型チェック
   - Biomeによるフォーマットチェック
   - Biomeによるlintチェック
   - Vitestによるテスト実行

2. **ビルド&デプロイ** (`build` job)
   - アプリケーションのビルド
   - GitHub Pagesへのデプロイ

### 🔍 `ci.yml` - 継続的インテグレーション
**トリガー**: `master`ブランチへのpush、Pull Request
**目的**: コード品質チェックとビルド検証

**実行内容**:
1. **品質チェック** (`quality` job)
   - TypeScriptの型チェック
   - Biomeによるフォーマット/lintチェック
   - Vitestによるテスト実行

2. **ビルド検証** (`build` job)
   - プロダクションビルドの実行

### 🎨 `code-quality.yml` - コード品質チェック
**トリガー**: Pull Request、`master`ブランチへのpush
**目的**: Biomeによる詳細なコード品質チェック

**実行内容**:
- Biomeフォーマットチェック（詳細なエラーメッセージ付き）
- Biome lintチェック（詳細なエラーメッセージ付き）
- 失敗時にPull Requestへ自動コメント

## 使用技術

- **Node.js**: v18
- **Package Manager**: pnpm
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **Type Checking**: TypeScript

## エラー対応

### フォーマットエラー
```bash
pnpm run format:fix
```

### Lintエラー
```bash
pnpm run lint:fix
```

### 両方を一括修正
```bash
pnpm run check:fix
```
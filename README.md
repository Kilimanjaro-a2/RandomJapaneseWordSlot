# RandomJapaneseWordSlot

日本語のひらがなで書かれた3文字の単語を揃えるスロットゲームです。

## 概要

簡易的なスロットゲームのようなアプリケーションです。
画面には3つのリールとそれらに対応したボタンが3つと、ゲームスタートボタンが1つ存在します。

## 遊び方

1. 「スタート」ボタンを押すとスロットが回り始めます
2. リールに対応したボタンを押すとそのリールが止まります
3. 見事事前に設定された3文字の単語（目標：「ありが」）を揃えることができたらゲームクリアとなります

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## ゲームの設定

目標単語は `app/SlotGame.tsx` の `TARGET_WORD` 定数で変更できます。

```typescript
const TARGET_WORD = 'ありがとう'.slice(0, 3); // "ありが"
```

任意の3文字のひらがな単語に変更可能です。
# G & A — ありがとうサイト（式後公開用）

結婚式のあとに公開する「Thank You」ページです。
ゲスト用サイトと同じ URL（https://gen1219.github.io/m-guest/ ）で公開されるので、
席次表などに印刷した QR コードはそのまま使えます。

## 公開を切り替える

```bash
# 式後：ゲスト用サイト → ありがとうサイト（このブランチを push するだけ）
git push origin thanks

# いつでも：ゲスト用サイト（main）に戻す
gh workflow run deploy.yml --repo GeN1219/m-guest --ref main
```

切り替え後、`memory/` など元のページの URL には 404.html が
「公開を終了しました」と案内し、このページへ誘導します。

## 写真を載せる

`index.html` の末尾にある `CONFIG` を編集して push してください。

```js
const CONFIG = {
    heroPhoto: 'pic/wedding/hero.jpg',   // ヒーロー背景（null なら文字だけ）
    photos: [                            // ギャラリー
        'pic/wedding/001.jpg',
    ],
    shareUrl: 'https://wedding-photos.gensen4631.workers.dev',  // 設定済み
};
```

写真は `pic/wedding/` を作って置きます（長辺1600px程度の JPEG に変換してから）。

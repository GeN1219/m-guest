# G & A — ゲスト用サイト

結婚式にお越しいただく方にご覧いただくサイトです。
公開先: https://gen1219.github.io/m-guest/

## ⚠ このリポジトリは直接編集しません

本体サイト [`m-cla`](https://github.com/GeN1219/m-cla) から自動生成しています。
本体を更新したあと、m-cla で次を実行すると、このリポジトリの中身が作り直されます。

```bash
./build-guest.sh
cd ../m-guest && git add -A && git commit -m "更新" && git push
```

本体との違いは **letter.html（妻へのレター）を含まない** ことだけです。

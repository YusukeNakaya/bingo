## DEMO

https://all-you-need-is-bingo.netlify.com/

**注意：抽選を開始すると音が出ます。**

## 抽選

1〜9、または0キーを押すと、それぞれの数字に対応した数（0キーは10名）が抽選されます。

1キー（1名抽選）のみ、抽選演出が一段階多い仕様です。

なお、抽選時にドラムロールの音が流れます。

## 当選画面から戻る

当選画面でエンターキーを押すと最初に戻ります。

## 重複当選防止

一度当選した方は、当選リストがクリアされるまで当選されません。

また、当選リストデータは localStorage でブラウザに維持され、リロードしても継続します。

Chrome のデベロッパーツールなどで、当選ログを確認できます。

## 当選リストのクリア

- 抽選前に、抽選数 + 当選リスト合計数が総メンバー数を超える場合、当選リストをクリアします。
- z キーを押すと強制的に当選リストをクリアします。画面右下に「リセット」の文字が一定時間、浮かび上がります。

**注意：動作テスト後は、必ず z キーで初期化を行ってください** 。

## 使い方

- データをダウンロード
- member.js を参考値に従って書き換える
  - id: 画像名
  - name: 表示名
  - escape パラメータを付与すると、抽選画面には登場するが当選からは除外される（イベント企画者など）
- 画像を img フォルダに入れる
  - member.js の id に従った命名規則

## ライセンス

MIT

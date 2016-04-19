# try-sprites
CSSスプライトを自動生成するにあたり、[`gulp.spritesmith`](https://www.npmjs.com/package/gulp.spritesmith)と[`postcss-sprites`](https://www.npmjs.com/package/postcss-sprites)を使い比べてみた。

## setup
* node 4.4.2
* npm 3.8.5

```
npm install
npm run build
```

## gulp.spritesmith
* spritesmithのgulpプラグイン
* 指定した画像ディレクトリの内容を元にスプライト画像とSCSSのパーシャルファイルを生成する
* そのため、Sassのコンパイルより前に処理する必要があり、パーシャルファイルのimportも行わなければならない

## postcss-sprites
* postcssからspritesmithを使うプラグイン
* css/SCSSファイル内のbackground-image指定を元にスプライト画像を生成する
* 出力されるCSSのbackground-image指定自体を書き換えるため、パーシャルファイルのimportなどは必要ない

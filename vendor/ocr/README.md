# 同梱OCR・画像処理ライブラリ

アプリから画像を外部に送らず、同一GitHub Pages配信元だけから遅延読み込みします。提供されたカード写真は同梱していません。

| 同梱物 | 固定した配布元 | ライセンス |
|---|---|---|
| tesseract.min.js / worker.min.js | tesseract.js 6.0.1 npmパッケージ | Apache-2.0 / tesseract-LICENSE.md |
| tesseract-core-*-lstm.wasm(.js) | tesseract.js-core 6.0.0 npmパッケージ | Apache-2.0 / core-LICENSE |
| opencv.js | @techstark/opencv-js 4.10.0-release.1 npmパッケージ | Apache-2.0 / opencv-LICENSE |
| jpn.traineddata | naptha/tessdata gh-pages, 4.0.0_best_int/jpn.traineddata.gz を展開 | Apache-2.0 |
| eng.traineddata | tesseract-ocr/tessdata_fast main, eng.traineddata | Apache-2.0 |

取得日2026-09-30。各配布ファイルのSHA-256をmanifest.jsonに固定し、実行時に最新版を取得する仕組みは使いません。日本語・英語モデルにも同梱のApache-2.0ライセンスが適用されます。

参考：[Tesseract.jsのローカル配信](https://github.com/naptha/tesseract.js/blob/master/docs/local-installation.md)、[Tesseract言語モデル](https://github.com/tesseract-ocr/tessdata_fast)、[日本語モデル配布](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0_best_int)、[OpenCV.jsパッケージ](https://github.com/TechStark/opencv-js)。

OpenCVの動的バインディングは専用Worker内で動かします。メインページにunsafe-evalは許可せず、WebAssembly用のwasm-unsafe-evalと同一サイトのWorkerだけを許可しています。TesseractのworkerPath/corePath/langPathも同一サイトに明示しています。

# 4次元多面体

[Webページ](https://takash1.github.io/polytope/)

## プログラムリスト

### Webブラウザ
- [4次元多面体のCG](polytope.html)

### Google Cardboard
- [regular600](cardboard/polytope_cb_regular600.html)
- [truncated600](cardboard/polytope_cb_truncated600.html)
- [rectified600](cardboard/polytope_cb_rectified600.html)
- [bitruncated](cardboard/polytope_cb_bitruncated.html)
- [rectified120](cardboard/polytope_cb_rectified120.html)
- [truncated120](cardboard/polytope_cb_truncated120.html)
- [regular120](cardboard/polytope_cb_regular120.html)

### Oculus
- [Virtual Reality](oculus/polytope_oc.html)


## ４次元の世界を覗いてみよう

- 4次元で正多面体にあたるものは6種類あります。
- 正600胞体は正4面体が600個，正120胞体は正12面体が120個からできています。
- このプログラムは，４次元図形の座標軸を一つ忘れさせて３次元で表現したものです。（射影といいます）
- [詳しい解説](http://www.i.h.kyoto-u.ac.jp/~tsuiki/600cell/)

## プログラムの概要
### polytope.html/polytope.js
ブラウザで４次元図形を見ることができます。

回転、拡大などができます。(switchCameraを押した後)

Chrome, Firefox推奨

| 操作                         | 動作                  |
|:----------------------------|:----------------------|
|マウス左ボタンを押しながらドラッグ|回転                    |
|マウスホイール                 |ズームインまたはズームアウト|
|マウス中ボタンを押しながらドラッグ|ズームインまたはズームアウト|
|マウス右ボタンを押しながらドラッグ|シーンをパンする          |
|右上GUI                      |その他の機能　　　　　　　　|


### polytope_oc.html/polyVR_oc.js
Oculusを用いてVR体験できます。

Firefox Nightlyを利用してください。

| 操作      | 動作          |
|:---------|:--------------|
| J, ↓     | 下に移動       |
| K, ↑     | 上に移動       |
| H, ←     | 左に移動       |
| L, →     | 右に移動       |
| N, PgUp  | 前に移動       |
| P, PgDn  | 奥に移動       |
| U, I     | X軸回転       |
| Y, O     | Y軸回転       |
| M, B     | Z軸回転       |
| Z        | 青色を消す/表示 |
| X        | 赤色を消す/表示 |
| C        | 黄色を消す/表示 |
| V        | 軸を表示/消す  |
| T, Space | 形状を変更     |

### polytope\_cb\_*.html/polyVR_cb.js
Google Cardboardで立体視できます。

Android端末でChromeを利用してください。
タップして全画面表示にしてCardboardから覗いてください。

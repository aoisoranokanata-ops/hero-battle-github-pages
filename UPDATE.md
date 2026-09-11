# 次回からの更新

このフォルダーは既存リポジトリをcloneしたGit作業フォルダーです。ZIPの再アップロードは不要です。

- リポジトリ：https://github.com/aoisoranokanata-ops/hero-battle-github-pages
- ブランチ：`main`
- 公開URL：https://aoisoranokanata-ops.github.io/hero-battle-github-pages/

アプリをこのフォルダーで編集し、確認後にPowerShellで実行します。

```powershell
.\update.ps1 -Message '対戦画面を改善'
```

スクリプトは変更をコミットして `git push origin main` を実行します。実行ポリシー等でスクリプトを使わない場合は、同じフォルダーで以下を実行できます。

```sh
git add --all
git commit -m "対戦画面を改善"
git push origin main
```

Push後は既存のGitHub Pages配信に反映されます。GitHubのActionsでデプロイ完了を確認してください。公開URLが同じなので配布済みQRコードも引き続き使えます。

別PC等から更新された場合は、作業前に変更を保存したうえで `git pull --ff-only` を実行してください。競合時は強制Pushせず、差分を確認します。

保存デッキ・試合はブラウザのlocalStorageです。公開URLのホスト名を変更したり、ブラウザデータを削除しない限り、同じブラウザの保存領域を利用します。個人の試合データをこのGitフォルダーへ保存・コミットしないでください。

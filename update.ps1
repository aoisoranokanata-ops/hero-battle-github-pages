param([string]$Message = 'Update hero battle')
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    $branch = git branch --show-current
    if ($LASTEXITCODE -ne 0 -or $branch -ne 'main') { throw 'mainブランチで実行してください。' }
    git add --all
    if ($LASTEXITCODE -ne 0) { throw '変更を登録できませんでした。' }
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        git commit -m $Message
        if ($LASTEXITCODE -ne 0) { throw 'コミットに失敗しました。' }
    } elseif ($LASTEXITCODE -ne 0) { throw '差分を確認できませんでした。' }
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw 'Pushに失敗しました。認証・接続・リモート側の変更を確認してください。強制Pushは行いません。' }
    Write-Host 'Push完了。GitHub Pagesの反映後、同じ公開URLから利用できます。'
} finally { Pop-Location }

<a id="contributing"></a>
# 貢献について

ViperMesh for Blender の改善にご協力いただきありがとうございます。

<a id="development"></a>
## 開発

要件:

- Node.js 20 以降
- Python 3.11 以降
- 実環境での互換性確認には Blender 5.2

```bash
npm install
npm run check
```

Blender の **Install from Disk** 手順で `addon/vipermesh-addon.py` をインストールし、ローカルブリッジを起動して、実環境でのテストのために `npm run mcp` を実行してください。

<a id="pull-requests"></a>
## プルリクエスト

- 変更の範囲を絞り、ユーザーから見える動作を説明してください。
- プロトコルやパッケージの変更には、適合性テストの対象を追加または更新してください。
- Blender の状態を変更する操作は、使い捨てのシーンでテストしてください。
- 認証情報、非公開のアセット一覧、ベンチマークの証拠、専有の ViperMesh 製品コードをコミットしないでください。
- 決定論的なツールを優先する設計を維持し、対象外の独自の作業には `execute_code` を利用できる状態にしてください。

可能な場合は、`feat(addon): add mesh validation` のような Conventional Commit 形式の件名を使用してください。

貢献することで、その貢献物に MIT ライセンスが適用されることに同意したものとします。

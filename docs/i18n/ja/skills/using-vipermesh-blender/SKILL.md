---
name: using-vipermesh-blender
description: 持続的な ViperMesh MCP コネクタを通じて Blender を操作します。シーンの検査、構造化された Blender の編集、検証、レンダリング、リギング、アニメーション、リトポロジー、アセット、エクスポートに使用します。
---

<a id="using-vipermesh-for-blender"></a>
# ViperMesh for Blender の使い方

エージェントのセッション全体で、単一の MCP サーバープロセスを使用してください。サーバーは MCP クライアントが起動します。個々の Blender 操作のために `npm`、`npx`、`tsx` や別のサーバープロセスを起動しないでください。

<a id="start-a-session"></a>
## セッションの開始

1. `bootstrap_vipermesh_session` を呼び出します。
2. 変更する前に既存のシーンの状態を検査します。
3. タスクの意味や不慣れな操作を明確にする必要がある場合は、`search_3d_guidance` を使用します。
4. レジストリ全体を読み込むのではなく、関連するカテゴリや検索語を指定して `list_blender_tools` を使用します。

意図した操作を表現できる場合は、決定論的なツールを優先してください。独自のジオメトリ、プロシージャルな効果、特殊なノードグラフなど、構造化ツールで十分に扱えない作業のために `execute_code` を利用できる状態にしておいてください。

入力がすでに分かっており、中間結果が次の判断を変えない場合に限り、操作を一括実行してください。意味のある段階の間に検査と修正の機会を残してください。

完了前に要求された出力を確認し、そのタスクで重要な関係を検証してください。ツールの呼び出しが成功したことや画像ファイルが正常であることは、品質の判定にはなりません。未解決の不具合を報告してください。要求された成果物だけを承認済みの場所に保存し、段階処理が制作者のカメラ、照明、構図を置き換えてしまう場合は、個別のツールを選んでください。

<a id="references"></a>
## 参考資料

- シーンの変更とライフサイクル: [references/scene-operations.md](references/scene-operations.md)
- 接触、向き、クリアランス: [references/spatial-validation.md](references/spatial-validation.md)
- カメラ、照明、プレビュー、受け入れ判定: [references/visual-presentation.md](references/visual-presentation.md)
- ジオメトリ、マテリアル、アセット: [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- キャラクター、アニメーション、エクスポート: [references/character-animation-export.md](references/character-animation-export.md)

これらの参考資料は役立つ手法や確認事項を示すものであり、必須の手順ではありません。ユーザーの目標、現在のシーン、使用中のレンダーエンジン、得られる証拠に合わせて調整してください。

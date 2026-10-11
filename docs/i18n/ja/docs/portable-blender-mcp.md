<a id="portable-blender-mcp-gateway"></a>
# ポータブル Blender MCP ゲートウェイ

<a id="result-review-and-existing-scenes"></a>
## 出力の確認と既存のシーン

画像を生成する呼び出しは、MCP サーバーのファイルシステム上に画像があり、サイズが最大 3 MiB の場合、PNG/JPEG を直接添付します。それ以外は、報告された成果物のパスを画像ビューアーで開いてください。`imageAttached` は転送可能であることを示し、`visualReviewRequired` は実際の出力をタスクに照らしてエージェントが判断する必要があることを示します。画像ファイルの正常性やコマンドの成功は、視覚的な品質の点数ではありません。

段階処理の補助機能は、任意の便利な操作です。最終処理で `preservePresentation:
true` を設定すると、現在のカメラ、照明、構図を保持できます。`blendPath` は任意であり、blend ファイルを保存せずレンダリングする場合は省略してください。最終処理での保存は、既存の保存先を拒否します。上書きが意図され、承認されている場合に限り、個別の保存操作を使用してください。明示的な `spatialRelations` は最終処理でも再検証され、失敗した関係がある場合は最終出力を提供しません。診断検査は任意のメッシュ接触を保証できないため、疑わしい箇所を状態の分かる角度から確認してください。

このポータブルゲートウェイは、信頼されたコーディングエージェントが標準 MCP stdio 通信で ViperMesh の Blender ツールを呼び出せるようにします。ローカルテストでフォールバック挙動を測るための `execute_code` も含まれます。

これは信頼できるローカル環境向けのコネクタです。認証付きクラウドサービスや商用利用権の管理は、公開アドオンと MCP パッケージの範囲外です。

<a id="execution-paths"></a>
## 実行経路

ポータブルゲートウェイは追加の機能です。

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

MCP サーバーは、ツール呼び出しごとに接続し直すのではなく、プロセスの寿命全体にわたって Blender のソケットを保持します。

<a id="requirements"></a>
## 要件

- Node.js と、このリポジトリのインストール済み依存関係。
- ViperMesh アドオンをインストールし、ローカルサーバーを起動した状態の Blender。
- `127.0.0.1:9876` で到達できるアドオン。ただし、`BLENDER_MCP_HOST` と `BLENDER_MCP_PORT` で上書きした場合を除きます。

リポジトリ内のローカルなツールスキル検索には、データベースや埋め込みの認証情報は不要です。

<a id="start-the-gateway"></a>
## ゲートウェイの起動

リポジトリのルートから実行します。

```bash
npm run mcp
```

プロセスは標準入力と標準出力を使い、MCP JSON-RPC で通信します。起動時の診断情報は標準エラー出力に書き出します。

<a id="coding-agent-configuration"></a>
## コーディングエージェントの設定

ビルドされたエントリーポイントを、リポジトリの絶対パスで指定してください。

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/vipermesh-blender/dist/public-portable-blender-mcp.js"
      ]
    }
  }
}
```

正確な設定場所はコーディングエージェントによって異なります。クライアントが MCP サーバーを動的に再読み込みしない場合は、登録後に再起動するか、新しいエージェントセッションを開いてください。Codex とクライアントの互換性については、[MCP クライアントの設定](client-setup.md)を参照してください。

<a id="available-mcp-tools"></a>
## 利用可能な MCP ツール

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` は、ViperMesh のツールレジストリにあるコマンドだけを受け付けます。本番向けのインターフェースとは異なり、この信頼されたローカルゲートウェイは `execute_code` を公開し、エージェントが自由形式の Blender Python に頼る場面をテストで把握できるようにしています。

リクエストの例:

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

使用できるコマンドとそのパラメーターの説明を調べるには、`list_blender_tools` を使用してください。

`call_blender_tool_batch` は、順序付きのコマンドを最大 32 件受け付け、既定では最初の応答失敗後に停止します。複数のプリミティブの作成や、独立した複数のマテリアル割り当てなど、すでに判断済みのまとまりに使用してください。次の操作が検査、接地、視覚的な確認に依存する地点をまたいで一括実行しないでください。

`run_blender_scene_stage` は、同じ持続的なソケットを使って、追加の簡潔な作業手順を提供します。

- `build` は、呼び出し元が渡した上限付きの構築バッチを実行します。
- `inspect_preview` は、接地と任意の名前付き空間関係を確認し、軽量プレビューの構図を設定してレンダリングし、成果物を検査します。
- `finalize` は、表示用のカメラを設定して検証し、検証に合格した場合に限りレンダリングと保存を行います。

各段階は別々に呼び出してください。エージェントは `inspect_preview` と `finalize` の間にプレビューを確認し、再検査前の修正には任意の個別 Blender ツールを使用できます。段階処理の応答は、コンテキストやトークンの負担を減らすため、完全な Blender の応答内容ではなく、簡潔な状態、件数、成果物のフィールドを意図的に返します。個別呼び出しと汎用の一括呼び出しも引き続き利用できます。

サーバーは必要時に開く Blender 接続を単一で保持し、すべての単独呼び出しと一括呼び出しをその接続で直列化します。Blender がソケットを閉じた場合は、次の呼び出しで再接続します。MCP ホストは `npm run mcp` をツールごとではなく、エージェントのセッションごとに一度起動してください。

<a id="agent-context"></a>
## エージェントのコンテキスト

このコネクタに不慣れなエージェントは、最初に必ず `bootstrap_vipermesh_session` を呼び出してください。Blender の接続を確認し、簡潔な操作コンテキストを返し、持続的なセッションモデルを示し、次の呼び出しを提案します。

`get_blender_agent_context` は、検査、ガイダンス検索、直接操作ツールの優先、上限付き一括実行、`execute_code` によるフォールバック、接地、視覚的な受け入れ判定について、公開された簡潔な操作規則を返します。非公開の ViperMesh 製品プロンプトやオーケストレーションは、このコネクタでは配布しません。

任意の MCP エージェントは、セッション開始時にプロファイルを読み込み、具体的なタスクについて `search_3d_guidance` を検索し、`list_blender_tools` は関連する機能カテゴリや検索語に絞って使用してください。たとえば、リトポロジー作業では、ポリゴン削減、ボクセルリメッシュ、QuadriFlow、独自のフォールバックコードを選ぶ前に、リポジトリ内のリメッシュとトポロジーのガイダンスを取得してください。

<a id="guidance-retrieval"></a>
## ガイダンスの取得

`search_3d_guidance` は、次に対応します。

- `source: "local"` は、`skills/using-vipermesh-blender/references` にある公開エージェントスキルの参考資料を決定論的に検索します。
- `source: "semantic"` は、設定済みの非公開 ViperMesh セマンティックアダプターを使用します。
- `source: "all"` は、両方を組み合わせます。

セマンティック検索は、非公開製品向けの任意のアダプターです。公開コネクタは、決定論的なローカルのツールスキル検索を同梱し、データベースや埋め込みの認証情報を必要としません。

`get_3d_guidance_document` は、`skills/using-vipermesh-blender/references` から Markdown のベース名を指定して読み込みます。任意のファイルシステムパスやディレクトリの遡及は拒否します。

スキルの参考資料は、機能、判断上のトレードオフ、検証の手法を説明します。一律のシーン制作手順ではなく、推奨事項です。非公開の ViperMesh RAG 資料群は、公開コネクタでは配布しません。

<a id="security-boundary"></a>
## セキュリティの境界

このローカルゲートウェイは、信頼できるワークステーションでの使用を想定しています。

- stdio を使い、追加のネットワークリスナーを開きません。
- Blender アドオンはループバックにバインドしたままにしてください。
- 信頼されたローカルのフォールバックテストのために、自由形式の Python 実行を公開します。
- サブスクリプションを強制したり、ローカルアドオンの実装を保護したりするものではありません。

将来の本番版では、プレミアムなオーケストレーション、非公開ガイダンス、プロバイダーへのアクセス、署名付き操作計画に、認証されたリモート ViperMesh 制御基盤を使用すべきです。ユーザーが制御するマシン上で動くソフトウェアを、ローカル認証だけで改変不能にすることはできません。

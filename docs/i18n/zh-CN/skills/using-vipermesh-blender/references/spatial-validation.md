<a id="spatial-validation"></a>
# 空间验证

<a id="read-world-space-state"></a>
## 读取世界空间状态

对象 origin 和 local dimensions 不能可靠替代已求值的 world-space bounds。Rotation、scale、parenting、modifiers 和 evaluated geometry 都可能改变重要表面。

当放置具有后果时，检查相关对象，并根据其 world-space bounds、attachment points 或实际 surface hits 进行推理。

<a id="express-the-intended-relationship"></a>
## 表达预期关系

选择与用户含义匹配的验证：

- `supported_by` 或 `on_top_of`，用于物理支撑
- facing 或 orientation relations，用于功能方向
- clearance checks，用于所需间隙
- containment checks，用于预期位于另一个对象内部的对象
- attachment-point alignment，用于必须精确相接的部件

像 "above" 这样的宽泛垂直排序并不能证明接触。干净的相机角度也不能证明对象已落地或不相交。

<a id="use-recommendations-not-fixed-layouts"></a>
## 使用建议，而不是固定布局

合理的比例、间距和朝向取决于资产、相机、动画、目标平台和艺术意图。当有用时，将参考尺寸或间隙范围作为起始证据，然后进行调整。

近距离放置后，从能揭示深度和接触的角度检查。在最终验收前修复悬空、意外穿透、功能方向反转和支撑错误。

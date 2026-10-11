<a id="geometry-materials-and-assets"></a>
# 几何、材质和资产

<a id="geometry-strategy"></a>
## 几何策略

根据请求的形态和下游用途选择方法：

- primitives 和 assembly tools，用于 blockout 和 hard-surface structures
- curves，用于 paths、cables、rails 和 profile-driven forms
- modifiers，用于可逆 repetition、smoothing、thickness 和 deformation
- retopology tools，用于 density reduction 或 topology conversion
- `execute_code`，用于缺少合适直接操作的自定义程序化几何

避免把某一种方法视为普遍更优。当破坏性转换会让迭代更困难时，请保留源几何。

<a id="materials"></a>
## 材质

使用结构化材质工具处理常见 Principled BSDF 和 texture 工作流。当结果不只用于预览时，检查 texture paths、color space、UV dependence 和 render-engine behavior。

材质值应响应预期材质、比例、灯光和 art direction。默认值和物理范围是有用参考，而不是覆盖有意风格化的理由。

<a id="assets"></a>
## 资产

在手动近似复杂对象前先搜索可复用资产，尤其是对象身份依赖详细几何时。尽可能通过 managed root 导入多对象资产，然后检查目标场景中的 bounds、scale、orientation 和 support。

资产匹配是候选项，不是自动接受。请验证其 license、style、topology、materials 和 functional direction 是否适合任务。

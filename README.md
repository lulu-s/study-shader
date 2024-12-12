# study-shader
shader 临摹学习随笔

## vscode 浏览
按 ctr/cmd + shift + P 输入 "show glsl preview"，回车

## 基础知识学习
* [Three.js 进阶之旅：Shader着色器入门](https://juejin.cn/post/7158032481302609950)
* [古柳的「Three.js Shader」教程](https://juejin.cn/column/7222305161368469541)


## ShaderToy中的内置变量

* vec2 iResolution 为整个屏幕的分辨率
* vec4 fragColor 为最终的像素颜色
* vec2 fragCoord 为像素坐标


## shader 内置函数

* abs(f) 绝对值
* fract(3 * n) 取小数部分。（分成N份，模除取小数）
* fwidth(p) p 在 x 和 y 方向上的偏导数的绝对值之和。插值，返回x的绝对值加上y的绝对值，[意思](https://www.zhihu.com/question/329521044)
* length(vec) 返回向量的长度 `公式 length(v) = √(v.x^2 + v.y^2 + v.z^2) `
* step(x, y) 如果x < y 返回1，否则返回0
* smoothstep(x, y, a) 如果a < x 返回0，如果a > y 返回1，如果x < a < y 返回一个平滑的值
* mix(x, y, a) 返回x和y的线性插值，a为0时返回x，a为1时返回y，a为0.5时返回x和y的平均值
* clamp(x, min, max) min < a < max 返回x，如果x小于min，返回min，如果x大于max，返回max
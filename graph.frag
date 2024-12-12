// 学习链接：
//  https://www.bilibili.com/video/BV1ua411k7DY/?spm_id_from=333.788&vd_source=ff19136feb3f59a460ff878321af5067

#define PI 3.1415926

// 上(0,1)(1,1)
// 下(0,0)(1,0)
// 将坐标转换为
// 某一边为 -1～0～1，另一边为 等比缩放的值
vec2 fixUv(in vec2 fragCoord) {
    // return (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    return 3.0 * (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y); // * 3 画布放大，图像所小，3倍？
}

// 基础图形

// 圆
// void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    //     // 1. 圆
    //     vec2 uv = fixUv(fragCoord);
    //     float c = 0.0;
    //     float r = 0.3;
    
    //     // if (length(uv) < r)  c = 1.0;
    //     c = step(length(uv), r); // 如果x < y 返回1，否则返回0
    
    //     fragColor = vec4(vec3(c), 1.0);
// }

// 线段
// https://www.bilibili.com/video/BV1oq4y1271G/?spm_id_from=333.999.0.0&vd_source=ff19136feb3f59a460ff878321af5067
float segment(in vec2 p, in vec2 a, in vec2 b, in float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); // 投影
    // return length(pa - ba * h);
    float len = length(ba * h - pa);
    // float f = 0.0;
    // if(len <= w){
        //     f = 1.0;
    // }
    // return f;
    return step(len, w); // len <= w ? 1.0 : 0.0;
}

// 公式图形化
float func(in float x) {
    float T = 3. + sin(iTime);
    return sin(2. * PI / T * x);
}

// 利用线段绘制公式
float funcPlot(in vec2 uv) {
    float f = 0.0;
    for(float x = 0.0; x <= iResolution.x; x += 1.0) {
        // 一个一个小格子画线段，放大画布就看不出了。
        float fx = fixUv(vec2(x, 0.0)).x; // 当前的
        float nfx = fixUv(vec2(x + 1.0, 0.0)).x; // 下一个
        f += segment(uv, vec2(fx, func(fx)), vec2(nfx, func(nfx)), fwidth(uv.x));
    }
    f = clamp(f, 0.0, 1.0);
    return f;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fixUv(fragCoord);
    vec3 color = vec3(0.0);
    
    // 1. 圆
    float c = 0.0;
    float r = 1.0;
    
    // if (length(uv) < r)  c = 1.0;
    c = step(length(uv), r); // 如果x < y 返回1，否则返回0
    // fragColor = vec4(vec3(c), 1.0);
    color += vec3(c);
    
    // 2. 线段
    
    // 方式1： 叠加颜色，但是会叠加计算
    // color += vec3(0.0, 0.6, 1.0) * vec3(segment(uv, vec2(-0.8), vec2(-0.4), fwidth(uv.x)));
    // 方式2：mix混合，不会叠加。根据 mix(x, y, a)条件使用，a为0时返回x，a为1时返回y，a为0.5时返回x和y的平均值
    color = mix(color, vec3(0.0, 0.6, 1.0), segment(uv, vec2(-1.8), vec2(1.8), fwidth(uv.x)));
    
    // 3. 曲线？
    color = mix(color, vec3(1.0, 1.0, 0.0), funcPlot(uv));
    
    // 颜色
    fragColor = vec4(color, 1.0);
    
}
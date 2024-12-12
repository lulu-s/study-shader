// 学习链接：
//  https://juejin.cn/post/7164635658084941837
//  https://www.bilibili.com/video/BV1ua411k7DY/?spm_id_from=333.788&vd_source=ff19136feb3f59a460ff878321af5067
// https://www.zhihu.com/question/329521044

#define PI 3.1415926

// 6. 封装坐标系网格，调优
vec2 fixUv(in vec2 fragCoord) {
    // return (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    return 3.0 * (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y); // 3倍？
}

vec3 Grid(in vec2 uv) {
    vec3 color = vec3(0.0);
    // vec2 fraction = fract(uv * 3.0); // n倍的uv，并且模除取小数，相当于将画布分成3份
    
    // fract(uv)  ->  0 ~ 1
    // fract(uv) - 0.5  ->  -0.5 ~ 0.5
    // 取绝对值 abs(fract(uv) - 0.5)  ->  0 ~ 0.5
    // 2 * abs(fract(uv) - 0.5)  ->  1 ~ 0 ~ 1
    // 1.0 - 2.0 * abs(fract(uv) - 0.5)  ->  0 ~ 1 ~ 0
    vec2 fraction = 1.0 - 2.0 * abs(fract(uv) - 0.5);
    
    // 2.0 * abs(fract(uv) - 0.5) 变化斜率 *2 ，2.0 * fwidth(N) 就也得 *2
    color = mix(color, vec3(0.5), step(abs(fraction.x), 2.0 * fwidth(uv.x)));
    color = mix(color, vec3(0.5), step(abs(fraction.y), 2.0 * fwidth(uv.y)));
    
    // 中心坐标线颜色调整
    color = mix(color, vec3(0.0, 1.0, 0.0), step(abs(uv.x), 2.0 * fwidth(uv.x)));
    color = mix(color, vec3(1.0, 0.0, 0.0), step(abs(uv.y), 2.0 * fwidth(uv.y)));
    
    return color;
}

// 线段函数
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
    return smoothstep(w, 0.95 * w, len); // len <= w ? 1.0 : 0.0;
    // return step(len, w); // len <= w ? 1.0 : 0.0;
}

// 公式图形化
float func(in float x) {

    // 一条斜线
    // return x;

    // sin曲线
    // float T = 3. + sin(iTime);
    // return sin(2. * PI / T * x);

    return smoothstep(0.0, 1.0, x);
}

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

// ShaderToy中输出像素颜色的函数，相当于main函数
// out 最终函数返回值 / fragColor 为最终的像素颜色
// in 传入的参数 / fragCoord 为像素坐标
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    
    // 1. 基础颜色
    // fragColor = vec4(0.0, 0.6, 1.0, 1.0);
    
    // 2. 根据uv坐标，设置颜色 / iResolution 为屏幕分辨率，基础原点(0,0)于左下角
    // vec2 uv = fragCoord.xy / iResolution.xy;
    // fragColor = vec4(uv, 0.0, 1.0); // 坐标系归一化 x:red(0-1), y:green(1-0)
    
    // 3. 正交坐标系，原点位于中心为(0,0)
    // fragCoord.xy / iResolution.xy 的范围处于 0 ~ 1之间， 减去0.5过后，范围变为了 -0.5 ~ 0.5，再乘上2，就将 uv 坐标转换到了 -1 ~ 1 之间了。
    // vec2 uv = (fragCoord.xy / iResolution.xy - 0.5) * 2.0;
    // fragColor = vec4(uv, 0.0, 1.0);
    // fragColor = vec4(vec3(0.0), 1.0); // 基础配色更改为黑
    
    // 使用每个像素的尺寸决定线宽，因为小于一个像素点的宽度，就会不显示
    // vec2 onePiexl = 1.0 * vec2(1.0) / iResolution.xy; // 倍率 * 每格大小（1 / 分辨率宽高==每个像素的大小）
    
    // 距离中心(0,0)越近，更改为白色
    // if (abs(uv.x) < onePiexl.x) { // 绝对值，仅保留正数
        //     fragColor = vec4(1.0);
    // }
    // else if (abs(uv.y) < onePiexl.y) {
        //     fragColor = vec4(1.0);
    // }
    
    // 4. 正交坐标系，绘制网格，并等比缩放
    // vec2 uv =  (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    // vec2 nuv = fract(uv * 3.0); // n倍的uv，并且模除取小数，相当于将画布分成3份
    
    // vec3 color = vec3(0.0); // 利用参数倒一手，避免一直使用 fragColor，颜色出问题。
    // if (abs(nuv.x) < fwidth(nuv.x)|| abs(nuv.y) < fwidth(nuv.y)) { // 绝对值，仅保留正数
        //     color = vec3(1.0);
    // }
    // // 中心坐标线颜色调整
    // if (abs(uv.x) < fwidth(uv.x)) { // 绝对值，仅保留正数
        //     color = vec3(0.0, 1.0, 0.0);
    // }
    // else if (abs(uv.y) < fwidth(uv.y)) {
        //     color = vec3(1.0, 0.0, 0.0);
    // }
    
    // // fragColor = vec4(nuv, 0.0, 1.0);
    // fragColor = vec4(color, 1.0);
    
    // 5. 减少 if else 的使用，使用 mix 函数
    // vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    // vec2 nuv = fract(uv * 3.0); // n倍的uv，并且模除取小数，相当于将画布分成3份
    
    // vec3 color = vec3(0.7); // 利用参数倒一手，避免一直使用 fragColor，颜色出问题。
    
    // color = mix(color, vec3(0.5), step(abs(nuv.x), fwidth(nuv.x)));
    // color = mix(color, vec3(0.5), step(abs(nuv.y),  fwidth(nuv.y)));
    
    // // 中心坐标线颜色调整
    // color = mix(color, vec3(0.0, 1.0, 0.0), step(abs(uv.x), fwidth(uv.x)));
    // color = mix(color, vec3(1.0, 0.0, 0.0), step(abs(uv.y), fwidth(uv.y)));
    
    // // fragColor = vec4(nuv, 0.0, 1.0);
    // fragColor = vec4(color, 1.0);
    
    // 6. 封装坐标系网格，调优
    vec2 uv = fixUv(fragCoord);
    vec3 color = Grid(uv);
    
    // 线段
    // color += vec3(segment(uv, vec2(01., 2.), vec2(-0.1, -0.5), fwidth(uv.x)));
    
    // 线段上色，利用mix
    color = mix(color, vec3(0.0, 0.6, 1.0), vec3(segment(uv, vec2(01.0, 2.0), vec2(-0.1, - 0.5), fwidth(uv.x))));
    
    // 曲线
    color = mix(color, vec3(1.0, 1.0, 0.0), funcPlot(uv));
    
    fragColor = vec4(color, 1.0);
}
`yarn webpack -c 08-component/webpack.config.js`
`yarn webpack server -c 08-component/webpack.config.js`


```
setInterval(() => {
      const nextIndex = (currentIndex + 1) % children.length;

      const current = children[currentIndex];
      const next = children[nextIndex];

      next.style.transition = "none";
      next.style.transform = `translateX(${100 - 100 * nextIndex}%)`;

      setTimeout(() => {
        next.style.transition = "";
        current.style.transform = `translateX(${-100 * (currentIndex + 1)}%)`;
        next.style.transform = `translateX(${-100 * nextIndex}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 1000);
```


代码解释:
0,1,2,3 // 4张图

每次 move 前，要把 current, next 位置放置到父容器的 0,1 号位置。
current 第一次和每次移动后都在 0 号位置，所以不动，等待动画将其移动到 -1 号位置
next 每次要移动到1号位置，无需动画，等待动画将其移动到 0 号位置

所以对于图 0,1,2,3
移动到 1 号位置位置，translateX 为
100%, 0%, -100%, -200% => ` (100 - x * nextIndex)%`

类似的， setTimeout 触发真正的 move 动画。
0,1,2,3, current 移动到 -1
-100% -200% -300% -400% => `(-100 * (currentIndex + 1))%`

0,1,2,3, next 移动到 0
0% -100% -200% -300 => `(-100 * nextIndex)%`
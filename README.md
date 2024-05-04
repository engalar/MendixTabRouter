# patch mxui-dev.js

| package | 位置 | 外部依赖 | 变更 | 备注 |
| --- | --- | --- | --- | --- |
| react-dom | 4448 | ReactFamily.ReactDOM | e.exports=ReactFamily.ReactDOM | 3935结尾 |
| - | 7294→2408 |  |  |  |
| - | 3840→53 |  |  |  |
| react/jsx-runtime | 5251 | ReactFamily.RuntimeDev | e.exports.Fragment=ReactFamily.RuntimeDev.Fragment,
e.exports.jsx=ReactFamily.RuntimeDev.jsxDEV,
e.exports.jsxs=ReactFamily.RuntimeDev.jsxDEV |  |
| - | 7294→2408 |  |  |  |
| react | 2408 | ReactFamily.React | e.exports=ReactFamily.React | 7294结尾 |
| scheduler | 53 | ReactFamily.ReactDOMScheduler | e.exports=ReactFamily.ReactDOMScheduler | 3840结尾 |

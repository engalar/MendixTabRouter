```html
<script>
        (function () {
            // 创建一个对象来保存原始的 window.mx 值
            let originalMx = undefined;

            // 设置新的 window.mx 对象
            Object.defineProperty(window, 'mx', {
                get: function () {
                    return originalMx;
                },
                set: function (newValue) {
                    // 在这里可以添加你想要的拦截逻辑
                    console.log("Intercepted mx assignment:", newValue);
                    // 这里可以根据需要进行处理
                    newValue._startup = newValue.startup;
                    newValue.startup = async () => {
                        await new Promise((resolve, reject) => {
                            require(['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-runtime.js'], (react, reactDom, jsxRuntime, jsxRuntime2) => { window.React = react; window.ReactDOM = reactDom; window.jsxRuntime = jsxRuntime; window.jsxRuntime2 = jsxRuntime2; resolve() });
                        })
                    };
                    originalMx = newValue;
                },
                configurable: true
            });
        })();
    </script>
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module">
        debugger
        // import "http://localhost:5173/@vite/client";
        import RefreshRuntime from 'http://localhost:5173/@react-refresh';
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => { }
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" >
        debugger
        import { TabRouter } from "http://localhost:5173/src/TabRouter.tsx";

        mendix.lang.registerInDojo("widgets/wengao/tabrouter/TabRouter", TabRouter);
        mx._startup();
    </script>>
```

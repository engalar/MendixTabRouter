import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import createExternal from "vite-plugin-external";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        createExternal({
            interop: "auto",
            externals: {
                react: "React",
                "dojo/aspect": "Aspect",
                // "react-dom": "ReactDOM",
                // "react/jsx-runtime": "react/jsx-dev-runtime",
                // "react/jsx-runtime": "jsxRuntime",
                // "react/jsx-dev-runtime": "jsxRuntime"
            }
        }),
        react()
    ]
});

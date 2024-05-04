import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import createExternal from "vite-plugin-external";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        createExternal({
            interop: "auto",
            externals: {
                "dojo/aspect": "Aspect",
            }
        }),
        react()
    ]
});

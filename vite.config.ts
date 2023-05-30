import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({ include: ["src"] }),
		...VitePluginNode({
			adapter: "express",
			appPath: './src/main.ts',
			exportName: "index",
			tsCompiler: "esbuild",
		}),
	],
})

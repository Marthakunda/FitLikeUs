// vite.config.ts
import { defineConfig } from "file:///C:/Users/PC/OneDrive/Desktop/FitLikeUs/node_modules/.pnpm/vite@5.4.21_@types+node@25.2.3/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/PC/OneDrive/Desktop/FitLikeUs/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@25.2.3_/node_modules/@vitejs/plugin-react/dist/index.js";
import tsconfigPaths from "file:///C:/Users/PC/OneDrive/Desktop/FitLikeUs/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.9.3_vite@5.4.21_@types+node@25.2.3_/node_modules/vite-tsconfig-paths/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\PC\\OneDrive\\Desktop\\FitLikeUs\\apps\\web";
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQQ1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEZpdExpa2VVc1xcXFxhcHBzXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUENcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxGaXRMaWtlVXNcXFxcYXBwc1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1BDL09uZURyaXZlL0Rlc2t0b3AvRml0TGlrZVVzL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdHNjb25maWdQYXRocygpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy90ZXN0L3NldHVwLnRzJyxcbiAgICBleGNsdWRlOiBbJyoqL2UyZS8qKicsICcqKi9ub2RlX21vZHVsZXMvKionLCAnKiovZGlzdC8qKiddLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1UsU0FBUyxvQkFBb0I7QUFDNVcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLEVBQ2xDLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLFNBQVMsQ0FBQyxhQUFhLHNCQUFzQixZQUFZO0FBQUEsRUFDM0Q7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

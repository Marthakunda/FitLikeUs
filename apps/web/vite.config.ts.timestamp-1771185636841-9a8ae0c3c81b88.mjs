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
    setupFiles: "./src/test/setup.tsx",
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQQ1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEZpdExpa2VVc1xcXFxhcHBzXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUENcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxGaXRMaWtlVXNcXFxcYXBwc1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1BDL09uZURyaXZlL0Rlc2t0b3AvRml0TGlrZVVzL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdHNjb25maWdQYXRocygpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy90ZXN0L3NldHVwLnRzeCcsXG4gICAgZXhjbHVkZTogWycqKi9lMmUvKionLCAnKiovbm9kZV9tb2R1bGVzLyoqJywgJyoqL2Rpc3QvKionXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStVLFNBQVMsb0JBQW9CO0FBQzVXLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNsQyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUEsSUFDWixTQUFTLENBQUMsYUFBYSxzQkFBc0IsWUFBWTtBQUFBLEVBQzNEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

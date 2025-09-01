import path from "path"
import react from "@vitejs/plugin-react"
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer";
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import moveGzFilesPlugin from './gz-plugin';
import uploadS3FilesPlugin from './s3-uploader-plugin';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [viteCompression({
    deleteOriginFile: true,
    ext: ".gz",
  }),ViteMinifyPlugin({
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
    decodeEntities: true,
  }), react(), visualizer(), moveGzFilesPlugin(), uploadS3FilesPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    minify: true,
    cssMinify: true,
  }
})
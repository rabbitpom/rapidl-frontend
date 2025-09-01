import path, { resolve, parse } from 'path';
import { promises as fs } from 'fs';
import fsExtra from 'fs-extra';

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function moveGzFilesPlugin() {
  let outputPath;

  return {
    name: 'move-gz-files',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      outputPath = path__default.isAbsolute(config.build.outDir) ? config.build.outDir : path__default.join(config.root, config.build.outDir);
    },
    async closeBundle() {
      const gzDir = resolve(outputPath, 'gz');

      await fsExtra.ensureDir(gzDir);

      const moveGzFiles = async (dir) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = resolve(dir, entry.name);
          if (entry.isDirectory()) {
            await moveGzFiles(fullPath);
          } else if (entry.isFile() && fullPath.endsWith('.gz')) {
            const { name } = parse(entry.name);
            const newFileName = name; // Remove the .gz extension

            if (entry.name === 'index.html.gz') {
              // Rename index.html.gz to index.html in place
              console.log("[gz-plugin]: Found index.html.gz, renaming to index.html");
              const newPath = resolve(dir, newFileName);
              await fsExtra.move(fullPath, newPath);
            } else {
              // Move and rename other .gz files to the gz folder
              const destPath = resolve(gzDir, newFileName);
              console.log(`[gz-plugin]: Found ${name}, renaming to ${newFileName}, and moving to ${destPath}`);
              await fsExtra.move(fullPath, destPath);
            }
          }
        }
      };

      // Delay execution by a few seconds
      setTimeout(async () => {
        await moveGzFiles(outputPath);
        console.log("[gz-plugin]: Successfully moved .gz files")
      }, 500);
    },
  };
}

export default moveGzFilesPlugin;

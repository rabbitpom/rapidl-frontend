import path, { resolve, parse } from 'path';
import fsExtra from 'fs-extra';
import fs from 'fs';
import s3 from 's3-node';
import ProgressBar from 'progress';
import crypto from 'crypto';

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function uploadS3FilesPlugin() {
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

      // Delay execution by a few seconds
      setTimeout(async () => {
        //await moveGzFiles(outputPath);

        const uploadEnabled = process.env.UPLOAD_ENABLED === 'true';
        if (!uploadEnabled) {
          console.log("[s3]: Uploaded enabled cancelled");
          console.log("[s3]: Cancelled upload operation");
          return;
        }
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const bucketRegion = process.env.S3_REGION;
        const bucketName = process.env.S3_BUCKET;
        if (accessKeyId === undefined) {
          console.log("[s3]: No AWS_ACCESS_KEY_ID found");
          console.log("[s3]: Cancelled upload operation");
          return;
        }
        if (secretAccessKey === undefined) {
          console.log("[s3]: No AWS_SECRET_ACCESS_KEY found");
          console.log("[s3]: Cancelled upload operation");
          return;
        }
        if (bucketRegion === undefined) {
          console.log("[s3]: No S3_REGION found");
          console.log("[s3]: Cancelled upload operation");
          return;
        }
        if (bucketName === undefined) {
          console.log("[s3]: No S3_BUCKET found");
          console.log("[s3]: Cancelled upload operation");
          return;
        }

        //const gz_entries = fs.readdir(resolve(outputPath, 'gz'), { withFileTypes: true });
        //const assets_entries = fs.readdir(resolve(outputPath, 'assets'), { withFileTypes: true });
        
        let client = s3.createClient({ s3Options: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          region: bucketRegion,
        } });

        try {
          // Deleting /index.html
          let bar1 = new ProgressBar('\x1b[32m[s3]: Deleting S3 /index.html \x1b[0m\x1b[33m[:bar] :current/:total\x1b[0m', { total: 1, width: 100 });
          await new Promise((resolve, reject) => {
              let emitter = client.deleteObjects({
                  Bucket: bucketName, 
                  Delete: {
                      Objects: [
                          { Key: "index.html" }
                      ], 
                      Quiet: false
                  }
              });
              emitter.on('error', reject);
              emitter.on('end', resolve);
          });
          bar1.tick();
      
          // Deleting /assets
          let bar2 = new ProgressBar('\x1b[32m[s3]: Deleting S3 /assets \x1b[0m\x1b[33m[:bar] :current/:total\x1b[0m', { total: 1, width: 100 });
          await new Promise((resolve, reject) => {
              let emitter = client.deleteDir({
                  Bucket: bucketName,
                  Prefix: 'assets/',
              });
              emitter.on('error', reject);
              emitter.on('end', resolve);
          });
          bar2.tick();

          let bar3 = new ProgressBar('\x1b[32m[s3]: Uploading S3 index.html with Content-Encoding: gzip \x1b[0m\x1b[33m[:bar] :current/:total\x1b[0m', { total: 1, width: 100 });
          await new Promise((resolve, reject) => {
              let emitter = client.uploadFile({
                  s3Params: {
                    Bucket: bucketName,
                    Key: "index.html",
                    ContentEncoding: "gzip",
                  },
                  localFile: `${outputPath}\\index.html`,
              });
              emitter.on('error', reject);
              emitter.on('end', resolve);
             resolve();
          });
          bar3.tick();

          {
            const assets_entries = fs.readdirSync(`${outputPath}\\assets`);
            let arrayOfFiles = []
            assets_entries.forEach(function(file) {
              arrayOfFiles.push(path.join(outputPath, "assets/", file));
            })

            let bar4 = new ProgressBar('\x1b[32m[s3]: Uploading S3 contents of assets/ \x1b[0m\x1b[33m[:bar] :current/:total\x1b[0m', { total: arrayOfFiles.length, width: 100 });
            let promises = [];
            arrayOfFiles.forEach((file) => {
                promises.push(new Promise((resolve, reject) => {
                    let params = {
                        localFile: file,
                        s3Params: {
                          Bucket: bucketName,
                          Key: `assets/${path.basename(file)}`,
                        },
                    };
        
                    let uploader = client.uploadFile(params);
                    uploader.on('error', (e) => {
                        console.error(e.stack);
                        reject();
                    });
                    uploader.on('end', function() {
                        bar4.tick();
                        resolve();
                    });
                }));
            });
            await Promise.all(promises);
          }

          {
            const assets_entries = fs.readdirSync(`${outputPath}\\gz`);
            let arrayOfFiles = []
            assets_entries.forEach(function(file) {
              arrayOfFiles.push(path.join(outputPath, "gz/", file));
            })

            let bar5 = new ProgressBar('\x1b[32m[s3]: Uploading S3 contents of gz/ to assets/ with Content-Encoding: gzip \x1b[0m\x1b[33m[:bar] :current/:total\x1b[0m', { total: arrayOfFiles.length, width: 100 });
            let promises = [];
            arrayOfFiles.forEach((file) => {
                promises.push(new Promise((resolve, reject) => {
                    let params = {
                        localFile: file,
                        s3Params: {
                          Bucket: bucketName,
                          Key: `assets/${path.basename(file)}`,
                          ContentEncoding: "gzip",
                        },
                    };
        
                    let uploader = client.uploadFile(params);
                    uploader.on('error', (e) => {
                        console.error(e.stack);
                        reject();
                    });
                    uploader.on('end', function() {
                      bar5.tick();
                        resolve();
                    });
                }));
            });
            await Promise.all(promises);
          }

          console.log("[s3]: Finished upload");
        } catch (error) {
            console.error(error);
        }
      }, 1000);
    },
  };
}

export default uploadS3FilesPlugin;

const fs = require("fs-extra");
const glob = require("glob");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminSvgo = require("imagemin-svgo");

(async () => {
  const pattern = "**/*.{jpg,jpeg,png,gif,svg}";
  const inputPath = process.cwd() + "/input";
  const outputPath = process.cwd() + "/output";
  const options = {
    use: [
      imageminMozjpeg({
        quality: 80,
        progressive: true,
      }),
      imageminPngquant({
        quality: [0.8, 0.9],
        speed: 2,
        strip: true,
      }),
      imageminGifsicle({
        optimizationLevel: 1,
        colors: 256,
      }),
      imageminSvgo({
        plugins: [
          {
            cleanupNumericValues: {
              floatPrecision: 5,
            },
          },
          {
            convertPathData: {
              floatPrecision: 5,
            },
          },
          {
            transformsWithOnePath: {
              floatPrecision: 5,
            },
          },
          {
            convertTransform: {
              floatPrecision: 5,
            },
          },
          {
            cleanupListOfValues: {
              floatPrecision: 5,
            },
          },
        ],
      }),
    ],
  };

  const fileList = glob.sync(pattern, {
    nodir: true,
    cwd: inputPath,
    root: inputPath,
  });

  if (!fileList.length) {
    console.error("file not found");
  } else {
    for (const path of fileList) {
      console.log(inputPath + path);
      const readFile = fs.readFileSync(inputPath + "/" + path);
      const imageData = await imagemin.buffer(readFile, options);
      fs.outputFileSync(outputPath + "/" + path, imageData);
    }
    console.log(`${fileList.length} files Images optimized`);
  }
  setTimeout(() => {}, 3000);
})();

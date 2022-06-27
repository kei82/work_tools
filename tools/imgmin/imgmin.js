import fs from "fs-extra";
import glob from "glob";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";

(async () => {
  const pattern = "**/*.{jpg,jpeg,png,svg}";
  const inputPath = process.cwd() + "/input";
  const outputPath = process.cwd() + "/output";
  const options = {
    plugins: [
      imageminMozjpeg({
        quality: 80,
        progressive: true,
      }),
      imageminPngquant({
        quality: [0.8, 0.9],
        speed: 2,
        strip: true,
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

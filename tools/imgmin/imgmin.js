module.exports = async cmd => {
  const imagemin = require("imagemin");
  const imageminMozjpeg = require("imagemin-mozjpeg");
  const imageminPngquant = require("imagemin-pngquant");
  const imageminSvgo = require("imagemin-svgo");

  let pattern = "**/*.{jpg,JPG,jpeg,JPEG,png,PNG,svg}";
  let inputPath = cmd.root + pattern;
  let outputPath = cmd.output;

  await imagemin([inputPath], outputPath, {
    use: [
      imageminMozjpeg({
        quality: 80
      }),
      imageminPngquant({
        quality: [0.7, 0.8],
        speed: 1,
        strip: true
      }),
      imageminSvgo({
        plugins: [
          {
            cleanupNumericValues: {
              floatPrecision: 5
            }
          },
          {
            convertPathData: {
              floatPrecision: 5
            }
          },
          {
            transformsWithOnePath: {
              floatPrecision: 5
            }
          },
          {
            convertTransform: {
              floatPrecision: 5
            }
          },
          {
            cleanupListOfValues: {
              floatPrecision: 5
            }
          }
        ]
      })
    ]
  });

  console.log("Images optimized");
};

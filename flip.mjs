import sharp from "sharp";
import fs from "fs";

const dirname = "./public/pokemon";

fs.readdir(dirname, function (err, filenames) {
  if (err) {
    onError(err);
    return;
  }
  filenames.forEach(function (filename) {
    sharp(dirname + "/" + filename)
      .flop()
      .toFormat("png")
      .png({ quality: 100 })
      .toFile(dirname + "/flipped/" + filename);
  });
});

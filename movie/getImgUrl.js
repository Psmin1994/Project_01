import fs from "fs";
import path from "path";
import axios from "axios";

const __filename = path.resolve();

var getImgUrl = async (img, dirname) => {
  if (img) {
    const imgResult = await axios.get(img.url, {
      responseType: "arraybuffer",
    });

    const imgPath = path.normalize(`${__filename}/src/public/img/poster/${dirname}/${img.name}.jpg`);

    fs.writeFileSync(imgPath, imgResult.data);

    return imgPath;
  }
};

export default getImgUrl;

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = multer.diskStorage({
  destination: "upload",
  filename: (req, file, cd) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === 1) {
      cd(null, `${Date.now()}-ashStore-${file.originalname}`);
    } else {
      return {
        bucketName: "photos",
        filename: `${Date.now()}-ashStore-${file.originalname}`,
      };
    }
  },
});

// const storage = new GridFsStorage({
//   url: process.env.DB,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimeType) === -1) {
//       const filename = `${Date.now()}-any-name-${file.orginalname}}`;
//       return filename;
//     }

//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}-any-name-${file.originalname}`,
//     };
//   },
// });

module.exports = multer({ storage });

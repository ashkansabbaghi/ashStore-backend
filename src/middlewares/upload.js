const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = multer.diskStorage({
  // destination: "public/upload",
  destination: (req, file, cb) => {
    cb(null, "public/img")
  },
  filename: (req, file, cb) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === 1) {
      // console.log(
      //   Date.toLocaleDateString("fa-IR", {
      //     weekday: "long",
      //     year: "numeric",
      //     month: "long",
      //     day: "numeric",
      //   })
      // );
      cb(null, `${req.user.username}-${Date.now()}-${file.originalname}`);
    } else {
      // return {
        cb(new Error('just png and jpg files'))

        // bucketName: "photos",
        // filename: `${Date.now()}-ashStore-${file.originalname}`,
      // };
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

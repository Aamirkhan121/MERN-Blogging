// const multer = require("multer");
// const path = require("path");

// // STORAGE
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/posts");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// // FILE FILTER
// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only JPG, JPEG, PNG allowed"), false);
// };

// module.exports = multer({ storage, fileFilter });

const multer = require("multer");

const storage = multer.memoryStorage(); // file RAM me aayegi

module.exports = multer({ storage });

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "src/attachment/file");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const maxSize = 5 * 1024 * 1024; // 5mb
const upload = multer({
  // storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Only .png .jpeg .jpg .doc .docx .pdf format allowed")
      );
    }
  },
  limits: { files: 1, fileSize: maxSize },
});

export default upload;
